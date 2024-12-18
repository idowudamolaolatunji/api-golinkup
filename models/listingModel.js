    
const mongoose = require('mongoose');
const { formatfutureDate } = require('../utils/helpers');


//////////////////////////////////////////////
//// SCHEMA CONFIGURATION  ////
//////////////////////////////////////////////
const listingSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["whatsapp", "instagram", "tiktok"],
        required: true,
    },
    link: String,
    country: String,
    details: { type: String, required: true },
    displayPhoto: { type: String, default: "" },
    targetGender: {
        type: String,
        enum: ["male", "female", "both"],
        default: "both"
    },
    displayDurationInHours: {
        type: Number,
        enum: [12, 24, 48, 168, 672],
        default: 12,
    },
    dateTimeToExpire: Date,
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////

listingSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("type")) {
        if(this.type == "whatsapp") {
            this.link = `https://wa.me/${this.details}?text=Hi%20${this.displayName}%2C%20From%20GoLinkUp. %0A%0ASave%20my%20number%20as%20..`
        }
        if(this.type == "instagram") {
            this.link = `https://www.instagram.com/${this.details}`
        }
        if(this.type == "tiktok") {
            this.link = `https://www.tiktok.com/@${this.details}`
        }
    }

    next();
})


listingSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("displayDurationInHours")) {
        this.dateTimeToExpire = formatfutureDate(this.displayDurationInHours);
    }

    next();
});


listingSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "_id name email",
    });

    next();
});


//////////////////////////////////////////////
//// MODEL AND COLLECTION ////
//////////////////////////////////////////////
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;