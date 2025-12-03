import React, { useState } from "react";
import SidebarVendedor from "../components/SidebarVendedor";
import { Outlet } from "react-router-dom";

export default function VendedorLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f0f7f4",
        color: "#2c2c2c",
      }}
    >
      <SidebarVendedor isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        style={{
          flexGrow: 1,
          marginLeft: isOpen ? "240px" : "80px",
          transition: "margin-left 0.3s ease",
          padding: "2rem",
          minHeight: "100vh",
          overflowY: "auto",
          backgroundColor: "#f0f7f4",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}