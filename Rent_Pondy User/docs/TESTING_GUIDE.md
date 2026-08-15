# Testing Guide - International OTP + WhatsApp Integration

## 🧪 Pre-Testing Checklist

- [ ] Node.js backend server is running
- [ ] MongoDB is connected
- [ ] `.env` file has OneMsg API credentials
- [ ] Frontend `.env` has React variables set
- [ ] npm packages installed (`npm install`)
- [ ] No errors in console

## 📱 Test Numbers by Country

Use these phone numbers for testing (format: country code + number):

| Country | Code | Example | Format |
|---------|------|---------|--------|
| **India** | +91 | `+919876543210` | 10 digits |
| **Singapore** | +65 | `+6585557232` | 8 digits |
| **United States** | +1 | `+1415551234` | 10 digits |
| **United Kingdom** | +44 | `+441234567890` | 10 digits |
| **UAE** | +971 | `+971501234567` | 9 digits |
| **Germany** | +49 | `+49301234567` | 9-10 digits |
| **France** | +33 | `+33123456789` | 9 digits |
| **Brazil** | +55 | `+5511987654321` | 11 digits |
| **Japan** | +81 | `+81312345678` | 10 digits |
| **Australia** | +61 | `+61212345678` | 9 digits |

## 🧑‍💻 Frontend Testing

### Test 1: Country Selection
```
1. Open Login page
2. Click country dropdown
3. Verify all ~250 countries appear
4. Select Singapore (+65)
5. Verify phone input accepts 8 digits
6. Enter: 85557232
```

**Expected Result**:
- Dropdown shows country with flag
- Phone code field shows: +65
- Phone input accepts: 85557232

### Test 2: Send OTP
```
1. Fill in phone: 85557232 (Singapore)
2. Click "Send OTP"
3. Wait for response
4. Check browser console for API call details
```

**Expected Result**:
```
✅ Network tab shows:
POST /api/send-otp-rent
{
  "phoneNumber": "+6585557232",
  "countryCode": "SG",
  "loginMode": "web"
}
Status: 200
```

### Test 3: Toast Notifications
```
1. Try sending OTP with invalid number (too short)
2. Try sending OTP without selecting country
3. Try sending OTP with empty phone
```

**Expected Result**:
- Toast shows appropriate error message
- No API call made
- Form remains unchanged

## 🛡️ Backend Testing with cURL

### Test 4: Send OTP (Backend)
```bash
curl -X POST http://localhost:5000/api/send-otp-rent \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+6585557232",
    "countryCode": "SG",
    "loginMode": "web"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "+6585557232"
}
```

### Test 5: Check Database Record
```bash
# Connect to MongoDB
mongo rentpondy

# Query user login record
db.userlogins.findOne({ phone: "85557232" })
```

**Expected Output**:
```javascript
{
  "_id": ObjectId("..."),
  "phone": "85557232",
  "countryCode": "SG",        // ✅ Accepts any code now
  "otp": "123456",
  "loginMode": "web",
  "otpStatus": "pending",
  "loginDate": ISODate("..."),
  "createdAt": ISODate("...")
}
```

## 📲 WhatsApp Testing

### Test 6: Verify WhatsApp Message Received
```
1. Execute Test 4 (send OTP)
2. Check your WhatsApp Business account
3. You should receive message:
   "Hello User, your OTP is: 123456. 
    Do not share this with anyone. 
    Valid for 10 minutes."
```

**If WhatsApp fails**:
- Check OneMsg API key in `.env`
- Verify business phone is WhatsApp-enabled
- Check OneMsg dashboard for API status
- Check backend logs for error messages

### Test 7: Check Message Status (OneMsg Dashboard)
```
1. Go to https://dashboard.onemsg.com
2. Navigate to Messages section
3. Find your sent message
4. Check status: pending → sent → delivered → read
```

## 🔄 Resend OTP Testing

### Test 8: Verify Resend Flow
```
1. Send OTP to Singapore number
2. Wait for timer (countdown from 30)
3. When timer reaches 0, "Resend OTP" button appears
4. Click "Resend OTP"
5. Check WhatsApp - new OTP received
```

**Expected Result**:
- New OTP generated (different from first)
- WhatsApp message with new OTP received
- Timer resets to 30 seconds

## ✅ OTP Verification Testing

### Test 9: Verify Correct OTP
```
1. Send OTP to test number
2. Check WhatsApp for OTP code (e.g., 123456)
3. Enter OTP in verification form
4. Click "Verify OTP"
```

**Expected Result**:
```
✅ Success toast: "Login successful!"
✅ Redirects to: /mobileviews
✅ Phone stored in Redux
✅ Phone stored in localStorage
```

### Test 10: Verify Wrong OTP
```
1. Send OTP
2. Enter wrong OTP (not the one received)
3. Click "Verify OTP"
```

**Expected Result**:
```
❌ Error toast: "OTP verification failed"
✅ Form remains, allowing retry
✅ Can click "Edit" to change number
```

## 🌐 Multi-Country Testing

### Test 11: Test All Regions
```
Run these sequentially and verify each completes:

Test India:
- Select: India (+91)
- Phone: 9876543210
- Expected OTP digits: 10

Test US:
- Select: United States (+1)
- Phone: 415551234
- Expected OTP digits: 10

Test UK:
- Select: United Kingdom (+44)
- Phone: 1234567890
- Expected OTP digits: 10

Test UAE:
- Select: United Arab Emirates (+971)
- Phone: 501234567
- Expected OTP digits: 9
```

## 📊 Database Validation Testing

### Test 12: Check Country Code Flexibility
```bash
# In MongoDB shell
# Test different country codes
db.userlogins.insertOne({
  phone: "9876543210",
  countryCode: "XX",    // Non-standard code
  otp: "123456",
  loginMode: "web"
})

# Should succeed (no enum error) ✅
```

## 🚨 Error Scenarios Testing

### Test 13: Handle Missing API Key
```
1. Remove ONE_MSG_API_KEY from backend .env
2. Try to send OTP
```

**Expected Result**:
```
Error logged: "ONE_MSG_API_KEY is not configured"
Fallback to SMS (if configured) or error response
```

### Test 14: Handle Invalid Phone
```
1. Enter too short phone: 123
2. Try to send OTP
```

**Expected Result**:
Frontend validation catches it before API call

### Test 15: Handle Network Timeout
```
1. Disconnect internet briefly
2. Try to send OTP
```

**Expected Result**:
```
Error toast: "Network error" or timeout message
```

## 📈 Performance Testing

### Test 16: Rapid Resend
```
1. Send OTP
2. Immediately click Edit
3. Change phone number
4. Send OTP again
5. Repeat 5 times rapidly
```

**Expected Result**:
- All requests processed ✅
- No errors ✅
- Database records created correctly ✅

## 📋 Testing Results Template

```
┌─────────────────────────────────────────┐
│ TEST RESULTS - Date: 2026-02-09         │
├─────────────────────────────────────────┤
│ Test 1: Country Selection        ✅ PASS │
│ Test 2: Send OTP                 ✅ PASS │
│ Test 3: Toast Notifications      ✅ PASS │
│ Test 4: Backend OTP              ✅ PASS │
│ Test 5: Database Record          ✅ PASS │
│ Test 6: WhatsApp Message         ✅ PASS │
│ Test 7: Message Status           ✅ PASS │
│ Test 8: Resend Flow              ✅ PASS │
│ Test 9: Verify Correct OTP       ✅ PASS │
│ Test 10: Verify Wrong OTP        ✅ PASS │
│ Test 11: Multi-Country           ✅ PASS │
│ Test 12: Country Code Flex       ✅ PASS │
│ Test 13: Missing API Key         ✅ PASS │
│ Test 14: Invalid Phone           ✅ PASS │
│ Test 15: Network Timeout         ✅ PASS │
│ Test 16: Rapid Resend            ✅ PASS │
├─────────────────────────────────────────┤
│ OVERALL:                         ✅ PASS │
│ Ready for Production: YES                │
└─────────────────────────────────────────┘
```

## 🐛 Debugging Tips

### If WhatsApp not receiving:
1. Check API key in backend `.env`
2. Verify business phone in OneMsg dashboard
3. Check OneMsg API status page
4. Check backend logs: `console.log(response.data)`

### If OTP not saving:
1. Check MongoDB connection
2. Verify UserModel schema loads
3. Check for database errors: `db.errors()`

### If phone validation fails:
1. Check E.164 format: `+[country][number]`
2. Verify country code in countryCodes array
3. Check phone length: 7-15 digits

### View Complete Logs:
```bash
# Backend
tail -f server.log | grep OTP

# Frontend (Browser Console)
Cmd/Ctrl + Shift + I → Console tab
```

## ✨ Success Criteria

- [ ] All test numbers send OTP successfully
- [ ] WhatsApp messages received within 10 seconds
- [ ] OTP verification works correctly
- [ ] Database records created with correct format
- [ ] Resend functionality works
- [ ] All error cases handled gracefully
- [ ] No console errors or warnings
- [ ] Should work for all 250 countries

---

**Status**: Ready for Testing
**Last Updated**: 2026-02-09
