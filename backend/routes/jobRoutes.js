const express = require("express");

const router = express.Router();


const {

    createJob,

    getJobs

}
=
require("../controllers/jobController");




// create job

router.post(
"/",
createJob
);



// get jobs

router.get(
"/",
getJobs
);



module.exports = router;