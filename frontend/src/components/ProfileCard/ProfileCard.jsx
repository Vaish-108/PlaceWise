function ProfileCard({ user }) {
  return (
    <article className="panel profile-card">
      <h2>{user.name}</h2>

      <div className="profile-grid">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Branch:</strong> {user.branch || "Not set"}
        </p>
        <p>
          <strong>Year:</strong> {user.year || "Not set"}
        </p>
        <p>
          <strong>CGPA:</strong> {user.cgpa || "Not set"}
        </p>
        <p className="profile-grid__full">
          <strong>Skills:</strong>{" "}
          {user.skills?.length ? user.skills.join(", ") : "Not set"}
        </p>
      </div>
    </article>
  );
}

export default ProfileCard;
