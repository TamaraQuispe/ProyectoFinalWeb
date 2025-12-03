import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { useState, useEffect } from "react";
import { useAuthActions } from "../hooks/useAuth";
import { Validators } from "../utils/validators";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    celular: "",
    direccion: "",
    dni: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors = {};
    if (touched.nombre) newErrors.nombre = Validators.validateName(formData.nombre);
    if (touched.apellido) newErrors.apellido = Validators.validateName(formData.apellido);
    if (touched.correo) newErrors.correo = Validators.validateEmail(formData.correo);
    if (touched.password) newErrors.password = Validators.validatePassword(formData.password);
    if (touched.celular) newErrors.celular = Validators.validateCelular(formData.celular);
    if (touched.direccion) newErrors.direccion = Validators.validateDireccion(formData.direccion);
    if (touched.dni) newErrors.dni = Validators.validateDNI(formData.dni);

    setErrors(newErrors);

    const noErrors = Object.values(newErrors).every(err => err === "");
    const allFilled = Object.values(formData).every(val => val !== "");
    setIsValid(noErrors && allFilled);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleRegister = async () => {
    try {
      const response = await useAuthActions.registerCliente(formData);
      if (response) navigate("/login");
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <>
      <HeroSection
        title="Registro"
        subtitle="Crea tu cuenta en segundos"
        description="Únete a nuestra comunidad y disfruta de nuestros deliciosos pasteles."
        background="src/assets/PastelHero.jpg"
        height="80vh"
        align="center"
        backgroundPosition="center top"
      />
      <section className="py-5" style={{ backgroundColor: "#ffe6f0", color: "#5c1a3d" }}>
        <div className="container">
          <h2 className="text-center mb-4">Crea tu cuenta</h2>
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6">
              <form className="mx-auto" style={{ maxWidth: "600px" }} onSubmit={(e) => e.preventDefault()}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" name="nombre" className="form-control" placeholder="Nombres" value={formData.nombre} onChange={handleChange} />
                    {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="apellido" className="form-control" placeholder="Apellidos" value={formData.apellido} onChange={handleChange} />
                    {errors.apellido && <small className="text-danger">{errors.apellido}</small>}
                  </div>
                  <div className="col-md-6">
                    <input type="tel" name="celular" className="form-control" placeholder="Celular" value={formData.celular} onChange={handleChange} />
                    {errors.celular && <small className="text-danger">{errors.celular}</small>}
                  </div>
                  <div className="col-md-6">
                    <input type="email" name="correo" className="form-control" placeholder="Correo" value={formData.correo} onChange={handleChange} />
                    {errors.correo && <small className="text-danger">{errors.correo}</small>}
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="direccion" className="form-control" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
                    {errors.direccion && <small className="text-danger">{errors.direccion}</small>}
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="dni" className="form-control" placeholder="DNI" value={formData.dni} onChange={handleChange} />
                    {errors.dni && <small className="text-danger">{errors.dni}</small>}
                  </div>
                  <div className="col-12">
                    <input type="password" name="password" className="form-control" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
                    {errors.password && <small className="text-danger">{errors.password}</small>}
                  </div>
                </div>
                <button type="button" className="btn w-100 mt-3" style={{ backgroundColor: "#ff99cc", color: "#fff" }} onClick={handleRegister} disabled={!isValid}>
                  Registrarse
                </button>
                <div className="text-center mt-3">
                  <small>¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none" style={{ color: "#d63384" }}>Inicia sesión</Link></small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;