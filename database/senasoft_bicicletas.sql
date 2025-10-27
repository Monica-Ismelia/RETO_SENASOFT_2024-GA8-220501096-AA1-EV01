-- senasoft_bicicletas.sql
-- Base de datos para el reto del SENA (Sistema de Alquiler de Bicicletas)

-- Eliminar tablas (en orden inverso por llaves foráneas)
DROP TABLE IF EXISTS participaciones CASCADE;
DROP TABLE IF EXISTS alquileres CASCADE;
DROP TABLE IF EXISTS eventos CASCADE;
DROP TABLE IF EXISTS bicicletas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Crear tabla Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    estrato_socioeconomico INT CHECK (estrato_socioeconomico BETWEEN 1 AND 6),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    es_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Bicicletas
CREATE TABLE bicicletas (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    color VARCHAR(30) NOT NULL,
    estado VARCHAR(20) DEFAULT 'disponible',
    precio_por_hora DECIMAL(10, 2) NOT NULL,
    ubicacion_regional VARCHAR(100) NOT NULL
);

-- Crear tabla Eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_hora TIMESTAMP NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    creado_por_admin INT REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Alquileres
CREATE TABLE alquileres (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    bicicleta_id INT REFERENCES bicicletas(id) ON DELETE CASCADE,
    fecha_hora_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_fin TIMESTAMP,
    tarifa_inicial DECIMAL(10, 2),
    valor_final DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Participaciones
CREATE TABLE participaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    evento_id INT REFERENCES eventos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, evento_id)
);

-- Insertar Datos de Prueba
INSERT INTO usuarios (nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, estrato_socioeconomico, correo, contrasena, es_admin)
VALUES
('Ana Gómez', 'Cédula', '123456789', '1990-01-01', 2, 'ana@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', false),
('Carlos Ruiz', 'Cédula', '987654321', '1992-08-20', 4, 'carlos@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', false),
('Admin SENA', 'Cédula', '111111111', '1985-03-15', 5, 'admin@senasoft.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true);

INSERT INTO bicicletas (marca, color, estado, precio_por_hora, ubicacion_regional)
VALUES
('Shimano', 'Rojo', 'disponible', 5000, 'Bogotá'),
('Trek', 'Azul', 'disponible', 6000, 'Medellín'),
('Specialized', 'Negro', 'alquilada', 7000, 'Cali'),
('Giant', 'Verde', 'disponible', 5500, 'Barranquilla'),
('Cannondale', 'Blanco', 'disponible', 6500, 'Cartagena');

INSERT INTO eventos (nombre, descripcion, fecha_hora, ubicacion, creado_por_admin)
VALUES
('Ciclopaseo SENA Bogotá', 'Recorrido por el Parque Simón Bolívar', '2025-10-05 08:00:00', 'Parque Simón Bolívar, Bogotá', 3),
('Ciclopaseo SENA Medellín', 'Ruta por el Río Medellín', '2025-10-12 09:00:00', 'Río Medellín, Medellín', 3);

INSERT INTO alquileres (usuario_id, bicicleta_id, fecha_hora_inicio, fecha_hora_fin, tarifa_inicial, valor_final)
VALUES
(1, 3, '2025-09-20 10:00:00', NULL, 7000, NULL), -- Alquiler activo (Ana Gómez)
(2, 1, '2025-09-15 14:00:00', '2025-09-15 16:00:00', 5000, 4500); -- Alquiler devuelto (Carlos Ruiz)

INSERT INTO participaciones (usuario_id, evento_id)
VALUES
(1, 1), -- Ana Gómez en evento Bogotá
(2, 2); -- Carlos Ruiz en evento Medellín
