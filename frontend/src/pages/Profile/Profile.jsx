import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/authService";


function Profile() {

  const [formData, setFormData] = useState({
    branch: "",
    year: "",
    cgpa: "",
    skills: "",
  });


  const [message, setMessage] = useState("");


  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const data =
          await getProfile(token);


        setFormData({
          branch: data.user.branch,
          year: data.user.year,
          cgpa: data.user.cgpa,
          skills: data.user.skills.join(", "),
        });


      } catch(error) {

        console.log(error);

      }

    };


    fetchUser();

  }, []);



  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();


    try{

      const token =
        localStorage.getItem("token");


      const updatedData = {

        branch: formData.branch,

        year: Number(formData.year),

        cgpa: Number(formData.cgpa),

        skills:
        formData.skills.split(",")
        .map(skill => skill.trim()),

      };


      const data =
        await updateProfile(
          updatedData,
          token
        );


      setMessage(data.message);


    }
    catch(error){

      console.log(error);

      setMessage("Update Failed");

    }

  };



  return (

    <div>

      <h1>Edit Profile</h1>


      <form onSubmit={handleSubmit}>


        <input

          type="text"

          name="branch"

          placeholder="Branch"

          value={formData.branch}

          onChange={handleChange}

        />

        <br/><br/>



        <input

          type="number"

          name="year"

          placeholder="Year"

          value={formData.year}

          onChange={handleChange}

        />

        <br/><br/>



        <input

          type="number"

          step="0.01"

          name="cgpa"

          placeholder="CGPA"

          value={formData.cgpa}

          onChange={handleChange}

        />

        <br/><br/>



        <input

          type="text"

          name="skills"

          placeholder="React, Node.js, MongoDB"

          value={formData.skills}

          onChange={handleChange}

        />

        <br/><br/>



        <button type="submit">

          Update Profile

        </button>


      </form>


      <p>{message}</p>


    </div>

  );

}


export default Profile;