const Resume = require("../models/Resume");


exports.uploadResume = async(req,res)=>{

    try{

        console.log(req.file);
        console.log(req.user);


        const resume = new Resume({

            studentId:req.user._id,

            filePath: req.file.path,

            fileName: req.file.originalname

        });


        await resume.save();


        res.status(201).json({
            message:"Resume uploaded successfully",
            resume
        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};