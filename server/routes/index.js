const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const offeringRoutes = require("./offeringRoutes");
const registrationRoutes = require("./registrationRoutes");
const recordRoutes = require("./recordRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/offerings", offeringRoutes);
router.use("/registrations", registrationRoutes);
router.use("/records", recordRoutes);

module.exports = router;
