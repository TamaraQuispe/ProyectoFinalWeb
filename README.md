#  D'Julia -- Sistema Web de Gestión para Pastelería

> **Proyecto académico -- Universidad Tecnológica del Perú**\
> Curso: *Marcos de Desarrollo Web*\
> Docente: **Enrique Lee Huamani Uriarte**

Una plataforma web moderna diseñada para digitalizar la gestión integral
de una pastelería.\
Incluye un **backend robusto en Java Spring Boot** y un **frontend
elegante en React**, siguiendo buenas prácticas de arquitectura y
diseño.

------------------------------------------------------------------------

Link del backend en la nube: https://djuliabackend.up.railway.app/api
Para usarlo , cambie la variable (baseUrl) en el postman o el API_URL en el front.
Link del frontend en la nube: https://djuliafrontend.up.railway.app

------------------------------------------------------------------------

##  Integrantes del Proyecto

-   Martel Santos **Alexis Nil**
-   Ludeña Flores **Pablo Benjamin**
-   Durand Tucno **Edison Nico**
-   Mejia Condezo **Jean Carlo**
-   Coveñas Quispe **Tamara Alison**
-   Baylón Vila **Omara Yamileth**
-   Yman Avila **Pablo Enrique**

------------------------------------------------------------------------

#  Arquitectura General

El sistema está construido bajo una arquitectura **full‑stack modular**,
con clara separación entre frontend, backend, modelos de datos,
servicios y controladores.

------------------------------------------------------------------------

#  Backend --- Java Spring Boot

##  Estructura por Paquetes

### **1. `config`**

Configuración central del sistema:

-   **EmpresaConfig** -- Datos corporativos inyectados en servicios como
    boletas.
-   **SecurityConfig** -- Rutas públicas/privadas, JWT, CORS, sesiones
    stateless.
-   **GlobalExceptionHandler** -- Manejo uniforme de excepciones en
    formato JSON.

------------------------------------------------------------------------

### **2. `controller`**

Controladores REST organizados por dominio:

-   **AuthController** -- Login, registro y perfil.
-   **DashboardController** -- Gráficos y métricas administrativas.
-   **BoletaController** -- Generación y descarga de boletas PDF.
-   **ProductosController** -- CRUD y manejo de imágenes.
-   **CategoriasController** -- Gestión de categorías.
-   **PedidosController** -- Flujo completo de pedidos y pagos Yape.
-   **UsuariosController** -- Gestión total de usuarios.
-   **ArchivosController** -- Servido seguro de archivos estáticos.

------------------------------------------------------------------------

### **3. `dto`**

Objetos de transferencia de datos para requests/responses:

-   **ApiResponse**, **LoginRequest**, **RegisterRequest**,
-   **CategoriaRequest**, **ProductoRequest**, **PedidoRequest**,
-   DTOs para dashboard y cambios de estado.

------------------------------------------------------------------------

### **4. `model`**

Entidades JPA que representan la base de datos:

-   **Usuario**, **Producto**, **Categoria**, **Pedido**,
    **DetallePedido**,
-   Enums: **Role**, **TipoEntrega**, **EstadoPedido**, **EstadoPago**,
-   **HistorialEstado** --- seguimiento detallado de cambios de estado.

------------------------------------------------------------------------

### **5. `repository`**

Repositorios JPA:

-   **UsuarioRepository**, **ProductoRepository**,
    **CategoriaRepository**,
-   **PedidoRepository**, **HistorialEstadoRepository**.

------------------------------------------------------------------------

### **6. `security`**

Seguridad basada en JWT:

-   **JwtService** -- Generación y validación del token.
-   **JwtAuthenticationFilter** -- Autenticación por petición.
-   **JwtAuthenticationEntryPoint** -- Respuestas 401 personalizadas.

------------------------------------------------------------------------

### **7. `service`**

Lógica de negocio:

-   **AuthService**, **UsuarioService**, **ProductoService**,
-   **CategoriaService**, **PedidoService**, **BoletaService**,
-   **DashboardService**.

------------------------------------------------------------------------

#  Frontend --- React

Organizado por carpetas para facilitar escalabilidad.

------------------------------------------------------------------------

##  `pages`

### **Páginas administrativas (admin)**

-   **Categorias.jsx**
-   **Productos.jsx**
-   **PedidosAdmin.jsx**
-   **Usuarios.jsx**
-   **Dashboard.jsx**

### **Páginas de vendedor**

-   **PedidosVendedor.jsx**
-   **VerificarPagos.jsx**

### **Páginas públicas**

-   **Inicio**, **Tienda**, **Login**, **Registro**, **Perfil**,
-   Secciones informativas: *Nosotros, Contacto, Galería, Testimonios,*
    etc.

------------------------------------------------------------------------

##  `components`

Componentes reutilizables y estilosos:

-   **MyNavbar / MyFooter**
-   **SidebarAdmin / SidebarVendedor**
-   **ProductCard, OrderCard, CarouselConCards**
-   **HeroSection, MiniHeroSection**
-   Botones rápidos: **CarritoBoton**, **WhatsappBoton**

------------------------------------------------------------------------

##  `hooks`

Lógica compartida para consumo de API:

-   **useAuth**, **useDashboard**, **useBoletas**,
-   **useCategorias**, **useProductos**,
-   **usePedidosCliente**, **usePedidosVendedor**,
-   **useUsuarios**

------------------------------------------------------------------------

##  `layouts`

Diseños base:

-   **PublicLayout** -- Navegación pública.
-   **AdminLayout** -- Sidebar + panel administrativo.
-   **VendedorLayout** -- Enfoque operativo en pedidos.

------------------------------------------------------------------------

##  `services`

-   **api.js** -- Cliente Axios con token JWT automático.

------------------------------------------------------------------------

##  `utils`

-   **validators.js** -- Validaciones reutilizables para formularios.

------------------------------------------------------------------------

#  Tecnologías Utilizadas

### **Backend**

-   Java 17
-   Spring Boot (Web, Security, Data JPA)
-   MySQL + Hibernate
-   JWT
-   Maven
-   Generación de PDFs

### **Frontend**

-   React 18
-   Vite
-   React Router
-   Axios
-   Bootstrap + CSS3

### **Otros**

-   Postman
-   Git / GitHub
-   Recursos gráficos para branding

------------------------------------------------------------------------

#  Conclusión

D'Julia integra una arquitectura moderna, componentes escalables y una
interfaz bien estructurada, ideal para la gestión digital de una
pastelería profesional.
