import React from "react";
import HeroSection from "../components/HeroSection";
import SeccionConImagen from "../components/SeccionConImagen";

function Locales() {
  const localesData = [
    {
      title: "D'Julia Sede San Borja",
      text: "Principal\nAv. Aviación 2852, San Borja 15036",
      image: "src/assets/local1.webp",
      imageAlt: "Sucursal San Borja",
      imagePosition: "left",
      bgColor: "#fff0f5",
      textColor: "#5c1a3d",
    },
    {
      title: "D'Julia Sede San Miguel",
      text: "Segundo Local\nAv. La Marina 2000, San Miguel",
      image: "src/assets/local2.webp",
      imageAlt: "Sucursal San Miguel",
      imagePosition: "right",
      bgColor: "#ffe6f0",
      textColor: "#5c1a3d",
    },
    {
      title: "D'Julia Sede Miraflores",
      text: "Tercer Local\nAv. Sta. Cruz 1296, Miraflores 15073",
      image: "src/assets/local3.webp",
      imageAlt: "Sucursal Miraflores",
      imagePosition: "left",
      bgColor: "#fff0f5",
      textColor: "#5c1a3d",
    },
    {
      title: "D'Julia Sede Barranco",
      text: "Cuarto Local\nJirón Pedro Martinto 114, Barranco 15063",
      image: "src/assets/local4.webp",
      imageAlt: "Sucursal Barranco",
      imagePosition: "right",
      bgColor: "#ffe6f0",
      textColor: "#5c1a3d",
    },
  ];

  return (
    <>
      <HeroSection
        title="Nuestros Locales"
        subtitle="Encuentra la sucursal más cercana"
        description="Visita nuestras pastelerías en distintos distritos y disfruta de nuestras deliciosas creaciones."
        background="src/assets/fondo_locales.jpg"
        height="60vh"
        align="center"
        backgroundPosition="center top"
      />

      {localesData.map((local, idx) => (
        <SeccionConImagen
          key={idx}
          title={local.title}
          text={local.text}
          image={local.image}
          imageAlt={local.imageAlt}
          imagePosition={local.imagePosition}
          bgColor={local.bgColor}
          textColor={local.textColor}
        />
      ))}
    </>
  );
}

export default Locales;