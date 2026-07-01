const checkEligibility = (student, company) => {


    const cgpaMatch =
        student.cgpa >= company.minCGPA;



    const studentSkills =
        student.skills.map(skill =>
            skill.toLowerCase()
        );



    const requiredSkills =
        company.requiredSkills.map(skill =>
            skill.toLowerCase()
        );



    const matchedSkills =
        requiredSkills.filter(skill =>
            studentSkills.includes(skill)
        );



    const skillMatch =
        matchedSkills.length === requiredSkills.length;



    return {

        eligible:
        cgpaMatch && skillMatch,


        cgpaMatch,


        skillMatch,


        matchedSkills,


        missingSkills:
        requiredSkills.filter(skill =>
            !studentSkills.includes(skill)
        )

    };

};



module.exports = {
    checkEligibility
};