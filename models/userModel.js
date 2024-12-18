const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


//////////////////////////////////////////////
//// SCHEMA CONFIGURATION  ////
//////////////////////////////////////////////
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, "Enter a valid email"],
        lowercase: true,
        required: true,
        trim: true,
    },
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },
    password: {
        type:String,
        required: true,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same!',
        }
    },
    gender: String,
    phoneNumber: String,
    dialCode: String,
    countryCode: String,
    country: String,
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },

    passwordChangedAt: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
}, {
    timestamps: true,
});


//////////////////////////////////////////////
//// SCHEMA MIDDLEWARES ////
//////////////////////////////////////////////
const saltRound = 12;
userSchema.pre('save', async function(next) {
    // CHECK IF PASSWORD IS ALREADY MODIFIED
    if(!this.isModified('password')) return next();

    // IF NOT HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(this.password, saltRound);
    this.password = hashedPassword;
    this.passwordConfirm = undefined

    next();
});

userSchema.pre("save", async function (next) {
    // UPDATE FIELD ONLY WHEN PASSWORD IS TRULY CHANGED
	if (this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 100;
	next();
});


//////////////////////////////////////////////
//// INSTANCE METHODS ////
//////////////////////////////////////////////

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return jwtTimeStamp < changeTimeStamp;
	}
	// return false means not changed
	return false;
};

userSchema.methods.comparePassword = async function (plainPassword, hashedPassword) {
	const encrypted = await bcrypt.compare(plainPassword, hashedPassword);
	return encrypted;
};


//////////////////////////////////////////////
//// MODEL AND COLLECTION ////
//////////////////////////////////////////////
const User = mongoose.model('User', userSchema);
module.exports = User;