const express = require("express");

const router = express.Router();

const {
 checkCompanyMatch
}
=
require("../controllers/matchingController");


const authMiddleware =
require("../middleware/authMiddleware");


router.get(
 "/:companyId",
 authMiddleware,
 checkCompanyMatch
);


module.exports = router;