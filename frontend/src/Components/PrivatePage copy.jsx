//can you create a private page component in react that only allows access to authenticated users? if the user is not authenticated, redirect them to the login page. use react-router-dom for routing and context api for managing authentication state.import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function PrivatePage() {
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getCurrentUser();
  }, []);
  const getCurrentUser = () => {
    const jwtToken = Cookies.get("jwt-authorization");
    if (!jwtToken) {
      navigate("/login");
      return;
    }
    try {
      const decodedToken = jwtDecode(jwtToken);
      setCurrentUser(decodedToken.username);
    } catch (error) {
      console.error("Invalid JWT", error);
      navigate("/login");
    }
  };
  const handleLogout = () => {
    Cookies.remove("jwt-authorization");
    setCurrentUser("");
    navigate("/login");
  };
  return (
    <div>
      <h1>Welcome {currentUser}</h1>
      <h1>Private Page</h1>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
}
