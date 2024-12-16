const User = require("../models/userModel");
const { asyncWrapper } = require("../utils/handlers");
const handleRefactory = require("./handleRefactory");


// ADMIN ACTIONS //
exports.getAllUsers = handleRefactory.getAll(User, "users");
exports.getOneUser = handleRefactory.getOne(User, "user");
exports.updateOneUser = handleRefactory.updateOne(User, "user");
exports.deleteOneUser = handleRefactory.deleteOne(User, "user");


// USER ACTIONS //
exports.getMe = asyncWrapper(async function(req, res) {
    const user = await User.findById(req.user._id);

    if(!user || !user.isActive) {
        return res.json({ message: "User not found or inactive" });
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
});


exports.updateProfile = asyncWrapper(async function(req, res) {
    const { email, name, gender, phoneNumber, password, passwordConfirm } = req.body;
    const userId = req.user._id;

    // CHECK IF USER ISN'T TRYINGG TO UPDATE PASSWORD ON THIS ROUTE
    if(password || passwordConfirm) {
        return res.json({ 
            message: 'This route is not for password updates. Please use /update-Password.'
        });
    }
    
    const user = await User.findById(userId);
    if(!user || !user.isActive) return res.json({
        message: "User not found or inactive!"
    });

    user.email = email;
    user.name = name;
    user.phoneNumber = phoneNumber;
    user.gender = gender;
    await user.save({ validateModifiedOnly: true })

    res.status(200).json({
        status: "success",
        message: "Profile updated!",
        data: { user }
    })
});


// USER DELETE USER ACCOUNT (AUTHORISED)
exports.deleteAccount = asyncWrapper(async function(req, res) {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if(!user || !user.isActive) return res.json({ message: 'User not found or inactive!' });

    // CHECK IF THE PROVIDED PASSWORD IS CORRECT
    const comparedPassword = await user.comparePassword(password, user.password)
    if (!comparedPassword) return res.json({ message: "Incorrect password " });

    await User.findByIdAndUpdate(user._id, { isActive: false });
    req.session.destroy();
    res.clearCookie('jwt');

    res.status(204).json({
        status: "success",
        message: 'Account deleted!',
        data: null
    });
})