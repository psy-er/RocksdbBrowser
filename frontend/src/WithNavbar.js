import React, { useEffect } from 'react';
import "./App.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const WithNavbar = ({children}) => {
  const navigate = useNavigate();

  useEffect(() => {
  }, [navigate]);

  return (
    <div className="app-wrapper">
        <Navbar/>
        <div className="app-container">
            {children}
        </div>
    </div>
  )
}

export default WithNavbar;
