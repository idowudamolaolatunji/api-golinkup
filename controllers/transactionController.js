const Transaction = require("../models/transactionModel");
const handleRefactory = require("./handleRefactory")


exports.getAllTransaction = handleRefactory.getAll(Transaction, "transactions");
exports.getTransactionById = handleRefactory.getOne(Transaction, "transaction");
exports.deleteTrasactionById = handleRefactory.deleteOne(Transaction, "transaction");