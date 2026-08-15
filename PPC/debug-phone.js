const mongoose = require('mongoose');
const UserLogin = require('./src/path/to/UserModel'); // Update this path to your actual UserModel location

// Connection string - update with your MongoDB URI
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

async function debugPhone() {
  try {
    await mongoose.connect(mongoUri);
    console.log('? Connected to MongoDB');

    const phone = '7094422941';
    
    // Find ALL records with this phone (before deduplication)
    const records = await UserLogin.find({ phone }).sort({ loginDate: -1 });
    
    console.log(`\n?? Total records found for phone ${phone}: ${records.length}`);
    console.log('?'.repeat(80));
    
    if (records.length === 0) {
      console.log('? No records found for this phone');
      return;
    }
    
    // Display each record
    records.forEach((record, idx) => {
      console.log(`\n?? Record ${idx + 1}:`);
      console.log(`   Phone: ${record.phone}`);
      console.log(`   OTP Status: ${record.otpStatus}`);
      console.log(`   Login Date: ${record.loginDate}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Conversion Status: ${record.conversionStatus}`);
      console.log(`   Conversion Date: ${record.conversionDate}`);
      console.log(`   Conversion Updated By: ${record.conversionUpdatedBy}`);
      console.log(`   Last Update Date: ${record.updateDate}`);
      console.log(`   MongoDB ID: ${record._id}`);
    });
    
    // Analysis
    console.log('\n' + '?'.repeat(80));
    console.log('?? ANALYSIS:');
    
    const withConversion = records.filter(r => r.conversionStatus && r.conversionStatus !== 'pending');
    console.log(`   Records with non-pending conversion: ${withConversion.length}`);
    withConversion.forEach((r, i) => {
      console.log(`     - Record ${i + 1}: ${r.conversionStatus} (${r.conversionDate})`);
    });
    
    const priorityOrder = records.map(r => ({
      id: r._id.toString(),
      otpStatus: r.otpStatus,
      loginDate: r.loginDate,
      conversionStatus: r.conversionStatus,
      updated: r.updateDate
    }));
    
    console.log('\n   OTP Status Priority (which would be picked):');
    const statusPriority = (s) => (s === 'verified' ? 2 : s === 'pending' ? 1 : 0);
    priorityOrder.forEach((p, i) => {
      console.log(`     - Record ${i + 1}: OTP=${p.otpStatus} (priority: ${statusPriority(p.otpStatus)}), Conversion: ${p.conversionStatus}`);
    });
    
    console.log('\n' + '?'.repeat(80));
    
  } catch (error) {
    console.error('? Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n? Disconnected from MongoDB');
  }
}

debugPhone();
