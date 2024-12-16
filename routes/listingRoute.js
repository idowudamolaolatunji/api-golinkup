const express = require("express");
const listingController = require("../controllers/listingController");
const { isProtected, isRestricted } = require("../middlewares/protected");

const router = express.Router();


router.get("/", isProtected, listingController.getAllListing);
router.get("/:id", isProtected, listingController.getListingById);
router.patch(":/id", isProtected, listingController.updateListingById);
router.delete(":/id", isProtected, listingController.deleteListingById);


router.get("/all", isProtected, listingController.getAllListing);
router.post("/create", isProtected, listingController.createListing);
router.post("/upload-image", isProtected, listingController.uploadListingDisplayImage);


module.exports = router;