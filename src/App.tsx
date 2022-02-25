import React, { FC } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './styles/App.scss';
import Home from './components/Home';
import Contractor from './components/Contractor';
import Company from './components/Company';

const App: FC = () => (
  <div className="app">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contractor" element={<Contractor />} />
        <Route path="/company" element={<Company />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
