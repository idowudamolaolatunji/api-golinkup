const express = require("express");
const transactionController = require("../controllers/transactionController");
const { isProtected, isRestricted } = require("../middlewares/protected");

const router = express.Router();

router.get("/", isProtected, transactionController.getAllTransaction);
router.get("/:id", isProtected, transactionController.getTransactionById);
router.delete("/:id", isProtected, isRestricted, transactionController.deleteTrasactionById);


module.exports = router;