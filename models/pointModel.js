const mongoose = require('mongoose');


//////////////////////////////////////////////
//// SCHEMA CONFIGURATION  ////
//////////////////////////////////////////////
const pointSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    points: {
        type: Number,
        default: 10,
    }
}, {
    timestamps: true,
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////

pointSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "_id name email",
	});

	next();
});


//////////////////////////////////////////////
//// MODEL AND COLLECTION ////
//////////////////////////////////////////////
const Point = mongoose.model('Point', pointSchema);
module.exports = Point;