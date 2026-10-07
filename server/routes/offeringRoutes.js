const express = require("express");
const router = express.Router();
const offeringController = require("../controllers/offeringController");
const validateId = require("../middlewares/validateId");

router.get("/", offeringController.getAllOfferings);
router.post("/", offeringController.createOffering);
router.get("/:id", validateId("id"), offeringController.getOfferingById);
router.put("/:id", validateId("id"), offeringController.updateOffering);
router.delete("/:id", validateId("id"), offeringController.deleteOffering);

module.exports = router;
