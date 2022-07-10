import "./NavBar.css";
import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";
import SearchBar from "../SearchBar/SearchBar";

export default function NavBar({ user, setUser }) {
  const handleLogOut = () => {
    // Delegate to the users-service
    userService.logOut();
    // Update state will also cause a re-render
    setUser(null);
  };

  return (
    <div className="navBar">
      <nav className="navContainer">
        <h1 className="logo">Travel Companions</h1>
        <div className="navItems">
          <span>Where can we take you, {user.name}?</span>
          <Link to="/">
            <button className="navButton" style={{ color: "#003580" }}>
              Home
            </button>
          </Link>
          <Link to="/users/myAccount">
            <button className="navButton" style={{ color: "#003580" }}>
              My Account
            </button>
          </Link>
          <Link to="" onClick={handleLogOut}>
            <button className="navButton" style={{ color: "#003580" }}>
              Log Out
            </button>
          </Link>
        </div>
      </nav>
      <SearchBar />
    </div>
  );
}
