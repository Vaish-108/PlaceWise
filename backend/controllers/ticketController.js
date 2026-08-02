const Ticket = require("../models/Ticket");


// CREATE QUERY
const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required",
      });
    }


    const ticket = await Ticket.create({
      studentId: req.user._id,
      college: req.user.college || "",
      subject,
      message,
    });


    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });


  } catch (error) {

    console.error("Create ticket failed:", error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};



// GET STUDENT QUERIES
const getStudentTickets = async (req, res) => {

  try {

    const tickets = await Ticket.find({
      studentId: req.user._id,
    })
    .sort({
      createdAt: -1,
    });


    res.status(200).json(tickets);


  } catch(error){

    console.error("Fetch student tickets failed:", error);

    res.status(500).json({
      message:"Server Error",
    });

  }

};



// GET ALL ADMIN QUERIES
const getAllTickets = async (req,res)=>{

  try{


    const tickets = await Ticket.find({
      college:req.admin.college,
    })
    .populate(
      "studentId",
      "name email"
    )
    .sort({
      createdAt:-1,
    });



    res.status(200).json(tickets);



  }catch(error){

    console.error("Fetch all tickets failed:",error);

    res.status(500).json({
      message:"Server Error",
    });

  }

};



// UPDATE QUERY BY ADMIN
const updateTicket = async(req,res)=>{

try{


const ticket = await Ticket.findById(req.params.id);


if(!ticket){

return res.status(404).json({
message:"Ticket not found"
});

}



if(req.body.status){

ticket.status=req.body.status;

}



if(req.body.adminResponse!==undefined){

ticket.adminResponse=req.body.adminResponse;

}



await ticket.save();



res.status(200).json({

message:"Query updated successfully",

ticket

});



}catch(error){

console.error(error);

res.status(500).json({

message:"Server Error"

});


}


};



// DELETE QUERY
const deleteTicket = async(req,res)=>{

try{


const ticket = await Ticket.findById(req.params.id);


if(!ticket){

return res.status(404).json({

message:"Ticket not found"

});

}



await Ticket.deleteOne({
_id:req.params.id
});



res.status(200).json({

success:true,

message:"Query deleted successfully"

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Server Error"

});


}

};



module.exports={
createTicket,
getStudentTickets,
getAllTickets,
updateTicket,
deleteTicket,
};