import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Frontend/Component/pages/LoginForm';
import Home from './Frontend/Component/pages/Home';

const App = () => {
  return (
   
      <div className="App">
        <Routes>
          <Route path='/' element={<LoginForm />} />
          <Route path='/home/:userid' element={<Home />} />
        </Routes>
      </div>
   
  );
};

export default App;
