function CompanyCard({ company }) {

  return (

    <div
      style={{
        border: "1px solid black",
        padding: "20px",
        margin: "20px"
      }}
    >

      <h2>
        {company.name}
      </h2>


      <p>
        Role: {company.role}
      </p>


      <p>
        Package: {company.package}
      </p>


      <p>
        Minimum CGPA:
        {company.minCGPA}
      </p>


      <p>
        Required Skills:

        {company.requiredSkills.join(", ")}
      </p>


    </div>

  );

}


export default CompanyCard;