import React from "react";
import HeroSection from "../components/HeroSection";
import SeccionConImagen from "../components/SeccionConImagen";

function Nosotros() {
  return (
    <>
      <HeroSection
        title="Sobre Nosotros"
        subtitle="Pasión por los pasteles"
        description="En nuestra pastelería, cada creación es un momento dulce pensado para ti. Calidad, tradición y creatividad en cada pastel."
        background="src/assets/PastelHero2.jpg"
        height="70vh"
        align="center"
        backgroundPosition="center top"
      />

      <SeccionConImagen
        title="Nuestra Historia"
        text={[
          "Desde hace más de 10 años, hemos endulzado la vida de nuestros clientes con recetas tradicionales y toques innovadores.",
          "Cada pastel es preparado con ingredientes de la más alta calidad y mucho amor."
        ]}
        image="src/assets/HistoriaPasteleria.jpg"
        imageAlt="Historia de la pastelería"
        imagePosition="left"
        bgColor="#fff0f5"
        textColor="#5c1a3d"
      />

      <SeccionConImagen
        title="Nuestro Equipo"
        text={[
          "Contamos con pasteleros expertos y un equipo creativo que transforma ideas en deliciosas obras de arte.",
          "La dedicación y el cuidado en cada detalle es lo que nos diferencia."
        ]}
        image="src/assets/EquipoPasteleria.jpg"
        imageAlt="Equipo de la pastelería"
        imagePosition="right"
        bgColor="#ffe6f0"
        textColor="#5c1a3d"
      />

      <SeccionConImagen
        title="Misión & Visión"
        text={[
          "Nuestra misión es crear momentos dulces que hagan sonreír a cada cliente.",
          "Nuestra visión es ser la pastelería de referencia en nuestra ciudad, reconocida por la calidad y creatividad de nuestros productos."
        ]}
        image="src/assets/MisionVision.jpg"
        imageAlt="Misión y visión de la pastelería"
        imagePosition="left"
        bgColor="#fff0f5"
        textColor="#5c1a3d"
      />
    </>
  );
}

export default Nosotros;