import React, { useState, useEffect } from "react";
import MyNavbar from "../components/MyNavbar";
import MyFooter from "../components/MyFooter";
import CarritoBoton from "../components/CarritoBoton";
import WhatsappBoton from "../components/WhatsappBoton";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  return (
    <>
      <MyNavbar />
      <main>
        <Outlet context={{ carrito, setCarrito }} />
      </main>

      <CarritoBoton carrito={carrito} setCarrito={setCarrito} />

      <WhatsappBoton />
      <MyFooter />
    </>
  );
}