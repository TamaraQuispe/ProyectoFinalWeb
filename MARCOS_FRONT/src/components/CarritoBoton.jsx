import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaTimes, FaUpload, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import qrYape from "../assets/qryape.jpg";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../hooks/useAuth";
import { usePedidosCliente } from "../hooks/usePedidosCliente";

const CarritoBoton = ({ carrito = [], setCarrito }) => {
const [mostrarCarrito, setMostrarCarrito] = useState(false);
const [mostrarModal, setMostrarModal] = useState(false);
const [mostrarLoading, setMostrarLoading] = useState(false);
const [mostrarExito, setMostrarExito] = useState(false);
const [toastActivo, setToastActivo] = useState(false);
const [animarNumero, setAnimarNumero] = useState(false);
const [formData, setFormData] = useState({
nombres: "",
apellidos: "",
dni: "",
numeroYape: "",
comprobante: null,
tipoEntrega: "RECOJO_TIENDA",
direccion: "",
referencias: "",
observaciones: "",
telefono: ""
});
const [imagenPreview, setImagenPreview] = useState(null);
const [datosPersonalesCargados, setDatosPersonalesCargados] = useState(false);
const navigate = useNavigate();
const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
const totalPagar = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

useEffect(() => {
if (totalItems > 0) {
setAnimarNumero(true);
const timeout = setTimeout(() => setAnimarNumero(false), 300);
return () => clearTimeout(timeout);
}
}, [totalItems]);

useEffect(() => {
if (mostrarModal || mostrarLoading || mostrarExito) {
document.body.style.overflow = "hidden";
} else {
document.body.style.overflow = "unset";
}
return () => {
document.body.style.overflow = "unset";
};
}, [mostrarModal, mostrarLoading, mostrarExito]);

useEffect(() => {
const cargarDatosPerfil = async () => {
if (mostrarModal && !datosPersonalesCargados) {
try {
const { data } = await useAuthActions.getProfile(false);

if (data) {
setFormData((prev) => ({
...prev,
nombres: data.nombre || "",
apellidos: data.apellido || "",
dni: data.dni || ""
}));
setDatosPersonalesCargados(true);
}
} catch (error) {
console.error("Error al cargar perfil:", error);
}
}
};

cargarDatosPerfil();
}, [mostrarModal, datosPersonalesCargados]);

const actualizarCarrito = (nuevo) => {
setCarrito(nuevo);
localStorage.setItem("carrito", JSON.stringify(nuevo));
};

const aumentar = (id) => {
const item = carrito.find((i) => i.id === id);
if (!item) return;
if (item.cantidad + 1 > item.stock) {
if (!toastActivo) {
setToastActivo(true);
toast.error(`No puedes superar el stock disponible de ${item.nombre}`, {
onClose: () => setToastActivo(false)
});
}
return;
}
const nuevo = carrito.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i));
actualizarCarrito(nuevo);
};

const disminuir = (id) => {
const nuevo = carrito
.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad - 1) } : i))
.filter((i) => i.cantidad > 0);
actualizarCarrito(nuevo);
};

const eliminarItem = (id) => {
const nuevo = carrito.filter((i) => i.id !== id);
actualizarCarrito(nuevo);
};

const vaciarCarrito = () => {
actualizarCarrito([]);
};

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e) => {
const file = e.target.files[0];
if (file) {
setFormData((prev) => ({ ...prev, comprobante: file }));
setImagenPreview(URL.createObjectURL(file));
}
};

const pagar = () => {
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
if (token && role === "CLIENTE") {
setMostrarCarrito(false);
setMostrarModal(true);
} else {
navigate("/login");
}
};

const procederPedido = async () => {
if (!formData.nombres || !formData.apellidos || !formData.dni) {
toast.error("Por favor completa todos los datos personales");
return;
}
if (!formData.numeroYape || !formData.comprobante) {
toast.error("Por favor completa los datos de pago");
return;
}
if (formData.tipoEntrega === "DELIVERY") {
if (!formData.direccion || !formData.telefono) {
toast.error("Por favor completa los datos de delivery");
return;
}
if (!formData.referencias) {
toast.error("Las referencias son obligatorias");
return;
}
if (!formData.observaciones) {
toast.error("Las observaciones son obligatorias");
return;
}
}

setMostrarModal(false);
setMostrarLoading(true);

try {
const detalles = carrito.map((item) => ({
productoId: item.id,
cantidad: item.cantidad
}));

const pedidoData = {
detalles,
tipoEntrega: formData.tipoEntrega,
numeroYape: formData.numeroYape
};

if (formData.tipoEntrega === "DELIVERY") {
pedidoData.direccionEntrega = formData.direccion;
pedidoData.telefonoContacto = formData.telefono;
pedidoData.referencia = formData.referencias;
pedidoData.observaciones = formData.observaciones;
}

const formDataToSend = new FormData();
formDataToSend.append("pedido", JSON.stringify(pedidoData));
formDataToSend.append("comprobanteYape", formData.comprobante);

await usePedidosCliente.crear(formDataToSend);

setMostrarLoading(false);
setMostrarExito(true);
} catch (error) {
setMostrarLoading(false);
setMostrarModal(true);
console.error("Error al procesar pedido:", error);
}
};

const cerrarExito = () => {
setMostrarExito(false);
actualizarCarrito([]);
setFormData({
nombres: "",
apellidos: "",
dni: "",
numeroYape: "",
comprobante: null,
tipoEntrega: "RECOJO_TIENDA",
direccion: "",
referencias: "",
observaciones: "",
telefono: ""
});
setImagenPreview(null);
setDatosPersonalesCargados(false);
};

return (
<>
{mostrarCarrito && (
<div
style={{
position: "fixed",
bottom: "170px",
right: "20px",
width: "300px",
maxHeight: "400px",
overflowY: "auto",
backgroundColor: "#fff",
padding: "15px",
borderRadius: "12px",
boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
zIndex: 3000,
animation: "fadeIn 0.2s ease"
}}
>
<h5 className="text-center mb-2">Carrito</h5>
<hr />
{carrito.length === 0 ? (
<p className="text-center text-muted">Carrito vacío</p>
) : (
carrito.map((item) => (
<div
key={item.id}
style={{
display: "flex",
marginBottom: "12px",
gap: "10px",
alignItems: "center",
borderBottom: "1px solid #eee",
paddingBottom: "8px"
}}
>
<img
src={item.imagen}
alt={item.nombre}
style={{
width: "50px",
height: "50px",
objectFit: "cover",
borderRadius: "5px"
}}
/>
<div style={{ flex: 1 }}>
<strong style={{ fontSize: "14px" }}>{item.nombre}</strong>
<p style={{ margin: "2px 0", fontSize: "13px", color: "#555" }}>
{item.cantidad} unidad{item.cantidad > 1 ? "es" : ""} de S/ {item.precio.toFixed(2)} = S/{" "}
{(item.cantidad * item.precio).toFixed(2)}
</p>
<div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
<FaMinus size={14} onClick={() => disminuir(item.id)} style={{ cursor: "pointer", color: "#d28f56" }} />
<span
style={{
padding: "2px 8px",
borderRadius: "8px",
background: "#ffe5c0",
fontSize: "13px"
}}
>
{item.cantidad}
</span>
<FaPlus size={14} onClick={() => aumentar(item.id)} style={{ cursor: "pointer", color: "#d28f56" }} />
</div>
</div>
<FaTrash onClick={() => eliminarItem(item.id)} size={18} color="red" style={{ cursor: "pointer" }} />
</div>
))
)}
{carrito.length > 0 && (
<>
<hr />
<div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px", color: "#333", marginBottom: "10px" }}>
<span>Total:</span>
<span>S/ {totalPagar.toFixed(2)}</span>
</div>
<div style={{ display: "flex", gap: "10px" }}>
<button
onClick={vaciarCarrito}
style={{
flex: 1,
backgroundColor: "#d9534f",
color: "white",
border: "none",
padding: "8px",
borderRadius: "6px",
cursor: "pointer"
}}
>
Vaciar carrito
</button>
<button
onClick={pagar}
style={{
flex: 1,
backgroundColor: "#28a745",
color: "white",
border: "none",
padding: "8px",
borderRadius: "6px",
cursor: "pointer"
}}
>
Pagar
</button>
</div>
</>
)}
</div>
)}

{mostrarModal && (
<div
style={{
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
backgroundColor: "rgba(0, 0, 0, 0.6)",
display: "flex",
alignItems: "center",
justifyContent: "center",
zIndex: 5000,
animation: "fadeIn 0.3s ease"
}}
>
<div
style={{
backgroundColor: "#fff8f0",
borderRadius: "20px",
width: "90%",
maxWidth: "700px",
maxHeight: "90vh",
overflowY: "auto",
padding: "30px",
position: "relative",
boxShadow: "0 10px 40px rgba(210, 143, 86, 0.3)",
border: "3px solid #f4c790",
animation: "slideIn 0.3s ease"
}}
onClick={(e) => e.stopPropagation()}
>
<FaTimes
onClick={() => setMostrarModal(false)}
style={{
position: "absolute",
top: "15px",
right: "15px",
cursor: "pointer",
fontSize: "24px",
color: "#d28f56"
}}
/>

<h2
style={{
textAlign: "center",
color: "#8b4513",
marginBottom: "10px",
fontFamily: "'Pacifico', cursive",
fontSize: "32px"
}}
>
Finalizar Pedido
</h2>

<p
style={{
textAlign: "center",
color: "#d28f56",
marginBottom: "25px",
fontSize: "14px"
}}
>
Completa tus datos para recibir tu pedido
</p>

<div
style={{
backgroundColor: "#ffe5c0",
padding: "15px",
borderRadius: "12px",
marginBottom: "20px",
border: "2px dashed #d28f56"
}}
>
<h6 style={{ color: "#8b4513", marginBottom: "10px" }}>Resumen del Pedido</h6>

{carrito.map((item) => (
<div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
<span>
{item.nombre} x{item.cantidad}
</span>
<span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
</div>
))}

<hr style={{ margin: "10px 0" }} />

<div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px", color: "#8b4513" }}>
<span>Total:</span>
<span>S/ {totalPagar.toFixed(2)}</span>
</div>
</div>

<div style={{ display: "grid", gap: "20px" }}>
<div>
<h6 style={{ color: "#8b4513", marginBottom: "12px" }}>Datos Personales</h6>
<div style={{ display: "grid", gap: "12px" }}>
<input
type="text"
name="nombres"
placeholder="Nombres *"
value={formData.nombres}
onChange={handleInputChange}
disabled={datosPersonalesCargados}
style={{
...inputStyle,
...(datosPersonalesCargados && disabledInputStyle)
}}
/>
<input
type="text"
name="apellidos"
placeholder="Apellidos *"
value={formData.apellidos}
onChange={handleInputChange}
disabled={datosPersonalesCargados}
style={{
...inputStyle,
...(datosPersonalesCargados && disabledInputStyle)
}}
/>
<input
type="text"
name="dni"
placeholder="DNI *"
maxLength="8"
value={formData.dni}
onChange={handleInputChange}
disabled={datosPersonalesCargados}
style={{
...inputStyle,
...(datosPersonalesCargados && disabledInputStyle)
}}
/>
</div>
</div>

<div>
<h6 style={{ color: "#8b4513", marginBottom: "12px" }}>Método de Pago - YAPE</h6>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
<div>
<input type="text" name="numeroYape" placeholder="Número de Yape *" maxLength="9" value={formData.numeroYape} onChange={handleInputChange} style={inputStyle} />

<label
style={{
display: "block",
marginTop: "12px",
padding: "12px",
backgroundColor: "#fff",
border: "2px dashed #d28f56",
borderRadius: "8px",
textAlign: "center",
cursor: "pointer",
color: "#8b4513"
}}
>
<FaUpload style={{ marginRight: "8px" }} />
{formData.comprobante ? formData.comprobante.name : "Subir comprobante *"}

<input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
</label>

<div
style={{
backgroundColor: "#fff3e0",
padding: "10px",
borderRadius: "8px",
marginTop: "10px",
fontSize: "12px",
color: "#8b4513",
border: "1px solid #f4c790"
}}
>
<strong>Instrucciones:</strong>
<ol style={{ margin: "5px 0 0 15px", padding: 0 }}>
<li>Abre tu app YAPE</li>
<li>Escanea el QR del costado</li>
<li>Confirma el pago</li>
<li>Captura el comprobante</li>
<li>Adjúntalo aquí arriba</li>
</ol>
</div>
</div>

<div
style={{
backgroundColor: "#fff",
padding: "15px",
borderRadius: "12px",
border: "2px solid #d28f56",
textAlign: "center"
}}
>
<p style={{ fontSize: "12px", color: "#8b4513", marginBottom: "8px", fontWeight: "bold" }}>Escanea el QR</p>
<img
src={qrYape}
alt="QR Yape"
style={{
width: "100%",
maxWidth: "180px",
height: "auto",
margin: "0 auto",
borderRadius: "8px",
border: "2px solid #d28f56"
}}
/>
</div>
</div>
</div>

<div>
<h6 style={{ color: "#8b4513", marginBottom: "12px" }}>Tipo de Entrega</h6>

<select name="tipoEntrega" value={formData.tipoEntrega} onChange={handleInputChange} style={inputStyle}>
<option value="RECOJO_TIENDA">Recojo en tienda</option>
<option value="DELIVERY">Delivery</option>
</select>

{formData.tipoEntrega === "DELIVERY" && (
<div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
<input type="text" name="direccion" placeholder="Dirección *" value={formData.direccion} onChange={handleInputChange} style={inputStyle} />

<input type="text" name="telefono" placeholder="Número de contacto *" maxLength="9" value={formData.telefono} onChange={handleInputChange} style={inputStyle} />

<input type="text" name="referencias" placeholder="Referencias *" value={formData.referencias} onChange={handleInputChange} style={inputStyle} />

<textarea
name="observaciones"
placeholder="Observaciones *"
value={formData.observaciones}
onChange={handleInputChange}
rows="3"
style={{ ...inputStyle, resize: "vertical" }}
/>
</div>
)}
</div>

<button
onClick={procederPedido}
style={{
backgroundColor: "#d28f56",
color: "white",
border: "none",
padding: "15px",
borderRadius: "12px",
fontSize: "18px",
fontWeight: "bold",
cursor: "pointer",
transition: "all 0.3s ease",
boxShadow: "0 4px 15px rgba(210, 143, 86, 0.4)",
marginTop: "10px"
}}
onMouseOver={(e) => {
e.target.style.backgroundColor = "#b87943";
e.target.style.transform = "scale(1.02)";
}}
onMouseOut={(e) => {
e.target.style.backgroundColor = "#d28f56";
e.target.style.transform = "scale(1)";
}}
>
Proceder Pedido
</button>
</div>
</div>
</div>
)}

{mostrarLoading && (
<div
style={{
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
backgroundColor: "rgba(0, 0, 0, 0.8)",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
zIndex: 6000,
animation: "fadeIn 0.3s ease"
}}
>
<div
style={{
width: "80px",
height: "80px",
border: "6px solid #f4c790",
borderTop: "6px solid #d28f56",
borderRadius: "50%",
animation: "spin 1s linear infinite"
}}
/>
<p
style={{
color: "#fff",
fontSize: "20px",
fontWeight: "bold",
marginTop: "20px",
animation: "pulse 1.5s ease-in-out infinite"
}}
>
Procesando pedido...
</p>
<p
style={{
color: "#f4c790",
fontSize: "14px",
marginTop: "5px"
}}
>
Por favor espera
</p>
</div>
)}

{mostrarExito && (
<div
style={{
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
backgroundColor: "rgba(0, 0, 0, 0.7)",
display: "flex",
alignItems: "center",
justifyContent: "center",
zIndex: 6000,
animation: "fadeIn 0.3s ease"
}}
>
<div
style={{
backgroundColor: "#fff8f0",
borderRadius: "20px",
width: "90%",
maxWidth: "500px",
padding: "40px 30px",
textAlign: "center",
boxShadow: "0 10px 40px rgba(210, 143, 86, 0.4)",
border: "3px solid #4caf50",
animation: "slideIn 0.4s ease"
}}
>
<div
style={{
width: "80px",
height: "80px",
margin: "0 auto 20px",
backgroundColor: "#4caf50",
borderRadius: "50%",
display: "flex",
alignItems: "center",
justifyContent: "center",
animation: "scaleIn 0.5s ease"
}}
>
<FaCheckCircle size={50} color="white" />
</div>

<h2
style={{
color: "#4caf50",
fontSize: "28px",
fontWeight: "bold",
marginBottom: "15px"
}}
>
¡Pedido Realizado!
</h2>

<p
style={{
color: "#8b4513",
fontSize: "16px",
marginBottom: "10px",
lineHeight: "1.6"
}}
>
Espera la confirmación de parte de la tienda.
</p>

<p
style={{
color: "#d28f56",
fontSize: "14px",
marginBottom: "25px"
}}
>
No olvides revisar tus pedidos mediante tu perfil.
</p>

<button
onClick={cerrarExito}
style={{
backgroundColor: "#d28f56",
color: "white",
border: "none",
padding: "12px 40px",
borderRadius: "10px",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer",
transition: "all 0.3s ease",
boxShadow: "0 4px 15px rgba(210, 143, 86, 0.4)"
}}
onMouseOver={(e) => {
e.target.style.backgroundColor = "#b87943";
e.target.style.transform = "scale(1.05)";
}}
onMouseOut={(e) => {
e.target.style.backgroundColor = "#d28f56";
e.target.style.transform = "scale(1)";
}}
>
Entendido
</button>
</div>
</div>
)}

<div
onClick={() => setMostrarCarrito(!mostrarCarrito)}
style={{
position: "fixed",
bottom: "100px",
right: "20px",
backgroundColor: "#ff6b35",
color: "white",
borderRadius: "50%",
width: "65px",
height: "65px",
display: "flex",
alignItems: "center",
justifyContent: "center",
boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
zIndex: 1500,
cursor: "pointer",
transition: "transform 0.2s ease, background-color 0.3s ease"
}}
>
<FaShoppingCart size={30} />
{totalItems > 0 && (
<div
className={animarNumero ? "pop" : ""}
style={{
position: "absolute",
top: "2px",
right: "2px",
backgroundColor: "red",
color: "white",
width: "22px",
height: "22px",
borderRadius: "50%",
fontSize: "13px",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "bold",
transition: "transform 0.2s ease"
}}
>
{totalItems}
</div>
)}
</div>

<style>
{`
@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}
@keyframes slideIn {
from { transform: translateY(-50px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
@keyframes pop {
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
}
@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}
@keyframes pulse {
0%, 100% { opacity: 1; }
50% { opacity: 0.6; }
}
@keyframes scaleIn {
from { transform: scale(0); }
to { transform: scale(1); }
}
.pop {
animation: pop 0.3s ease;
}
`}
</style>
</>
);
};

const inputStyle = {
width: "100%",
padding: "12px",
border: "2px solid #f4c790",
borderRadius: "8px",
fontSize: "14px",
backgroundColor: "#fff",
transition: "all 0.3s ease",
outline: "none"
};

const disabledInputStyle = {
backgroundColor: "#f5f5f5",
color: "#6b6b6b",
cursor: "not-allowed",
opacity: 0.8,
border: "2px solid #d0d0d0"
};

export default CarritoBoton;