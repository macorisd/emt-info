import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../app/components/Header";
import Footer from "../app/components/Footer";

import ParadasMainPage from "../maps/ParadasMainPage";
import BuscarParadas from "../maps/BuscarParadas";
import BuscarParadasCercanas from "../maps/BuscarParadasCercanas";

import LoginPage from "../login/LoginPage";
import LogoutPage from "../login/LogoutPage";
import UserLog from "../login/UserLog";
import Page404 from "../other/Page404";
import LoadingScreen from "./components/Loading";

function App() {
  return (
    <>
      <LoadingScreen />
      
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/paradas" element={wrap(<ParadasMainPage />)} />
        <Route path="/buscar-paradas" element={wrap(<BuscarParadas />)} />
        <Route path="/paradas-cercanas" element={wrap(<BuscarParadasCercanas />)} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-log" element={wrap(<UserLog />)} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>      
    </>
  );
}

const wrap = (child, options = { header: true, footer: true }) => (
  <div className="app-container">
    {options.header ? <Header /> : null}
    <div className="content">{child}</div>
    {options.footer ? <Footer /> : null}
  </div>
);

export default App;
