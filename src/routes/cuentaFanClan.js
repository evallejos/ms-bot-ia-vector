const { Router } = require("express");

const router = Router();

const {
    embedding,
    search
} = require("../controllers/services/cuentaFanClan");

router.get("/", embedding);
router.post("/search", search);
module.exports = router;

