-- r_fast_lab.sql
-- Base de datos para el reto de R-FAST (Portal de Resultados de Laboratorio)

-- Eliminar tablas (en orden inverso por llaves foráneas)
DROP TABLE IF EXISTS resultados CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;
DROP TABLE IF EXISTS grupos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;

-- Crear tabla Pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(20),
    direccion TEXT,
    celular VARCHAR(20),
    correo VARCHAR(100)
);

-- Crear tabla Grupos de Exámenes
CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL -- Ej: "Química sanguínea", "Hematología"
);

-- Crear tabla Órdenes de Laboratorio
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    codigo_documento VARCHAR(50) NOT NULL,
    numero_orden VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla Resultados
CREATE TABLE resultados (
    id SERIAL PRIMARY KEY,
    orden_id INT REFERENCES ordenes(id) ON DELETE CASCADE,
    grupo_id INT REFERENCES grupos(id) ON DELETE SET NULL,
    nombre_procedimiento VARCHAR(150) NOT NULL,
    resultado TEXT NOT NULL,
    rango_normal VARCHAR(100)
);

-- Insertar Datos de Prueba
INSERT INTO pacientes (tipo_documento, numero_documento, nombre_completo, fecha_nacimiento, sexo, direccion, celular, correo)
VALUES
('Cédula', '123456789', 'Ana Gómez', '1990-01-01', 'Femenino', 'Calle 123, Bogotá', '3101234567', 'ana@example.com');

INSERT INTO grupos (nombre) VALUES
('Química sanguínea'),
('Hematología');

INSERT INTO ordenes (paciente_id, fecha, codigo_documento, numero_orden)
VALUES
(1, '2024-09-01', 'DOC001', 'ORD001');

INSERT INTO resultados (orden_id, grupo_id, nombre_procedimiento, resultado, rango_normal)
VALUES
(1, 1, 'Glucometría', '95 mg/dL', '70-100 mg/dL'),
(1, 1, 'Hierro total', '120 µg/dL', '60-170 µg/dL'),
(1, 2, 'Hemoglobina', '14.2 g/dL', '12-16 g/dL');
