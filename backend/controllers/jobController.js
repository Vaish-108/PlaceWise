const Job = require("../models/Job");



// CREATE JOB

const createJob = async(req,res)=>{


    try{


        const job = await Job.create(
            req.body
        );


        res.status(201).json({

            message:
            "Job Created Successfully",

            job

        });


    }
    catch(error){


        console.log(error);


        res.status(500).json({

            message:
            "Server Error"

        });


    }


};




// GET ALL JOBS

const getJobs = async(req,res)=>{


    try{


        const jobs =
        await Job.find()
        .populate("company");


        res.status(200).json(
            jobs
        );


    }
    catch(error){


        console.log(error);


        res.status(500).json({

            message:
            "Server Error"

        });


    }


};



module.exports = {

    createJob,

    getJobs

};