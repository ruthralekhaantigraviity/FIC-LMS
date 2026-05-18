const mongoose = require('mongoose');

const dbUri = 'mongodb://localhost:27017/fic_lms';

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB. Scanning server for other databases...\n');

    const adminDb = mongoose.connection.client.db().admin();
    const dbsList = await adminDb.listDatabases();
    
    console.log('=== DATABASES ON SERVER ===');
    for (const dbInfo of dbsList.databases) {
      console.log(`- Database Name: "${dbInfo.name}" (Size: ${dbInfo.sizeOnDisk} bytes)`);
      const tempDb = mongoose.connection.client.db(dbInfo.name);
      const collections = await tempDb.listCollections().toArray();
      console.log('  Collections:');
      for (const col of collections) {
        const count = await tempDb.collection(col.name).countDocuments();
        console.log(`    * ${col.name} (${count} documents)`);
      }
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
