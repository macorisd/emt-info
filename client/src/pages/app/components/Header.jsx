import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const { isLogged, getUser } = useAuth();

  const userID = useMemo(
    () => (isLogged() ? getUser().id : null),
    [isLogged, getUser]
  );

  const loginBtn = useMemo(
    () => (
      <Link to={"/login"} style={{ textDecoration: "none", color: "gray" }}>
        Iniciar Sesión
      </Link>
    ),
    []
  );

  const profileBundle = useMemo(
    () => userID && <ProfileDropdown id={userID} />,
    [userID]
  );

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-secondary-subtle py-3 shadow-sm">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseDiv"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to={"/paradas"} className="navbar-brand ms-3">
            EMTInfo
          </Link>
          <li className="nav-item">
            <Link to={"/paradas"} className="nav-link">
              Paradas por línea
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/buscar-paradas"} className="nav-link">
              Buscar parada
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/paradas-cercanas"} className="nav-link">
              Paradas cercanas
            </Link>
          </li>

          <div className="d-flex align-items-end me-3">
            {isLogged() ? profileBundle : loginBtn}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
