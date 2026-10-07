const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const validateId = require("../middlewares/validateId");

router.get("/", registrationController.getAllRegistrations);
router.post("/", registrationController.createRegistration);
router.get("/:id", validateId("id"), registrationController.getRegistrationById);
router.delete("/:id", validateId("id"), registrationController.deleteRegistration);

module.exports = router;
