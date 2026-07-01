import { useEffect, useState } from "react";

import { getCompanies } from "../../services/companyService";

import CompanyCard from "../../components/CompanyCard/CompanyCard";


function Companies(){

  const [companies,setCompanies] =
  useState([]);



  useEffect(()=>{


    const fetchCompanies = async()=>{


      try{


        const data =
        await getCompanies();


        setCompanies(data);


      }
      catch(error){

        console.log(error);

      }


    };


    fetchCompanies();


  },[]);



  return(

    <div>


      <h1>
        Available Companies
      </h1>



      {
        companies.map((company)=>(

          <CompanyCard

            key={company._id}

            company={company}

          />

        ))
      }



    </div>

  );

}


export default Companies;