// ael_backend/scripts/migrate_to_live.js
import { MongoClient } from "mongodb";

const localUri = "mongodb://127.0.0.1:27017/ael";
const targetUri =
  "mongodb://ael_admin:AELAdmin2F026Secure@209.74.87.115:27017/ael?authSource=admin";

async function runMigration() {
  console.log("==========================================");
  console.log("STARTING MONGODB DATABASE MIGRATION TO LIVE");
  console.log("==========================================");
  console.log("Source (Local):", localUri);
  console.log("Target (Live):", "209.74.87.115:27017/ael (authenticated)");

  const localClient = new MongoClient(localUri);
  const targetClient = new MongoClient(targetUri);

  try {
    await localClient.connect();
    console.log("Connected to local database.");

    await targetClient.connect();
    console.log("Connected to live database.");

    const localDb = localClient.db("ael");
    const targetDb = targetClient.db("ael");

    const localCollections = await localDb.listCollections().toArray();
    console.log(`Found ${localCollections.length} collections in local database.\n`);

    const summary = [];

    for (const colInfo of localCollections) {
      const colName = colInfo.name;
      // Skip system collections if any
      if (colName.startsWith("system.")) continue;

      const localCol = localDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      const localDocs = await localCol.find({}).toArray();
      const localCount = localDocs.length;

      // Transfer documents
      let insertedCount = 0;
      if (localCount > 0) {
        // Clear target collection first to ensure exact replica without duplicate key errors
        await targetCol.deleteMany({});

        // Insert documents in chunks of 500 to prevent payload limits
        const chunkSize = 500;
        for (let i = 0; i < localDocs.length; i += chunkSize) {
          const chunk = localDocs.slice(i, i + chunkSize);
          const result = await targetCol.insertMany(chunk, { ordered: false });
          insertedCount += result.insertedCount;
        }
      }

      // Copy indexes (except default _id index)
      try {
        const indexes = await localCol.indexes();
        for (const idx of indexes) {
          if (idx.name === "_id_") continue;
          const { key, name, unique, sparse, expireAfterSeconds } = idx;
          const options = { name };
          if (unique) options.unique = true;
          if (sparse) options.sparse = true;
          if (expireAfterSeconds !== undefined)
            options.expireAfterSeconds = expireAfterSeconds;

          try {
            await targetCol.createIndex(key, options);
          } catch (idxErr) {
            // Index might already exist or conflict, log as notice
            console.warn(`  [Notice] Index ${name} on ${colName}:`, idxErr.message);
          }
        }
      } catch (e) {
        console.warn(`  [Warning] Could not copy indexes for ${colName}:`, e.message);
      }

      const finalTargetCount = await targetCol.countDocuments();
      summary.push({
        collection: colName,
        localCount,
        liveCount: finalTargetCount,
        status: localCount === finalTargetCount ? "MATCH" : "MISMATCH",
      });

      console.log(
        `✓ ${colName.padEnd(25)} : Local = ${String(localCount).padStart(5)} | Live = ${String(finalTargetCount).padStart(5)} [${localCount === finalTargetCount ? "SUCCESS" : "MISMATCH"}]`
      );
    }

    console.log("\n==========================================");
    console.log("MIGRATION SUMMARY:");
    console.log("==========================================");
    let allMatched = true;
    for (const item of summary) {
      if (item.status !== "MATCH") allMatched = false;
    }
    if (allMatched) {
      console.log("ALL COLLECTIONS AND DOCUMENTS MATCH 100%!");
    } else {
      console.error("SOME COLLECTIONS HAD MISMATCHES!");
    }
    console.log("==========================================");
  } catch (err) {
    console.error("MIGRATION FAILED WITH ERROR:", err);
  } finally {
    await localClient.close();
    await targetClient.close();
    console.log("Closed database connections.");
  }
}

runMigration();
