-- ============================================
-- ELIMINAR TABLAS SI EXISTEN (orden inverso por FK)
-- ============================================
DROP TABLE IF EXISTS historial_estado;
DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedido;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS usuario;

-- ============================================
-- CREAR TABLA CATEGORIA
-- ============================================
CREATE TABLE categoria (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nombre VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================
-- CREAR TABLA PRODUCTO
-- ============================================
CREATE TABLE producto (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL,
                          descripcion TEXT,
                          precio DECIMAL(10, 2) NOT NULL,
                          stock INT NOT NULL DEFAULT 0,
                          categoria_id BIGINT NOT NULL,
                          imagen VARCHAR(500),
                          FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE CASCADE
);

-- ============================================
-- CREAR TABLA USUARIO
-- ============================================
CREATE TABLE usuario (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nombre VARCHAR(100) NOT NULL,
                         apellido VARCHAR(100) NOT NULL,
                         celular VARCHAR(20),
                         correo VARCHAR(150) NOT NULL UNIQUE,
                         direccion VARCHAR(255),
                         dni VARCHAR(20) NOT NULL UNIQUE,
                         password VARCHAR(255) NOT NULL,
                         role VARCHAR(50) NOT NULL
);

-- ============================================
-- CREAR TABLA PEDIDO
-- ============================================
CREATE TABLE pedido (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        usuario_id BIGINT NOT NULL,
                        fecha_pedido DATETIME NOT NULL,
                        total DECIMAL(10, 2) NOT NULL,
                        estado VARCHAR(50) NOT NULL,
                        tipo_entrega VARCHAR(50) NOT NULL,
                        direccion_entrega VARCHAR(500),
                        telefono_contacto VARCHAR(20),
                        referencia VARCHAR(255),
                        observaciones VARCHAR(500),
                        estado_pago VARCHAR(50) NOT NULL,
                        comprobante_yape VARCHAR(500) NOT NULL,
                        numero_yape VARCHAR(20) NOT NULL,
                        fecha_subida_comprobante DATETIME NOT NULL,
                        FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- ============================================
-- CREAR TABLA DETALLE_PEDIDO
-- ============================================
CREATE TABLE detalle_pedido (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                pedido_id BIGINT NOT NULL,
                                producto_id BIGINT NOT NULL,
                                cantidad INT NOT NULL,
                                precio_unitario DECIMAL(10, 2) NOT NULL,
                                subtotal DECIMAL(10, 2) NOT NULL,
                                FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
                                FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);

-- ============================================
-- CREAR TABLA HISTORIAL_ESTADO
-- ============================================
CREATE TABLE historial_estado (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  pedido_id BIGINT NOT NULL,
                                  estado_anterior VARCHAR(50),
                                  estado_nuevo VARCHAR(50) NOT NULL,
                                  usuario_id BIGINT,
                                  observacion VARCHAR(500),
                                  fecha_cambio DATETIME NOT NULL,
                                  FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
                                  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);

-- ============================================
-- INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categoria (id, nombre) VALUES
                                       (1, 'Panes'),
                                       (2, 'Postres'),
                                       (3, 'Cuchareables'),
                                       (4, 'Tortas');

-- ============================================
-- INSERTAR PRODUCTOS
-- ============================================
INSERT INTO producto (id, nombre, descripcion, precio, stock, categoria_id, imagen) VALUES
                                                                                        (1, 'Pan Francés', 'Delicioso pan francés recién horneado.', 0.50, 100, 1, '/archivos/panes/pan_frances.jpg'),
                                                                                        (2, 'Pan Integral', 'Pan saludable integral.', 0.80, 0, 1, '/archivos/panes/pan_integral.jpg'),
                                                                                        (3, 'Croissant', 'Croissant mantecoso y crujiente.', 1.20, 50, 1, '/archivos/panes/croissant.jpg'),
                                                                                        (4, 'Pan de Yema', 'Pan dulce tradicional.', 1.00, 60, 1, '/archivos/panes/pan_yema.jpg'),
                                                                                        (5, 'Pan Ciabatta', 'Pan italiano artesanal.', 2.50, 40, 1, '/archivos/panes/ciabatta.jpg'),

                                                                                        (6, 'Pie de Limón', 'Pie de limón fresco y cremoso.', 15.00, 20, 2, '/archivos/postres/pie_limon.jpg'),
                                                                                        (7, 'Cheesecake', 'Cheesecake clásico y delicioso.', 18.00, 15, 2, '/archivos/postres/cheesecake.jpg'),
                                                                                        (8, 'Tiramisu', 'Postre italiano tradicional.', 20.00, 4, 2, '/archivos/postres/tiramisu.jpg'),
                                                                                        (9, 'Tarta de Manzana', 'Tarta casera de manzana.', 16.00, 18, 2, '/archivos/postres/tarta_manzana.jpg'),

                                                                                        (10, 'Arroz con Leche', 'Postre tradicional peruano.', 3.50, 30, 3, '/archivos/cuchareables/arroz_con_leche.jpg'),
                                                                                        (11, 'Mousse de Chocolate', 'Mousse suave y cremoso.', 4.50, 25, 3, '/archivos/cuchareables/mousse_chocolate.jpg'),
                                                                                        (12, 'Crema Volteada', 'Flan tradicional peruano.', 3.00, 20, 3, '/archivos/cuchareables/crema_volteada.jpg'),
                                                                                        (13, 'Suspiro a la Limeña', 'Dulce típico de Lima.', 5.00, 15, 3, '/archivos/cuchareables/suspiro.jpg'),

                                                                                        (14, 'Torta de Chocolate', 'Torta rica y esponjosa de chocolate.', 25.00, 10, 4, '/archivos/tortas/torta_chocolate.jpg'),
                                                                                        (15, 'Torta de Fresa', 'Torta con fresas frescas y crema.', 28.00, 8, 4, '/archivos/tortas/torta_fresa.jpg'),
                                                                                        (16, 'Torta Tres Leches', 'Clásica torta Tres Leches.', 30.00, 6, 4, '/archivos/tortas/torta_tres_leches.jpg'),
                                                                                        (17, 'Torta Selva Negra', 'Torta alemana con cerezas.', 35.00, 4, 4, '/archivos/tortas/selva_negra.jpg'),
                                                                                        (18, 'Torta Red Velvet', 'Torta aterciopelada con cream cheese.', 32.00, 7, 4, '/archivos/tortas/red_velvet.jpg');

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- Contraseña para todos: 123456
-- ============================================
INSERT INTO usuario (id, nombre, apellido, celular, correo, direccion, dni, password, role) VALUES
                                                                                                (1, 'Carlos', 'Administrador', '987654321', 'admin@pasteleria.com', 'Av. Principal 123, Lima', '12345678', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'ADMIN'),
                                                                                                (2, 'María', 'González', '987654322', 'cliente@gmail.com', 'Jr. Los Olivos 456, Lima', '23456789', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'CLIENTE'),
                                                                                                (3, 'Ana', 'Torres', '987654325', 'ana@gmail.com', 'Av. Las Flores 999, Lima', '56789012', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'CLIENTE'),
                                                                                                (4, 'Pedro', 'Martínez', '987654326', 'pedro@gmail.com', 'Calle Los Pinos 555, Lima', '67890123', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'CLIENTE'),
                                                                                                (5, 'José', 'Pérez', '987654323', 'vendedor@pasteleria.com', 'Calle Comercio 789, Lima', '34567890', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'VENDEDOR'),
                                                                                                (6, 'Laura', 'Ramírez', '987654327', 'laura@gmail.com', 'Av. Central 777, Lima', '78901234', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'CLIENTE'),
                                                                                                (7, 'Roberto', 'Silva', '987654328', 'roberto@gmail.com', 'Jr. Principal 888, Lima', '89012345', '$2a$10$aWBfuJUkfoFgaofK5y66pe.NOtxFVVlQVHY2wsxfrWVoxzc8.IOcO', 'CLIENTE');

-- ============================================
-- INSERTAR PEDIDOS DE PRUEBA
-- ============================================

-- PEDIDO 1: ENTREGADO - RECOJO EN TIENDA
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (1, 2, '2025-11-20 10:30:00', 47.70, 'ENTREGADO', 'RECOJO_TIENDA', NULL, NULL, NULL, 'Primera compra', 'VERIFICADO', '/comprobantes/pedido_1_1732102200000.jpg', '987654322', '2025-11-20 10:30:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (1, 1, 1, 5, 0.50, 2.50),
                                                                                                 (2, 1, 3, 2, 1.20, 2.40),
                                                                                                 (3, 1, 7, 1, 18.00, 18.00),
                                                                                                 (4, 1, 14, 1, 25.00, 25.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (1, 1, NULL, 'POR_CONFIRMAR', 2, 'Pedido creado con comprobante Yape', '2025-11-20 10:30:00'),
                                                                                                                       (2, 1, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-20 10:35:00'),
                                                                                                                       (3, 1, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Pedido confirmado', '2025-11-20 10:40:00'),
                                                                                                                       (4, 1, 'CONFIRMADO', 'EN_PREPARACION', 5, 'Preparando productos', '2025-11-20 11:00:00'),
                                                                                                                       (5, 1, 'EN_PREPARACION', 'LISTO_PARA_RECOGER', 5, 'Pedido listo para recoger', '2025-11-20 14:30:00'),
                                                                                                                       (6, 1, 'LISTO_PARA_RECOGER', 'ENTREGADO', 5, 'Cliente recogió el pedido', '2025-11-20 15:45:00');

-- PEDIDO 2: ENTREGADO - DELIVERY
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (2, 2, '2025-11-21 14:20:00', 61.00, 'ENTREGADO', 'DELIVERY', 'Jr. Los Olivos 456, Lima', '987654322', 'Casa azul con portón negro', 'Tocar el timbre', 'VERIFICADO', '/comprobantes/pedido_2_1732203600000.jpg', '987654322', '2025-11-21 14:20:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (5, 2, 2, 10, 0.80, 8.00),
                                                                                                 (6, 2, 6, 2, 15.00, 30.00),
                                                                                                 (7, 2, 10, 5, 3.50, 17.50),
                                                                                                 (8, 2, 11, 1, 4.50, 4.50);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (7, 2, NULL, 'POR_CONFIRMAR', 2, 'Pedido creado con comprobante Yape', '2025-11-21 14:20:00'),
                                                                                                                       (8, 2, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-21 14:25:00'),
                                                                                                                       (9, 2, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Pedido confirmado', '2025-11-21 14:30:00'),
                                                                                                                       (10, 2, 'CONFIRMADO', 'EN_PREPARACION', 5, 'Preparando pedido', '2025-11-21 15:00:00'),
                                                                                                                       (11, 2, 'EN_PREPARACION', 'EN_CAMINO', 5, 'Pedido en camino', '2025-11-21 17:00:00'),
                                                                                                                       (12, 2, 'EN_CAMINO', 'ENTREGADO', 5, 'Pedido entregado al cliente', '2025-11-21 18:30:00');

-- PEDIDO 3: ENTREGADO - DELIVERY
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (3, 3, '2025-11-22 09:15:00', 93.60, 'ENTREGADO', 'DELIVERY', 'Av. Las Flores 999, Lima', '987654325', 'Edificio blanco, Dpto 301', 'Llamar al llegar', 'VERIFICADO', '/comprobantes/pedido_3_1732272900000.jpg', '987654325', '2025-11-22 09:15:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (9, 3, 1, 6, 0.50, 3.00),
                                                                                                 (10, 3, 3, 3, 1.20, 3.60),
                                                                                                 (11, 3, 15, 1, 28.00, 28.00),
                                                                                                 (12, 3, 16, 2, 30.00, 60.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (13, 3, NULL, 'POR_CONFIRMAR', 3, 'Pedido creado con comprobante Yape', '2025-11-22 09:15:00'),
                                                                                                                       (14, 3, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-22 09:20:00'),
                                                                                                                       (15, 3, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Confirmado', '2025-11-22 09:25:00'),
                                                                                                                       (16, 3, 'CONFIRMADO', 'EN_PREPARACION', 5, 'Preparando productos', '2025-11-22 10:00:00'),
                                                                                                                       (17, 3, 'EN_PREPARACION', 'EN_CAMINO', 5, 'En camino', '2025-11-22 12:00:00'),
                                                                                                                       (18, 3, 'EN_CAMINO', 'ENTREGADO', 5, 'Entregado exitosamente', '2025-11-22 13:45:00');

-- PEDIDO 4: CONFIRMADO - RECOJO EN TIENDA
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (4, 4, '2025-11-23 16:00:00', 67.00, 'CONFIRMADO', 'RECOJO_TIENDA', NULL, NULL, NULL, NULL, 'VERIFICADO', '/comprobantes/pedido_4_1732384800000.jpg', '987654326', '2025-11-23 16:00:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (13, 4, 1, 10, 0.50, 5.00),
                                                                                                 (14, 4, 7, 1, 18.00, 18.00),
                                                                                                 (15, 4, 11, 3, 4.50, 13.50),
                                                                                                 (16, 4, 16, 1, 30.00, 30.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (19, 4, NULL, 'POR_CONFIRMAR', 4, 'Pedido creado con comprobante Yape', '2025-11-23 16:00:00'),
                                                                                                                       (20, 4, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-23 16:05:00'),
                                                                                                                       (21, 4, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Confirmado', '2025-11-23 16:10:00');

-- PEDIDO 5: EN_PREPARACION - DELIVERY
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (5, 6, '2025-11-24 10:00:00', 95.00, 'EN_PREPARACION', 'DELIVERY', 'Av. Central 777, Lima', '987654327', 'Casa de dos pisos', NULL, 'VERIFICADO', '/comprobantes/pedido_5_1732449600000.jpg', '987654327', '2025-11-24 10:00:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (17, 5, 2, 5, 0.80, 4.00),
                                                                                                 (18, 5, 14, 2, 25.00, 50.00),
                                                                                                 (19, 5, 10, 2, 3.50, 7.00),
                                                                                                 (20, 5, 17, 1, 35.00, 35.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (22, 5, NULL, 'POR_CONFIRMAR', 6, 'Pedido creado con comprobante Yape', '2025-11-24 10:00:00'),
                                                                                                                       (23, 5, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-24 10:05:00'),
                                                                                                                       (24, 5, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Confirmado', '2025-11-24 10:10:00'),
                                                                                                                       (25, 5, 'CONFIRMADO', 'EN_PREPARACION', 5, 'Preparando productos', '2025-11-24 10:30:00');

-- PEDIDO 6: LISTO_PARA_RECOGER - RECOJO EN TIENDA
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (6, 7, '2025-11-24 14:00:00', 54.50, 'LISTO_PARA_RECOGER', 'RECOJO_TIENDA', NULL, NULL, NULL, 'Para recoger hoy', 'VERIFICADO', '/comprobantes/pedido_6_1732464000000.jpg', '987654328', '2025-11-24 14:00:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (21, 6, 4, 10, 1.00, 10.00),
                                                                                                 (22, 6, 5, 2, 2.50, 5.00),
                                                                                                 (23, 6, 8, 1, 20.00, 20.00),
                                                                                                 (24, 6, 12, 5, 3.00, 15.00),
                                                                                                 (25, 6, 13, 1, 5.00, 5.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (26, 6, NULL, 'POR_CONFIRMAR', 7, 'Pedido creado con comprobante Yape', '2025-11-24 14:00:00'),
                                                                                                                       (27, 6, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-24 14:05:00'),
                                                                                                                       (28, 6, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Confirmado', '2025-11-24 14:10:00'),
                                                                                                                       (29, 6, 'CONFIRMADO', 'EN_PREPARACION', 5, 'Preparando pedido', '2025-11-24 14:30:00'),
                                                                                                                       (30, 6, 'EN_PREPARACION', 'LISTO_PARA_RECOGER', 5, 'Listo para recoger', '2025-11-24 16:00:00');

-- PEDIDO 7: EN_CAMINO - DELIVERY
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (7, 3, '2025-11-25 11:00:00', 82.00, 'EN_CAMINO', 'DELIVERY', 'Av. Las Flores 999, Lima', '987654325', 'Edificio blanco, Dpto 301', NULL, 'VERIFICADO', '/comprobantes/pedido_7_1732539600000.jpg', '987654325', '2025-11-25 11:00:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (26, 7, 3, 5, 1.20, 6.00),
                                                                                                 (27, 7, 9, 2, 16.00, 32.00),
                                                                                                 (28, 7, 11, 4, 4.50, 18.00),
                                                                                                 (29, 7, 15, 1, 28.00, 28.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (31, 7, NULL, 'POR_CONFIRMAR', 3, 'Pedido creado con comprobante Yape', '2025-11-25 11:00:00'),
                                                                                                                       (32, 7, 'POR_CONFIRMAR', 'POR_CONFIRMAR', 5, 'Pago Yape verificado correctamente', '2025-11-25 11:05:00'),
                                                                                                                       (33, 7, 'POR_CONFIRMAR', 'CONFIRMADO', 5, 'Confirmado', '2025-11-25 11:10:00'),
                                                                                                                       (34, 7, 'CONFIRMADO', 'EN_PREPARACION', 5, 'Preparando pedido', '2025-11-25 11:30:00'),
                                                                                                                       (35, 7, 'EN_PREPARACION', 'EN_CAMINO', 5, 'En camino', '2025-11-25 13:00:00');

-- PEDIDO 8: PENDIENTE_VERIFICACION - DELIVERY
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (8, 4, '2025-11-25 15:30:00', 71.50, 'POR_CONFIRMAR', 'DELIVERY', 'Calle Los Pinos 555, Lima', '987654326', 'Edificio verde, Dpto 502', 'Llamar al llegar', 'PENDIENTE_VERIFICACION', '/comprobantes/pedido_8_1732555800000.jpg', '987654326', '2025-11-25 15:30:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (30, 8, 1, 15, 0.50, 7.50),
                                                                                                 (31, 8, 6, 2, 15.00, 30.00),
                                                                                                 (32, 8, 10, 4, 3.50, 14.00),
                                                                                                 (33, 8, 18, 1, 32.00, 32.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
    (36, 8, NULL, 'POR_CONFIRMAR', 4, 'Pedido creado con comprobante Yape', '2025-11-25 15:30:00');

-- PEDIDO 9: PENDIENTE_VERIFICACION - RECOJO EN TIENDA
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (9, 6, '2025-11-25 17:00:00', 45.00, 'POR_CONFIRMAR', 'RECOJO_TIENDA', NULL, NULL, NULL, 'Para mañana', 'PENDIENTE_VERIFICACION', '/comprobantes/pedido_9_1732561200000.jpg', '987654327', '2025-11-25 17:00:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (34, 9, 2, 10, 0.80, 8.00),
                                                                                                 (35, 9, 7, 2, 18.00, 36.00),
                                                                                                 (36, 9, 12, 1, 3.00, 3.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
    (37, 9, NULL, 'POR_CONFIRMAR', 6, 'Pedido creado con comprobante Yape', '2025-11-25 17:00:00');

-- PEDIDO 10: CANCELADO - Pago rechazado
INSERT INTO pedido (id, usuario_id, fecha_pedido, total, estado, tipo_entrega, direccion_entrega, telefono_contacto, referencia, observaciones, estado_pago, comprobante_yape, numero_yape, fecha_subida_comprobante) VALUES
    (10, 7, '2025-11-25 18:00:00', 38.50, 'CANCELADO', 'RECOJO_TIENDA', NULL, NULL, NULL, 'PAGO RECHAZADO: Comprobante ilegible - 2025-11-25 18:10:00', 'RECHAZADO', '/comprobantes/pedido_10_1732564800000.jpg', '987654328', '2025-11-25 18:00:00');

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
                                                                                                 (37, 10, 1, 5, 0.50, 2.50),
                                                                                                 (38, 10, 11, 2, 4.50, 9.00),
                                                                                                 (39, 10, 15, 1, 28.00, 28.00);

INSERT INTO historial_estado (id, pedido_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
                                                                                                                       (38, 10, NULL, 'POR_CONFIRMAR', 7, 'Pedido creado con comprobante Yape', '2025-11-25 18:00:00'),
                                                                                                                       (39, 10, 'POR_CONFIRMAR', 'CANCELADO', 5, 'Pedido cancelado por pago rechazado: Comprobante ilegible', '2025-11-25 18:10:00');
