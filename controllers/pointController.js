const Point = require("../models/pointModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const handleRefactory = require("./handleRefactory")
const { asyncWrapper } = require("../utils/handlers");
const { getResponsedata } = require("../utils/helpers");
const rewardThreshold = 10;


exports.getAllUserPointsBalance = handleRefactory.getAll(Point, "user_points");
exports.getOneUserPointsBalance = handleRefactory.getOne(Point, "user_point");

exports.getPointsBalanceByUserId = asyncWrapper(async function(req, res) {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if(!user || !user.isActive) return res.json({
        message: "User not found or inactive!"
    });

    const pointBalance = await Point.findOne({ user: userId });

    res.status(200).json({
        status: "success",
        data: { user_point: pointBalance }
    });
});


exports.buyPoints = asyncWrapper(async function(req, res) {
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

    res.status(200).json({
        status: "success",
        message: "",
        data: { points: userPoint.points }
    })
})


exports.addPointsForLinkup = asyncWrapper(async function(req, res) {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if(!user || !user.isActive) return res.json({
        message: "User not found or inactive"
    });

    const userPoint = await Point.findOneAndUpdate(
        { user: userId },
        { $inc: { points: rewardThreshold } }
    );

    res.status(200).json({
        status: "status",
        message: rewardThreshold + " points added!",
        data: { point: userPoint.points }
    });
});


exports.getMyPointsBalance = asyncWrapper(async function(req, res) {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if(!user || !user.isActive) return res.json({
        message: "User not found or inactive"
    });

    const pointBalance = await Point.findOne({ user: userId });

    res.status(200).json({
        status: "success",
        data: { points: pointBalance.points }
    });
});