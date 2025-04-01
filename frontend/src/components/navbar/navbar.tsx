import { Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';
import AuthService from "../../Services/Auth/AuthService";
import { clearCache } from "../../Utils/AuthUtil";

const Navbar = () => {
    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await AuthService.logout(refreshToken);
          clearCache();
        }
      };

    return (
        <nav className="navbar">
            <Group>
                <div className="navbar-logo">
                    <Link to="/home">
                        <img src={logo} alt="logo" className="logo" />
                    </Link>
                </div>
                <ul className="navbar-links">
                    <li>
                        <Link to="/event-details">Event Details</Link>
                    </li>
                    <li>
                        <Link to="/guests">Guests</Link>
                    </li>
                    <li>
                        <Link to="/preferences">Preferences</Link>
                    </li>
                    <li>
                        <Link to="/tasks">Tasks</Link>
                    </li>
                    <li>
                        <Link to="/venue-seats">Venue Seats</Link>
                    </li>
                    <li>
                        <Link to="/seating">Seating</Link>
                    </li>
                    <li>
                        <Link to="/notes">To Do</Link>
                    </li>
                </ul>
            </Group>

            <div className="navbar-actions">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
