import Container from "react-bootstrap/Container";
import HeroSection from "../components/HeroSection";

function Privacidad() {
  return (
    <>
      <HeroSection
        title="POLÍTICA DE PRIVACIDAD"
        subtitle="Cuidamos tu información con la misma dedicación con la que horneamos nuestros postres."
        background="src/assets/FondoPasteleria.jpg" 
        height="60vh"
        align="center"
        backgroundPosition="center top"
      />
      <section
        className="py-5"
        style={{
          backgroundColor: "#fff5ef",
          color: "#4a2c2a",
        }}
      >
        <Container>
          <h1
            className="fw-bold mb-4 text-center"
            style={{
              color: "#d97b66",
            }}
          >
            POLÍTICA DE PRIVACIDAD
          </h1>

          <p>
            La presente Política de Privacidad establece los términos en que{" "}
            <strong>Pastelería Djulia</strong> usa y protege la información
            proporcionada por sus clientes y visitantes al momento de utilizar
            nuestro sitio web. En <strong>Djulia</strong> estamos comprometidos
            con la seguridad y la dulzura en cada detalle —incluyendo tus datos.
          </p>

          <h3 className="mt-4" style={{ color: "#c1634e" }}>
            Información que es recogida
          </h3>
          <p>
            Nuestro sitio podrá recoger información personal como nombre,
            dirección de correo electrónico y datos necesarios para procesar
            pedidos o realizar entregas.
          </p>

          <h3 className="mt-4" style={{ color: "#c1634e" }}>
            Uso de la información
          </h3>
          <p>
            Usamos tu información únicamente para ofrecerte el mejor servicio
            posible: gestionar tus pedidos, comunicarte promociones y mejorar
            nuestros productos. En <strong>Djulia</strong> creemos que la
            confianza se construye con transparencia y cuidado.
          </p>

          <h3 className="mt-4" style={{ color: "#c1634e" }}>
            Cookies
          </h3>
          <p>
            Utilizamos cookies para mejorar tu experiencia y personalizar tu
            visita. Puedes desactivarlas en cualquier momento, aunque eso podría
            afectar el funcionamiento del sitio.
          </p>

          <h3 className="mt-4" style={{ color: "#c1634e" }}>
            Enlaces a Terceros
          </h3>
          <p>
            Este sitio podría contener enlaces a otros lugares de interés. Una
            vez que abandones nuestra página, <strong>Djulia</strong> no tiene
            control sobre esos sitios y no somos responsables de sus políticas
            de privacidad.
          </p>

          <h3 className="mt-4" style={{ color: "#c1634e" }}>
            Control de tu información personal
          </h3>
          <p>
            Puedes restringir la recopilación o el uso de tu información en
            cualquier momento. <strong>Djulia</strong> no venderá ni
            compartirá tus datos sin tu consentimiento, salvo requerimiento
            legal.
          </p>

          <p>
            En <strong>Pastelería Djulia</strong>, cada detalle importa, y tu
            privacidad también.
          </p>
        </Container>
      </section>
    </>
  );
}

export default Privacidad;