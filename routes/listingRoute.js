const express = require("express");
const listingController = require("../controllers/listingController");
const { protected, isRestricted } = require("../middlewares/protected");

const router = express.Router();


router.get("/", protected, listingController.getAllListing);
router.get("/:id", protected, listingController.getListingById);
router.patch(":/id", protected, listingController.updateListingById);
router.delete(":/id", protected, listingController.deleteListingById);


router.get("/all", protected, listingController.getAllListing);
router.post("/create", protected, listingController.createListing);
router.post("/upload-image", protected, listingController.uploadListingDisplayImage);


module.exports = router;