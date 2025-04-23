import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/navbar/navbar.tsx';
import { useEventListener } from './hooks/useEventListener.ts';
import useRefresh from './hooks/useRefresh.ts';
import Home from './Pages/Home/Home.tsx';
import Overview from './Pages/Overview/Overview.tsx';
import SignIn from './Pages/SignIn/SignIn.tsx';
import SignUp from './Pages/SignUp/SignUp.tsx';
import { mantheme } from './types/mantheme.ts';
import { ENDPOINTS } from './Utils/Endpoints.tsx';

const theme = createTheme(mantheme);

const LOGIN_EVENT = 'loginEvent';

const App: React.FC = () => {
    const [isLogged, setLogged] = useState<boolean>(false);
    const { isLoading } = useRefresh();

    useEventListener(LOGIN_EVENT, (event: CustomEvent) =>
        setLogged(event.detail)
    );

    if (isLoading)
        return (
            <CircularProgress
                color="secondary"
                style={{ position: 'absolute', top: '40%', left: '50%' }}
            />
        );

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
                theme={'colored'}
                style={{ zIndex: '999999999999' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {isLogged && <Navbar />}
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={
                                isLogged ? (
                                    <Navigate replace to="/overview" />
                                ) : (
                                    <Home />
                                )
                            }
                        />
                        {isLogged ? (
                            <>
                                <Route
                                    path="/overview"
                                    element={<Overview />}
                                />
                                {ENDPOINTS.map((endpoint) => (
                                    <Route
                                        key={endpoint.path}
                                        path={endpoint.path}
                                        element={endpoint.element}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                            </>
                        )}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        </MantineProvider>
    );
};

export { App, LOGIN_EVENT };
