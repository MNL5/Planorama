import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Route, Routes } from 'react-router-dom';

import Home from './Pages/Home/Home.tsx';
import { Overview } from './components/overview/overview.tsx';
import { mantheme } from './types/mantheme.ts';
import SignIn from './Pages/SignIn/SignIn.tsx';
import SignUp from './Pages/SignUp/SignUp.tsx';
import NotFound from './Pages/NotFound/NotFound.tsx';

const theme = createTheme(mantheme);

const App: React.FC = () => {
    return (
        <MantineProvider theme={theme}>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </MantineProvider>
    );
};

export { App };
