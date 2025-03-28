import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from './components/home-page/home-page.tsx';
import { Overview } from './components/overview/overview.tsx';
import { mantheme } from './types/mantheme.ts';
import SignIn from './Pages/SignIn/SignIn.tsx';
import SignUp from './Pages/SignUp/SignUp.tsx';

const theme = createTheme(mantheme);

const App: React.FC = () => {
    return (
        <MantineProvider theme={theme}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/overview" element={<Overview />} />
                // TODO: add not found route
            </Routes>
        </MantineProvider>
    );
};

export { App };
