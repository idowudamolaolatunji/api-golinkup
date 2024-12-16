    
const mongoose = require('mongoose');


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
    whatsappNumber: {
        type: String,
        unique: true,
        required: true,
    },
    displayImage: String,
    targetGender: {
        type: String,
        enum: ["male", "female", "all"],
        default: "all"
    },
    displayDuration: {
        type: Number,
        enum: [6, 12, 24, 48, 168, 672],
        default: 6,
    },
}, {
    timestamps: true,
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////

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