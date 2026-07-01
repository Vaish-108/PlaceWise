const jwt = require("jsonwebtoken");
const Student = require("../models/Student");


const authMiddleware = async(req,res,next)=>{

    try{

        // Check Authorization header
        const authHeader = req.headers.authorization;


        if(!authHeader){

            return res.status(401).json({
                message:"No token provided"
            });

        }


        // Extract token
        const token = authHeader.split(" ")[1];


        if(!token){

            return res.status(401).json({
                message:"Invalid token format"
            });

        }



        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        // Find user
        const user = await Student.findById(decoded.id)
        .select("-password");



        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }



        // Attach user to request
        req.user = user;


        next();



    }
    catch(error){

        console.log(error);


        return res.status(401).json({
            message:"Invalid Token"
        });

    }

};



module.exports = authMiddleware;