const Student = require("../models/Student");
const Company = require("../models/Company");

const {
    checkEligibility
}
=
require("../services/matchingService");



const checkCompanyMatch = async(req,res)=>{


    try{


        const student =
        await Student.findById(
            req.user.id
        );


        const company =
        await Company.findById(
            req.params.companyId
        );



        const result =
        checkEligibility(
            student,
            company
        );



        res.status(200).json({

            company:
            company.name,

            result

        });



    }
    catch(error){

        console.log(error);


        res.status(500).json({

            message:"Server Error"

        });

    }

};



module.exports = {
    checkCompanyMatch
};