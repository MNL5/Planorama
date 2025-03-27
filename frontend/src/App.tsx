import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import SignIn from './Pages/SignIn/SignIn.tsx'
import SignUp from './Pages/SignUp/SignUp.tsx'
import './App.css'

const App = () => {
   return (
      <>
         <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            // TODO: add not found route
         </Routes>
      </>
   );
};

export default App;