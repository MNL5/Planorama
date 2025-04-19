import { Group } from '@mantine/core';
import { Link } from 'react-router-dom';

import './navbar.css';
import logo from '../../assets/logo.png';
import { ENDPOINTS } from '../../utils/end-points';
import { clearCache } from "../../utils/auth-utils";
import AuthService from "../../services/auth-service/auth-service";

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
