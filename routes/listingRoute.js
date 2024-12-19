const express = require("express");
const listingController = require("../controllers/listingController");
const { isProtected, isRestricted } = require("../middlewares/protected");
const { uploadSingleImage, resizeSingleDisplayImage } = require("../middlewares/multer")

const router = express.Router();


router.get("/", isProtected, isRestricted, listingController.getAllListingAdmin);
router.get("/me", isProtected, listingController.getAllListingPromoter);
router.get("/lists/all", isProtected, listingController.getAllListingGenUser);

router.get("/:id", isProtected, listingController.getListingById);
router.patch("/:id", isProtected, listingController.updateListingById);
router.delete("/:id", isProtected, listingController.deleteListingById);


router.post("/create", isProtected, listingController.createListingPoint);
router.post("/create/pay", isProtected, listingController.createListingPay);
router.post("/upload-image/:id", isProtected, uploadSingleImage, resizeSingleDisplayImage, listingController.uploadListingDisplayImage);


module.exports = router;