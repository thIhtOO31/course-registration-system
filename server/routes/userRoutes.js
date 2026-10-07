const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validateId = require("../middlewares/validateId");

router.get("/", userController.getAllUsers);
router.get("/:id", validateId("id"), userController.getUserById);
router.put("/:id", validateId("id"), userController.updateUser);
router.delete("/:id", validateId("id"), userController.deleteUser);

module.exports = router;
