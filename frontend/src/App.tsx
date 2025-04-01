import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home.tsx';
import { Overview } from './components/Overview/Overview.tsx';
import { mantheme } from './types/mantheme.ts';
import { useState } from 'react';
import { useEventListener } from './hooks/useEventListener.ts';
import { ToastContainer } from 'react-toastify';
import useRefresh from './hooks/useRefresh.ts';
import SignIn from './pages/SignIn/SignIn.tsx';
import SignUp from './pages/SignUp/SignUp.tsx';

const theme = createTheme(mantheme);

const LOGIN_EVENT = 'loginEvent';

const App: React.FC = () => {
    const [isLogged, setLogged] = useState<boolean>(false);
    const {isLoading} = useRefresh();

    useEventListener(LOGIN_EVENT, (event) => setLogged(event.detail));

    if (isLoading) return <div>Loading...</div>;

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
            <Routes>
                <Route exact path="/" element={isLogged ? <Navigate replace to="/overview" /> : <Home />} />
                {
                    isLogged ? <Route path="/overview" element={<Overview />} /> :
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
