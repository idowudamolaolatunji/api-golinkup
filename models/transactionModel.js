    
const mongoose = require('mongoose');


//////////////////////////////////////////////
//// SCHEMA CONFIGURATION  ////
//////////////////////////////////////////////
const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["success", "pending", "failed"],
        default: "pending"
    },
    reference: {
        type: String,
        required: true,
    },
    paidAt: {
        type: Date,
        default: Date.now,
    }
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////

transactionSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "_id name email",
	});

	next();
});

//////////////////////////////////////////////
//// MODEL AND COLLECTION ////
//////////////////////////////////////////////
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;