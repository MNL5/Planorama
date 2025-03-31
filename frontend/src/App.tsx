import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Route, Routes, Navigate } from 'react-router-dom';

import { HomePage } from './components/home-page/home-page.tsx';
import { Overview } from './components/overview/overview.tsx';
import { mantheme } from './types/mantheme.ts';
import { useState } from 'react';
import { useEventListener } from './hooks/useEventListener.ts';
import SignIn from './Pages/SignIn/SignIn.tsx';
import SignUp from './Pages/SignUp/SignUp.tsx';
import { ToastContainer } from 'react-toastify';
import useRefresh from './hooks/useRefresh.ts';

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
                <Route exact path="/" element={isLogged ? <Navigate replace to="/overview" /> : <HomePage />} />
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
