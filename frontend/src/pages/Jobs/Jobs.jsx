import {useEffect,useState} from "react";

import {getJobs} from "../../services/jobService";

import JobCard from "../../components/JobCard/JobCard";



function Jobs(){


const [jobs,setJobs]=useState([]);




useEffect(()=>{


const fetchJobs = async()=>{


try{


const data =
await getJobs();


setJobs(data);


}

catch(error){

console.log(error);

}};


fetchJobs();


},[]);




return(<div><h1>Available Jobs</h1>{
    jobs.map((job)=>( <JobCard key={job._id} 
        job={job}/>


))}

</div>

);


}



export default Jobs;