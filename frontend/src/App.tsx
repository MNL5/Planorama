import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import Home from './Pages/Home/Home.tsx';
import Overview from './Pages/Overview/Overview.tsx';
import { mantheme } from './types/mantheme.ts';
import { useState } from 'react';
import { useEventListener } from './hooks/useEventListener.ts';
import { ToastContainer } from 'react-toastify';
import useRefresh from './hooks/useRefresh.ts';
import SignIn from './Pages/SignIn/SignIn.tsx';
import SignUp from './Pages/SignUp/SignUp.tsx';
import Navbar from './components/navbar/Navbar.tsx';
import { ENDPOINTS } from './Utils/Endpoints.tsx';

const theme = createTheme(mantheme);

const LOGIN_EVENT = 'loginEvent';

const App: React.FC = () => {
    const [isLogged, setLogged] = useState<boolean>(false);
    const {isLoading} = useRefresh();

    useEventListener(LOGIN_EVENT, (event: CustomEvent) => setLogged(event.detail));

    if (isLoading) return <CircularProgress color="secondary" style={{position: "absolute", top: "40%", left: "50%"}} />;

    return (
        <MantineProvider theme={theme}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={"colored"}
                style={{ zIndex: "999999999999" }}
              />
              {isLogged && <Navbar />}
            <Routes>
                <Route exact path="/" element={isLogged ? <Navigate replace to="/overview" /> : <Home />} />
                {
                    isLogged ? 
                    <>
                        <Route path="/overview" element={<Overview />} />
                        {
                            ENDPOINTS.map((endpoint) => (
                                <Route key={endpoint.path} path={endpoint.path} element={endpoint.element} />
                            ))
                        }
                    </> :
                    <>
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                    </>
                }
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </MantineProvider>
    );
};

export { App, LOGIN_EVENT };
