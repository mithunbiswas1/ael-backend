// scripts/fix_subscription_dates.js
import { MongoClient } from "mongodb";

const uri =
  "mongodb://ael_admin:AELAdmin2F026Secure@209.74.87.115:27017/ael?authSource=admin";

async function fixDates() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("ael");

  console.log("Checking and fixing subscription records...");

  // 1. Fix subscriptions with abnormal expiry (> 2030 and not lifetime)
  const subs = await db.collection("subscriptions").find({}).toArray();
  for (const s of subs) {
    if (s.plan === "yearly" && new Date(s.expiryDate).getFullYear() > 2030) {
      const newExpiry = new Date(
        new Date(s.startDate || s.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000
      );
      await db
        .collection("subscriptions")
        .updateOne({ _id: s._id }, { $set: { expiryDate: newExpiry } });
      console.log("Fixed yearly subscription:", s.transactionId, "->", newExpiry);
    } else if (s.plan === "half_yearly" && new Date(s.expiryDate).getFullYear() > 2030) {
      const newExpiry = new Date(
        new Date(s.startDate || s.createdAt).getTime() + 180 * 24 * 60 * 60 * 1000
      );
      await db
        .collection("subscriptions")
        .updateOne({ _id: s._id }, { $set: { expiryDate: newExpiry } });
      console.log("Fixed half_yearly subscription:", s.transactionId, "->", newExpiry);
    } else if (s.plan === "monthly" && new Date(s.expiryDate).getFullYear() > 2030) {
      const newExpiry = new Date(
        new Date(s.startDate || s.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000
      );
      await db
        .collection("subscriptions")
        .updateOne({ _id: s._id }, { $set: { expiryDate: newExpiry } });
      console.log("Fixed monthly subscription:", s.transactionId, "->", newExpiry);
    }
  }

  // 2. Fix users whose subscription.expiresAt is > 2030 but planKey is not lifetime
  const users = await db.collection("users").find({}).toArray();
  for (const u of users) {
    if (
      u.subscription?.expiresAt &&
      new Date(u.subscription.expiresAt).getFullYear() > 2030 &&
      u.subscription?.planKey !== "lifetime"
    ) {
      const planKey = u.subscription.planKey || "monthly";
      const days = planKey === "yearly" ? 365 : planKey === "half_yearly" ? 180 : 30;
      const start = u.subscription.startDate ? new Date(u.subscription.startDate) : new Date();
      const newExpiry = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      await db.collection("users").updateOne(
        { _id: u._id },
        { $set: { "subscription.expiresAt": newExpiry } }
      );
      console.log("Fixed user subscription:", u.email, planKey, "->", newExpiry);
    }
  }

  console.log("Subscription dates healed successfully!");
  await client.close();
}

fixDates().catch(console.error);
