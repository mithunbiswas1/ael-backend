import mongoose from 'mongoose';

const LIVE_MONGO_URI = 'mongodb://ael_admin:AELAdmin2F026Secure@209.74.87.115:27017/ael?authSource=admin';
const TARGET_BASE = 'https://api.charutec.com';

function replaceUrlInObject(obj) {
  let changed = false;
  if (!obj || typeof obj !== 'object') return false;

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      let newVal = val;
      // Replace localhost references
      if (
        newVal.includes('localhost:8005') ||
        newVal.includes('localhost:8000') ||
        newVal.includes('127.0.0.1:8005') ||
        newVal.includes('127.0.0.1:8000')
      ) {
        newVal = newVal.replace(
          /https?:\/\/(localhost|127\.0\.0\.1):(8005|8000)/gi,
          TARGET_BASE
        );
      }

      // If it's a media URL field that has a relative path like /public/upload/...
      if (
        ['image', 'imageUrl', 'videoUrl', 'pdfUrl', 'siteLogo', 'footerLogo', 'favicon', 'page_banner_image', 'chairman_image'].includes(key) &&
        (newVal.startsWith('/public/upload') || newVal.startsWith('public/upload'))
      ) {
        const clean = newVal.startsWith('/') ? newVal.slice(1) : newVal;
        newVal = `${TARGET_BASE}/${clean}`;
      }

      if (newVal !== val) {
        obj[key] = newVal;
        changed = true;
      }
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'object') {
          const subChanged = replaceUrlInObject(item);
          if (subChanged) changed = true;
        }
      }
    } else if (typeof val === 'object' && val !== null) {
      const subChanged = replaceUrlInObject(val);
      if (subChanged) changed = true;
    }
  }

  return changed;
}

async function run() {
  console.log('Connecting to live MongoDB...');
  await mongoose.connect(LIVE_MONGO_URI);
  console.log('Connected!');

  const collections = await mongoose.connection.db.listCollections().toArray();
  let totalUpdated = 0;

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const collection = mongoose.connection.db.collection(colName);
    const docs = await collection.find({}).toArray();

    for (const doc of docs) {
      const docCopy = JSON.parse(JSON.stringify(doc));
      const hasChanges = replaceUrlInObject(docCopy);

      if (hasChanges) {
        delete docCopy._id;
        await collection.updateOne({ _id: doc._id }, { $set: docCopy });
        console.log(`[${colName}] Updated doc ID: ${doc._id}`);
        totalUpdated++;
      }
    }
  }

  console.log(`\nMigration complete! Total documents updated across all collections: ${totalUpdated}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
