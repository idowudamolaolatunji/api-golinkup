const Listing = require("../models/listingModel");
const Point = require("../models/pointModel");
const User = require("../models/userModel");
const { asyncWrapper } = require("../utils/handlers");
const { getResponsedata } = require("../utils/helpers");
const handleRefactory = require("./handleRefactory");


// ADMIN AND USER ACTIONS
exports.getAllListing = handleRefactory.getAll(Listing, "listing");
exports.getListingById = handleRefactory.getAll(Listing, "listing");
exports.updateListingById = handleRefactory.updateOne(Listing, "listing");
exports.deleteListingById = handleRefactory.deleteOne(Listing, "listing");


exports.createListing = asyncWrapper(async function(req, res) {
    const { reference } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if(!user || !user.isActive) return res.json({
        message: "User not found or inactive!"
    });

    const paymentResponse = await getResponsedata(reference);
    if (paymentResponse.status !== 200) {
        return res.status(400).json({
            status: "fail",
            message: "Unable to verify payment",
        });
    }

    const userPoint = await Point.findOneAndUpdate(
        { user: userId },
        { $inc: { points: paymentResponse.amount } },
        { runValidators: true, new: true }
    );

    await Transaction.create({
        user: userId,
        reference,
        status: "success",
        amount: paymentResponse.amount,
        paidAt: paymentResponse.paidAt
    });

    const newListing = await Listing.create({
        user: userId,
        ...req.body,
    })

    userPoint.points -= paymentResponse.amount;
    await userPoint.save({});
    
    res.status(200).json({
        status: "success",
        message: "Listing created!",
        data: { listing: newListing }
    })
});


exports.uploadListingDisplayImage = asyncWrapper(async function(req, res) {
    const { id } = req.params;
    let image;

    const listing = await Listing.findById(id);
    if (!listing) return res.json({ message: `Listing not found!` });

    if (req.file) image = `/images/${req.file.filename}`;
    listing.displayImage = image;

    res.status(200).json({
        status: "success",
        message: `Display image uploaded!`,
        data: { listing }
    });
});