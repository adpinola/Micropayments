import React, { FC } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import './styles/App.scss';
import Home from './components/Home';
import Contractor from './components/Contractor';
import Company from './components/Company';

const App: FC = () => (
  <div className="app">
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contractor" element={<Contractor />} />
        <Route path="/company" element={<Company />} />
      </Routes>
    </HashRouter>
  </div>
);

export default App;
