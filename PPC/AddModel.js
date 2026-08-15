// Rent Propert AddModel


const mongoose = require('mongoose');


const AddRentSchema = new mongoose.Schema({
  phoneNumber: { type: String},
  rentId: { type: Number},
      rentalAmount: { type: Number, default: 0 },


  planName: { type: String }, // Plan name assigned to property
  planCreatedAt: { type: Date, default: Date.now },

    assignedPhoneNumber: String,
    
//   setPpcId: { type: Boolean, default: false },

//   setPpcIdAssignedAt: {
//   type: Date
// },

 setRentId: { type: Boolean, default: false },
  setRentAssignedAt: { type: Date },

previouslyAssignedPhoneNumber: String,
previouslyAssignedAt: Date,


  views: { type: Number, default: 0 },

  countryCode: {
    type: String,
    required: true,
    default: '+91',
  },
  alternateCountryCode: {
    type: String,
    // required: true,
    default: '+91',
  },


  minPrice:{
    type:String,
  },
  maxPrice: {
    type:String,
  },

  paymentType:{
    type:String
  },

  propertyMode: { type: String },

  propertyType: { type: String },

  propertyAge: { type: String },

  rentType: { type: String   },


    securityDeposit:{ type:Number},

      availableDate: { type: String }, 

   familyMembers: { type: String },         
  foodHabit: { type: String },              
  jobType: { type: String },                
  petAllowed: { type:String}, 

  status: {
    type: String,
    enum: ['incomplete','active','expired','pending', 'complete','sendInterest', 'soldOut', 'reportProperties', 'needHelp', 'contact', 'favorite', 'alreadySaved', 'favoriteRemoved', 'delete','undo','contact send'],
    default: 'incomplete',
  },
  

  // Snapshot of `status` (see /admin-soft-delete which copies status → previousStatus
  // via findOneAndUpdate, bypassing validators). It must therefore accept EVERY value
  // `status` can hold — a narrow enum here made any later property.save() on such a doc
  // throw ValidationError (500 on /update-property-status "Mark as Expired"). No enum.
  previousStatus: { type: String },

  featureStatus: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no',
  },


  interestRequests: [
    { phoneNumber: { type: String },
    date: { type: Date, default: Date.now },
   
  }

  ],

  soldOutReport: [{ phoneNumber: { type: String }, 
    date: { type: Date, default: Date.now },
   }],

  helpRequests: [{
    phoneNumber: { type: String },
    selectHelpReason: {
      type: String,
      enum: [
        'Help Me to Buy this Property',
        'Book for Property Visit',
        'Loan Help',
        'Property Valuation',
        'Document Verification',
        'Property Surveying',
        'EC',
        'Patta Name Change',
        'Registration Help',
        'Others'
      ],
    },
    comment: {
      type: String,
    },
    requestedAt: { type: Date, default: Date.now }
  }],
  
  
  reportProperty: [{ phoneNumber: { type: String },
    reason: {
      type: String,
    },
    // Enforce one of your preset reasons
    selectReasons: {
      type: String,
      enum: [
        'Already Sold',
        'Wrong Information',
        'Not Responding',
        'Fraud',
        'Duplicate Ads',
        'Other'
      ],
    },
    date: { type: Date, default: Date.now },
   }],
   

  contactRequests: [{ phoneNumber: { type: String } ,
    date: { type: Date, default: Date.now },
  }],

  alreadySaved: [{ phoneNumber: { type: String } }],
  
  favoriteRemoved: [{ phoneNumber: { type: String },
    removedAt: { type: Date, default: Date.now },
    }],
    
  favoriteRequests: [{ phoneNumber: { type: String },
    date: { type: Date, default: Date.now },
   }],

   createdBy: {
    type: String,
    default: 'User'
  },

  addedBy: {
    type: String,
    default: ''
  },

  // Role of the admin/staff who added the property (used by Bulk Upload).
  addedByRole: {
    type: String,
    default: ''
  },

  // ── Bulk Excel upload batch tagging (additive) ──
  // Every row inserted by the "Bulk Upload" admin tool shares one bulkUploadId
  // so the whole batch can be listed and reverted as a single unit.
  bulkUploadId: { type: String, default: null },
  bulkUploadAt: { type: Date },
  bulkUploadBy: { type: String, default: '' },


  deletedBy: {
    type: String,
    default: 'User'
  },
  
  deletedAt: {
    type: Date,
    default: Date.now // or null, depending on how you handle deletion
  },
  

  bankLoan: { type: String },
  negotiation: { type: String },


  totalArea: { type: Number },

  ownership: { type: String },

  bedrooms: { type: String },

  kitchen: { type: String },
  kitchenType: { type: String },

  balconies: { type: String },

  floorNo: { type: String },

  wheelChairAvailable:{type:String},

  areaUnit: { type: String },

  propertyApproved: { type: String },
  postedBy: { type: String },

  facing: { type: String },


  description: { type: String },

  furnished: { type: String },
  lift: { type: String },

  attachedBathrooms: { type: String },

  western: { type: String },

  numberOfFloors: { type: String },

  carParking: { type: String },

  rentalPropertyAddress: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  district: { type: String },
  pinCode: { type: Number },
  area: { type: String },
  streetName: { type: String },
  doorNumber: { type: String },
  nagar: { type: String },

  locationCoordinates: {
    type: String, // Format: "latitude,longitude"
    default: '',
    trim: true,
  },


  reason: {
  type: String,
  default: null,
  trim: true
},

updatedBy: {
  type: String,
  default: null,
  trim: true
},

newStatus:{type:String},

  
  

  ownerName: { type: String },
  email: { type: String },

  bestTimeToCall: { type: String },

  // video: { type: String },

  
  video: {
    type: [String],
    default: [],
  },

  photos: {
    type: [String],
    default: [],
  },

  propertyDetails: {
    type: Object,   // You can define more fields if you want
},
// planName: {
//     type: String,   // Example: "Free", "Premium", "Gold"
// },

 planName: {
    type: String, // Free, Premium, etc.
    // default: "Free"
  },
  planCreatedAt: {
    type: Date,
    default: Date.now
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reason: { type: String, default: null, trim: true },

  isDeleted: { type: Boolean, default: false },
  deletionReason: { type: String, default: null, trim: true },
  deletionDate: { type: Date, default: null },

  alternatePhone: { type: String },

    displayContact: {
    type: String,
    default: function() {
      return this.phoneNumber; // Default to owner's number
    }
  },

 planStatus: {
  type:Boolean
 },

 onDemand: {
  type: Boolean,
  default: false
},

onDemandSetBy: {
  name: { type: String, default: null },
  date: { type: Date, default: null }
},

remarks: [{
  text: { type: String, trim: true },
  adminName: { type: String, default: 'Admin' },
  date: { type: Date, default: Date.now }
}],

// ✅ City base: 'PY' = Pondicherry, 'CH' = Chennai.
// Default 'PY' because the platform launched in Pondicherry; legacy
// documents without this field are treated as 'PY' by the base filter.
base: {
  type: String,
  enum: ['PY', 'CH'],
  default: 'PY'
},

// When true, listing has no fixed rent — UI shows "Call Owner" instead
// of the rentalAmount number. rentalAmount stays Number-typed (defaults to 0)
// so sort/filter/range queries continue to work unchanged.
callForRent: {
  type: Boolean,
  default: false
}

}, {
  timestamps: true,

});


AddRentSchema.pre('validate', async function (next) {
  if (!this.isNew) {
    const original = await this.constructor.findOne({ _id: this._id }).lean();
    this._originalStatus = original?.status || null;
  }
  next();
});


AddRentSchema.pre('save', function (next) {
  const allowedOverride = ['delete', 'pending', 'expired'];

  if (this.isModified('status') && this._originalStatus === 'active') {
    if (!allowedOverride.includes(this.status)) {
      this.status = 'active'; // prevent override
    }
  }

  next();
});


// Middleware Methods for Handling Favorite Requests
AddRentSchema.methods.addFavoriteRequest = function (userPhone) {
  // Check if the user has already removed this property before
  const removedIndex = this.favoriteRemoved.findIndex(fav => fav.phoneNumber === userPhone);
  if (removedIndex !== -1) {
    this.favoriteRemoved.splice(removedIndex, 1); // Remove from favoriteRemoved
  }

  // Add to favoriteRequests only if not already in the list
  if (!this.favoriteRequests.some(fav => fav.phoneNumber === userPhone)) {
    this.favoriteRequests.push({ phoneNumber: userPhone });
  }

  return this.save();
};

AddRentSchema.methods.removeFavoriteRequest = function (userPhone) {
  // Remove from favoriteRequests
  this.favoriteRequests = this.favoriteRequests.filter(fav => fav.phoneNumber !== userPhone);

  // Add to favoriteRemoved
  this.favoriteRemoved.push({ phoneNumber: userPhone });

  return this.save();
};

// City-base scope: every list/count/aggregate query is auto-filtered to the
// request's active base (ALL/PY/CH). See utils/cityScopePlugin.js.
AddRentSchema.plugin(require('./utils/cityScopePlugin'));

module.exports = mongoose.model('AddModel', AddRentSchema);




