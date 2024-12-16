const express = require("express");
const transactionController = require("../controllers/transactionController");
const { protected, isRestricted } = require("../middlewares/protected");

const router = express.Router();

router.get("/", protected, transactionController.getAllTransaction);
router.get("/:id", protected, transactionController.getTransactionById);
router.delete("/:id", protected, isRestricted, transactionController.deleteTrasactionById);


module.exports = router;