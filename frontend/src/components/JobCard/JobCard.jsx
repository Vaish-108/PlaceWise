function JobCard({job}){


return (

<div
style={{
border:"1px solid black",
padding:"20px",
margin:"20px"
}}
>


<h2>
{job.title}
</h2>


<h3>
Company:
{
job.company?.name
}
</h3>


<p>
Package:
{job.package}
</p>


<p>
Description:
{job.description}
</p>


<p>
Minimum CGPA:
{job.minCGPA}
</p>


<p>
Skills:

{
job.requiredSkills.join(", ")
}

</p>


<button

onClick={()=>
window.open(
job.applicationLink,
"_blank"
)
}

>

Apply

</button>


</div>

);


}


export default JobCard;