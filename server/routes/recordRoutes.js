const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const validateId = require("../middlewares/validateId");

router.get("/", recordController.getAllRecords);
router.post("/", recordController.createRecord);
router.get("/:id", validateId("id"), recordController.getRecordById);
router.delete("/:id", validateId("id"), recordController.deleteRecord);

module.exports = router;
