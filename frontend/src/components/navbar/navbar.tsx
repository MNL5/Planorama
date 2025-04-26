import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { Flex, Group, Button, Text } from "@mantine/core";

import "./navbar.css";
import logo from "../../assets/logo.png";
import { ENDPOINTS } from "../../utils/end-points";
import { clearCache } from "../../utils/auth-utils";
import AuthService from "../../services/auth-service/auth-service";
import { useEventContext } from "../../contexts/event-context";

const Navbar = () => {
  const { currentEvent } = useEventContext();
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await AuthService.logout(refreshToken);
      clearCache();
    }
  };

  return (
    <nav className="navbar">
      <Flex align={'center'}>
      <div className="navbar-logo">
              <Link to="/">
                <img src={logo} alt="logo" className="logo" />
              </Link>
            </div>
        {!isEmpty(currentEvent) && (
          <Group>
            <ul className="navbar-links">
              {ENDPOINTS.map((endpoint) => (
                <li key={endpoint.name}>
                  <Link to={endpoint.path}>{endpoint.name}</Link>
                </li>
              ))}
            </ul>
          </Group>
        )}

        <Flex
          className="navbar-actions"
          ml={!isEmpty(currentEvent) ? "52vw" : "90vw"}
        >
          <Button
            size={"md"}
            radius={"md"}
            variant={"light"}
            onClick={handleLogout}
          >
            <Text size={"md"}>Log Out</Text>
          </Button>
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
