function ProfileCard({ user }) {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <h2>{user.name}</h2>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Branch:</strong> {user.branch}
      </p>

      <p>
        <strong>Year:</strong> {user.year}
      </p>

      <p>
        <strong>CGPA:</strong> {user.cgpa}
      </p>

      <p>
        <strong>Skills:</strong>{" "}
        {user.skills?.join(", ")}
      </p>
    </div>
  );
}

export default ProfileCard;