import { Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';
import AuthService from "../../Services/Auth/AuthService";
import { clearCache } from "../../Utils/AuthUtil";
import Overview from '../../Pages/Overview/Overview.tsx';

export const ENDPOINTS = [
    {
        name: "Event Details",
        path: "/event-details",
        element: <Overview />,
    },
    {
        name: "Guests",
        path: "/guests",
        element: <Overview />,
    },
    {
        name: "Preferences",
        path: "/preferences",
        element: <Overview />,
    },
    {
        name: "Tasks",
        path: "/tasks",
        element: <Overview />,
    },
    {
        name: "Venue Seats",
        path: "/venue-seats",
        element: <Overview />,
    },
    {
        name: "Seating",
        path: "/seating",
        element: <Overview />,
    },
    {
        name: "To Do",
        path: "/notes",
        element: <Overview />,
    }
]

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
                    <Link to="/">
                        <img src={logo} alt="logo" className="logo" />
                    </Link>
                </div>
                <ul className="navbar-links">
                    {
                        ENDPOINTS.map((endpoint) => (
                            <li key={endpoint.name}>
                                <Link to={endpoint.path}>{endpoint.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </Group>

            <div className="navbar-actions">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
