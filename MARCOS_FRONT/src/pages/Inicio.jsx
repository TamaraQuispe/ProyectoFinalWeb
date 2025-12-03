import 'bootstrap/dist/css/bootstrap.min.css';
import PastelInicial from "../assets/PastelInicial.jpg";
import HeroSection from "../components/HeroSection";
import ListaConImagen from "../components/ListadoConImagen";
import CarruselCards from "../components/CaruselConCards";
import { Link } from "react-router-dom";

function Inicio() {
  const listaInicio = [
    {
      icon: "bi-check-circle-fill",
      text: "Ingredientes frescos y de alta calidad en todos nuestros productos.",
    },
    {
      icon: "bi-check-circle-fill",
      text: "Opciones personalizadas para cumpleaños, bodas y eventos especiales.",
    },
    {
      icon: "bi-check-circle-fill",
      text: "Atención al cliente amigable y dedicada a tu satisfacción.",
    },
  ];

  const carruselInicio = [
    { icon: "bi-heart-fill", title: "Hecho con amor", text: "Cada pastel y postre se prepara con dedicación para que tu experiencia sea inolvidable." },
    { icon: "bi-cash-coin", title: "Precios Justos", text: "Disfruta de nuestros deliciosos postres a precios accesibles." },
    { icon: "bi-shop", title: "Ubicación", text: "Visítanos en Av. Dulce Sonrisa 123, Lima – Perú. Siempre listos para endulzar tu día." },
    { icon: "bi-telephone", title: "Soporte 24/7", text: "Para consultas sobre pedidos o recomendaciones, llámanos a cualquier hora." },
    { icon: "bi-calendar-event", title: "Pedidos a tiempo", text: "Garantizamos que tus pasteles lleguen frescos y puntuales." },
    { icon: "bi-geo-alt", title: "Cobertura", text: "Entregamos a domicilio en toda la ciudad para que disfrutes sin salir de casa." }
  ];

  return (
    <>
      <HeroSection
        title="Bienvenido a D'Julia"
        subtitle="Endulzamos tus momentos más especiales"
        background="src/assets/PastelHero.jpg"
        height="80vh"
        align="left"
        backgroundPosition="center 40%"
        botonTexto="Conócenos"
        botonLink="/AcercaDe"
      />
      
      <ListaConImagen
        features={listaInicio}
        image={PastelInicial}
        imageAlt="Pastel decorado"
        imagePosition="right"
        title="¿Por qué elegir D'Julia?"
      />
      
      <section style={{ backgroundColor: "#f7c6c7ff", color: "#3a2f2fff", padding: "40px 0" }}>
        <CarruselCards features={carruselInicio} />
      </section>
    </>
  );
}

export default Inicio;