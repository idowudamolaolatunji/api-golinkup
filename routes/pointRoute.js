const express = require("express");
const pointController = require("../controllers/pointController");
const { protected, isRestricted } = require("../middlewares/protected");

const router = express.Router();


router.get("/", protected, isRestricted, pointController.getAllUserPointsBalance);
router.get("/:id", protected, isRestricted, pointController.getOneUserPointsBalance);
router.get("/user/:userId", protected, isRestricted, pointController.getPointsBalanceByUserId);

router.get("/my-points", protected, pointController.getMyPointsBalance);
router.post("/buy-points", protected, pointController.buyPoints);
router.patch("/reward-point", protected, pointController.addPointsForLinkup);


module.exports = router;