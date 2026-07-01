import { useEffect, useState } from "react";
import { getProfile } from "../../services/authService";
import ProfileCard from "../../components/ProfileCard/ProfileCard";

function StudentDashboard() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const data = await getProfile(token);

        setUser(data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <button
        onClick={()=>{
        window.location.href="/profile";
        }}
        >
        Edit Profile
      </button>

      {user ? (
        <ProfileCard user={user} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StudentDashboard;