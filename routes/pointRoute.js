const express = require("express");
const pointController = require("../controllers/pointController");
const { isProtected, isRestricted } = require("../middlewares/protected");

const router = express.Router();

router.get("/my-points", isProtected, pointController.getMyPointsBalance);

router.get("/", isProtected, isRestricted, pointController.getAllUserPointsBalance);
router.get("/:id", isProtected, isRestricted, pointController.getOneUserPointsBalance);
router.get("/user/:userId", isProtected, isRestricted, pointController.getPointsBalanceByUserId);

router.post("/buy-points", isProtected, pointController.buyPoints);
router.patch("/reward-point", isProtected, pointController.addPointsForLinkup);


module.exports = router;