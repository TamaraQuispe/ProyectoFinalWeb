import HeroSection from "../components/HeroSection";
import { Container } from "react-bootstrap";

function Terminos() {
  return (
    <>
      <HeroSection
        title="TÉRMINOS Y CONDICIONES"
        subtitle="Transparencia y confianza en cada dulce detalle."
        background="src/assets/FondoPasteleria.jpg"
        height="60vh"
        align="center"
        backgroundPosition="center top"
      />

      <section
        className="py-5 text-start"
        style={{
          backgroundColor: "#fff5ef",
          color: "#4a2c2a",
        }}
      >
        <Container>
          <h1
            className="mb-4 text-center fw-bold"
            style={{
              color: "#d97b66",
            }}
          >
            Términos y Condiciones
          </h1>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>1. Generalidades</h4>
          <p>
            <strong>Pastelería Djulia</strong> gestiona este sitio web. Al acceder o utilizar nuestra
            página, aceptas los presentes términos y condiciones (en adelante, “Términos”).
            Estos Términos aplican a todos los usuarios, incluyendo clientes, visitantes o proveedores.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>2. Uso del Servicio</h4>
          <p>
            Al hacer uso de este sitio, declaras que eres mayor de edad o cuentas con autorización
            de tus padres o tutores. Está prohibido usar nuestros servicios con fines ilegales o no
            autorizados, ni intentar alterar el funcionamiento del sitio.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>3. Condiciones Generales</h4>
          <p>
            <strong>Djulia</strong> se reserva el derecho de rechazar el servicio a cualquier persona
            en cualquier momento. El contenido que compartas en nuestro sitio no debe infringir
            derechos de terceros ni contener material ofensivo o inapropiado.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>4. Exactitud de la Información</h4>
          <p>
            Nos esforzamos por mantener la información actualizada y correcta, aunque no garantizamos
            que todo el contenido esté libre de errores. <strong>Djulia</strong> puede modificar o actualizar
            el contenido en cualquier momento sin previo aviso.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>5. Productos y Servicios</h4>
          <p>
            Algunos productos o servicios pueden estar disponibles de manera limitada y sujetos a
            políticas de devolución específicas. Nos reservamos el derecho de modificar precios o
            descontinuar productos en cualquier momento.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>6. Responsabilidad</h4>
          <p>
            <strong>Djulia</strong> no garantiza que el sitio sea ininterrumpido o libre de errores.
            El uso del sitio es bajo tu propia responsabilidad. No nos hacemos responsables de
            daños directos o indirectos derivados del uso de nuestros servicios o productos.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>7. Modificaciones</h4>
          <p>
            Podremos actualizar estos Términos en cualquier momento. Te recomendamos revisarlos
            periódicamente. El uso continuado del sitio implica tu aceptación de los cambios.
          </p>

          <h4 className="mt-4" style={{ color: "#c1634e" }}>8. Contacto</h4>
          <p>
            Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través
            de nuestros canales oficiales o visitar cualquiera de nuestras sucursales
            de <strong>Pastelería Djulia</strong>.
          </p>
        </Container>
      </section>
    </>
  );
}

export default Terminos;