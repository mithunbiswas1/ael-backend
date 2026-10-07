import mongoose from 'mongoose';

async function inspect() {
  await mongoose.connect('mongodb://ael_admin:AELAdmin2F026Secure@209.74.87.115:27017/ael?authSource=admin');
  const blogs = await mongoose.connection.db.collection('blogs').find({}).toArray();
  for (const b of blogs) {
    const str = JSON.stringify(b);
    if (str.includes('localhost')) {
      console.log('Blog title:', b.title, 'image:', b.image, 'authorImage:', b.authorImage);
    }
  }

  // Also check homebanners
  const banners = await mongoose.connection.db.collection('homebanners').find({}).toArray();
  for (const h of banners) {
    console.log('Banner slides:', JSON.stringify(h.slides, null, 2));
  }

  await mongoose.disconnect();
}

inspect().catch(console.error);
