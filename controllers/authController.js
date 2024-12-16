const Point = require('../models/pointModel');
const User = require('../models/userModel');
const { asyncWrapper } = require('../utils/handlers');
const { signToken } = require('../utils/helpers');



exports.signupUser = asyncWrapper(async function(req, res) {
    const { name, gender, phoneNumber, email, password, passwordConfirm } = req.body;

    // CHECK IF THE EMAIL ALREADY EXISTS
    const emailExist = await User.findOne({ email });
    if(emailExist) return res.json({ message: 'Email already exist!!' });

    // CREATE USER
    const newUser = await User.create({
        name,
        gender,
        phoneNumber,
        email: email.trim(),
        password, 
        passwordConfirm,
    });

    await Point.create({ user: newUser._id })

    // SEND BACK A RESPONSE 
    res.status(201).json({
        status: 'success',
        message: 'Account created successfully!',
        data: { user: newUser }
    });
});


exports.loginUser = asyncWrapper(async function (req, res) {
    const { phoneNumber, password } = req.body;

    // FIND THE USER AND DO SOME CHECKINGS 
    const user = await User.findOne({ phoneNumber }).select('+password');

    if(!user) return res.json({ message: 'Account does not or no longer exist!' });
    if(!user.isActive) return res.json({ message: 'Account is inactive or disabled.' });
        
    // COMPARE THE USER PASSWORD AND CHECK IF THE EAMIL IS CORRECT
    const comparedPassword = await user.comparePassword(password, user.password)
    if(!user.phoneNumber || !comparedPassword) return res.json({ message: 'Phone number or password incorrect!'});

    // SIGNING ACCESS TOKEN
    const token = signToken(user._id);

    // SEND BACK RESPONSE 
    res.status(200).json({
        status: 'success',
        message: 'Login successful!',
        data: { user },
        token
    });
});


exports.updatePassword = asyncWrapper(async function (req, res) {
    const { password, newPassword, newPasswordConfirm } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    // CHECL IF PASSWORD IS CORRECT
    const comparedPassword = await user.comparePassword(password, user.password)
    if (!comparedPassword) {
        return res.json({ message: "Your current password is wrong." });
    }
    
    // CHECK IF PASSWORD IS NOT THE SAME AS NEW PASSWORD
    const comparedPasswordWithCurrent = await user.comparePassword(newPassword, user.password)
    if (comparedPasswordWithCurrent) {
        return res.json({ message: "Previous password and new password cannot be the same." });
    }

    // UPDATE PASSWORD AND PASSWORD CONFIRM 
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save({ validateModifiedOnly: true });
    

    // RESIGN ACCESS TOKEN
    const token = signToken(user._id)

    // SEND BACK RESPONSE
    return res.status(201).json({
        status: "success",
        message: 'Password changed successfully!',
        data: { user },
        token,
    });

})


exports.logoutUser = asyncWrapper(async function (_, res) {
    res.status(200).json({ status: 'success' });
});
