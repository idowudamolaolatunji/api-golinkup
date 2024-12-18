const User = require("../models/userModel");
const { asyncWrapper } = require("../utils/handlers");
const { capFirstLetter } = require("../utils/helpers");



exports.getAll = function(Model, title) {
    return asyncWrapper(async function(req, res) {
        const userId = req?.user?.id;
        
        const documents = await Model.find(userId ? { user: userId } : {});
        if(!documents) return res.json({ message: `No ${title} found!` });

        res.status(200).json({
            status: "success",
            data: { [title]: documents }
        })
    })
}


exports.getOne = function(Model, title) {
    return asyncWrapper(async function(req, res) {
        const { id } = req.params;

        const document = await Model.findById(id);
        if(!document) return res.json({ message: `No ${title} by this Id!` });

        res.status(200).json({
            status: "success",
            data: { [title]: document }
        })
    })
}


exports.createOne = function(Model, title) {
    return asyncWrapper(async function(req, res) {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user || !user.isActive) return res.json({
            message: "User not found or inactive!"
        });

        const document = await Model.create({...req.body, user: userId });

        res.status(200).json({
            status: "success",
            message: `${capFirstLetter(title)} created!`,
            data: { [title]: document }
        })
    })
}


exports.updateOne = function(Model, title) {
    return asyncWrapper(async function(req, res) {
        const { id } = req.params;

        const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
            runValidation: true, new: true
        })

        if(!updatedDocument) return res.json({ message: `${capFirstLetter(title)} not found!` });

        res.status(200).json({
            status: "success",
            message: `${capFirstLetter(title)} updated!`,
            data: { [title]: updatedDocument }
        })
    })
}


exports.deleteOne = function(Model, title) {
    return asyncWrapper(async function(req, res) {
        const { id } = req.params;

        await Model.findByIdAndUpdate(id);

        res.status(200).json({
            status: "success",
            message: `${capFirstLetter(title)} deleted!`,
            data: null,
        })
    })
}