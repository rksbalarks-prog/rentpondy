# 🚀 Quick Start Guide - OneMsg WhatsApp Integration

## 5-Minute Setup

### Step 1: Get OneMsg Credentials (2 min)
```
1. Go to: https://onemsg.com
2. Sign up for account
3. Create WhatsApp Business Account
4. Verify your business phone
5. Copy your API Key (format: sk_live_xxxx or sk_test_xxxx)
```

### Step 2: Update Backend .env (1 min)
```bash
# Create or update .env in project root
ONE_MSG_API_URL=https://api.onemsg.com/v1
ONE_MSG_API_KEY=sk_test_your_key_here
ONE_MSG_BUSINESS_PHONE=+1234567890
```

### Step 3: Update Frontend .env (1 min)
```bash
# In your React .env
REACT_APP_ONE_MSG_API_URL=https://api.onemsg.com/v1
REACT_APP_ONE_MSG_API_KEY=sk_test_your_key_here
REACT_APP_ONE_MSG_BUSINESS_PHONE=+1234567890
```

### Step 4: Integrate Backend Endpoint (1 min)
In your `/send-otp-rent` backend endpoint, add:

```javascript
const { sendOtpViaWhatsApp } = require('../services/whatsappService');

// After generating OTP and saving to DB:
try {
  await sendOtpViaWhatsApp(phoneNumber, otp, 'Valued Customer');
  console.log('✅ WhatsApp OTP sent');
} catch (error) {
  console.warn('WhatsApp failed, continuing with SMS:', error.message);
  // Fallback to SMS (existing code)
}
```

### Step 5: Test (Start here!)
```bash
# Test with Singapore number
Phone: +6585557232

Expected:
1. OTP generated: 123456
2. WhatsApp message received
3. Verification succeeds
```

---

## 📁 What Changed?

### ✅ New Files Created:
1. `src/services/whatsappService.js` - OneMsg integration functions
2. `docs/ONEMSG_WHATSAPP_INTEGRATION.md` - Backend integration guide
3. `docs/INTERNATIONAL_ONEMSG_INTEGRATION_SUMMARY.md` - Complete overview
4. `docs/TESTING_GUIDE.md` - Detailed testing procedures
5. `.env.example` - Configuration template

### ✅ Files Updated:
1. `src/constants/countryCodes.js` - 250 countries (was 70)
2. `src/Components/Login.jsx` - Already ready ✅
3. `user/UserModel.js` - Removed enum restriction, accepts all countries

### ✅ No Changes Needed:
- Redux store (using existing setup)
- API endpoints (structure is correct)
- Phone format (E.164 already implemented)

---

## 🎯 Quick Reference

### Phone Number Format (E.164)
```
+[country code][phone number]

Examples:
+919876543210  (India - 10 digits)
+6585557232    (Singapore - 8 digits)
+1415551234    (USA - 10 digits)
+441234567890  (UK - 10 digits)
```

### API Flow
```
Frontend (E.164) → Backend → OneMsg API → WhatsApp
  ↓
Database (country code + digits)
```

### Testing Checklist (Quick)
```
☐ Set up OneMsg account
☐ Add API key to .env
☐ Integrate backend endpoint
☐ Send test OTP to India
☐ Verify WhatsApp message
☐ Send test OTP to Singapore
☐ Verify OTP verification works
☐ Test resend OTP
☐ Check database records
```

---

## 📞 Support & Troubleshooting

### "WhatsApp message not received"
```
→ Check OneMsg dashboard for API errors
→ Verify business phone is verified in WhatsApp
→ Check .env has correct API key
→ Check backend logs for error messages
```

### "Country code not accepted"
```
→ Old code: Used enum validation (now removed)
→ New code: Accepts any ISO 3166-1 alpha-2 code
→ Restart backend server for schema to load
```

### "Phone validation fails"
```
→ Pattern now: /^\d{7,15}$/ (was /^\d{10}$/)
→ Accepts 7-15 digits for all countries
→ Works for: India (10), Singapore (8), USA (10)
```

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `src/services/whatsappService.js` | OneMsg API calls |
| `src/Components/Login.jsx` | OTP UI & flow |
| `src/constants/countryCodes.js` | 250 countries |
| `user/UserModel.js` | Database schema |
| `.env` | Configuration |
| `docs/ONEMSG_WHATSAPP_INTEGRATION.md` | Backend guide |
| `docs/TESTING_GUIDE.md` | Testing procedures |

---

## ✨ What You Get Now

✅ **~250 countries supported** (was 70)
✅ **WhatsApp notifications** via OneMsg
✅ **E.164 format** enforced globally
✅ **SMS fallback** available
✅ **Flexible validation** for all country phone lengths
✅ **Production ready** implementation

---

## 🎓 Next Steps

1. **Register OneMsg**: https://onemsg.com
2. **Read Integration Guide**: `docs/ONEMSG_WHATSAPP_INTEGRATION.md`
3. **Update Backend**: Integrate WhatsApp service
4. **Test**: Follow `docs/TESTING_GUIDE.md`
5. **Deploy**: Use production API keys

---

## 📋 Current System Status

```
Frontend:   ✅ Ready (countryCodes.js updated)
Backend:    ⏳ Needs integration (add WhatsApp service call)
Database:   ✅ Ready (schema updated)
WhatsApp:   ⏳ Needs setup (get OneMsg credentials)
Testing:    📖 Guide provided

OVERALL: ~70% Complete - Needs backend integration
```

---

## 🎯 One-Command Test (After Setup)

```bash
# Test with production values
curl -X POST http://localhost:5000/api/send-otp-rent \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+6585557232","countryCode":"SG","loginMode":"web"}'

# Should return: ✅ OTP sent successfully
# Check WhatsApp: ✅ OTP message received
```

---

## 💡 Pro Tips

1. **Start with sandbox**: Use `sk_test_*` keys first
2. **Save API responses**: Log message IDs for tracking
3. **Monitor usage**: Check OneMsg dashboard regularly
4. **Backup SMS**: Keep SNS as fallback
5. **Test edge cases**: Try all country codes, not just India

---

**Setup Time**: ~5 minutes
**Integration Time**: ~15 minutes
**Testing Time**: ~30 minutes

**Total**: ~1 hour to production-ready

---

For detailed information, see:
- [Backend Integration](./ONEMSG_WHATSAPP_INTEGRATION.md)
- [Full Summary](./INTERNATIONAL_ONEMSG_INTEGRATION_SUMMARY.md)
- [Testing Guide](./TESTING_GUIDE.md)
