const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const documentController = require("../controllers/documentController");

router.get("/", auth, documentController.getDocuments);
router.post("/", auth, documentController.uploadDocument);

module.exports = router;
