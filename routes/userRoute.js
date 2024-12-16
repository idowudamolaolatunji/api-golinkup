const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { isProtected, isRestricted } = require("../middlewares/protected");

const router = express.Router();

router.get("/users", isProtected, isRestricted, authController.signupUser);
router.get("/users/:id", isProtected, isRestricted, authController.signupUser);
router.patch("/users/:id", isProtected, isRestricted, authController.signupUser);
router.delete("/users/:id", isProtected, isRestricted, authController.signupUser);


router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/update-password", isProtected, authController.updatePassword);


router.get("/me", isProtected, userController.getMe);
router.patch("/update-profile", isProtected, userController.updateProfile);
router.patch("/delete-account", isProtected, userController.deleteAccount);


module.exports = router;