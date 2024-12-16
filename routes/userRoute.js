const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { protected, isRestricted } = require("../middlewares/protected");

const router = express.Router();

router.get("/users", protected, isRestricted, authController.signupUser);
router.get("/users/:id", protected, isRestricted, authController.signupUser);
router.patch("/users/:id", protected, isRestricted, authController.signupUser);
router.delete("/users/:id", protected, isRestricted, authController.signupUser);


router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/update-password", protected, authController.updatePassword);


router.get("/me", protected, userController.getMe);
router.patch("/update-profile", protected, userController.updateProfile);
router.patch("/delete-account", protected, userController.deleteAccount);


module.exports = router;