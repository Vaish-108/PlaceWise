const Company = require("../models/Company");


const createCompany = async(req,res)=>{

    try{

        const company =
        await Company.create(req.body);


        res.status(201).json({

            message:
            "Company Added Successfully",

            company

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


const getCompanies = async(req,res)=>{

    try{

        const companies =
        await Company.find();


        res.status(200).json(
            companies
        );


    }
    catch(error){

        res.status(500).json({

            message:
            "Server Error"

        });

    }

};



module.exports = {

    createCompany,

    getCompanies

};