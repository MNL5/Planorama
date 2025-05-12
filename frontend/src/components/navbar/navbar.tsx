import { isEmpty } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { Group, Button, Text, Divider } from "@mantine/core";

import "./navbar.css";
import logo from "../../assets/logo.png";
import { ENDPOINTS } from "../../utils/end-points";
import { clearCache } from "../../utils/auth-utils";
import AuthService from "../../services/auth-service/auth-service";
import { useEventContext } from "../../contexts/event-context";
import { useFetchEventsList } from "../../hooks/use-fetch-events-list";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentEvent, setCurrentEvent } = useEventContext();
  const { doesUserHaveEvents } = useFetchEventsList(true);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await AuthService.logout(refreshToken);
      clearCache();
    }
  };

  const handleSwitchToEvent = () => {
    setCurrentEvent(null);
    navigate("/event-list");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={() => setCurrentEvent(null)}>
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

      <Group ml={"auto"} gap={"sm"} style={{ order: 2, alignSelf: "center" }}>
        {doesUserHaveEvents && (
          <>
            <Button
              size={"s"}
              radius={"md"}
              variant={"light"}
              className={"navbar-button"}
              onClick={handleSwitchToEvent}
            >
              <Text size={"md"}>Switch Event</Text>
            </Button>
            <Divider orientation="vertical" />
          </>
        )}
        <Button
          size={"s"}
          radius={"md"}
          variant={"light"}
          className={"navbar-button"}
          onClick={handleLogout}
        >
          <Text size={"md"}>Log Out</Text>
        </Button>
      </Group>
    </nav>
  );
};

export default Navbar;
