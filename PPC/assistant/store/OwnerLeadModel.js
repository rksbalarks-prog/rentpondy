// ai_owner_lead — owner listing intake captured by the assistant's onboarding
// flow. This is a lightweight LEAD (for the team to follow up + add photos/plan),
// NOT a public property listing. Saved to whatever DB the backend is connected to.
import mongoose from 'mongoose';

const OwnerLeadSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true }, // verified session phone
    propertyMode: String,
    propertyType: String,
    bedrooms: String,
    floorNo: String,
    carParking: String,
    lift: String,
    rentalAmount: String,
    advanceAmount: String,
    totalArea: String,
    area: String,
    pinCode: String,
    streetName: String,
    contactPhone: String,
    lang: String,
    // Admin follow-up workflow.
    status: { type: String, default: 'new' }, // new | contacted | preapproved | dropped
    remark: { type: String, default: '' },
    followupDate: Date,
    calledBy: String,
    rentId: Number, // set once converted to a PreApproved property
  },
  { timestamps: true, collection: 'ai_owner_lead' }
);

export default mongoose.models.AiOwnerLead ||
  mongoose.model('AiOwnerLead', OwnerLeadSchema);
