import mongoose from 'mongoose';

async function inspect() {
  await mongoose.connect('mongodb://ael_admin:AELAdmin2F026Secure@209.74.87.115:27017/ael?authSource=admin');
  const page = await mongoose.connection.collection('pages').findOne({ pageKey: 'safety-guidelines' });
  console.log('Page found:', !!page);
  console.log('Title:', page?.title);
  console.log('documentDownloads:', JSON.stringify(page?.sections?.documentDownloads, null, 2));
  console.log('regulatoryAgencies:', JSON.stringify(page?.sections?.regulatoryAgencies, null, 2));
  await mongoose.disconnect();
}

inspect().catch(console.error);
