🧪 Portal de Resultados de Laboratorio – R-FAST
Reto SENASOFT 2024

Sistema de consulta de resultados de laboratorio clínico para pacientes del SENA.
Permite autenticación segura, visualización de órdenes y resultados médicos, con filtros, paginación y CAPTCHA.

✅ Requisitos cumplidos
Login seguro con tipo de identificación, número de documento y fecha de nacimiento.
Validaciones de formulario con mensajes de error claros.
Perfil del paciente con datos personales.
Listado paginado de órdenes (10 por página).
Ordenamiento por fecha (ascendente y descendente).
Filtros por número de orden y rango de fechas.
Detalle de orden con resultados agrupados por tipo de examen

CAPTCHA implementado (Google reCAPTCHA) como medida de seguridad adicional.
🛠️ Tecnologías utilizadas
    Frontend: React + Vite
    Backend: Node.js + Express
    Base de datos: PostgreSQL
    Seguridad: Google reCAPTCHA v2
👤 Credenciales de prueba

CAMPO
VALOR
Tipo de identificación
Cédula
Número de identificación
123456789
Fecha de nacimiento
1990-01-01



▶️ Instrucciones de instalación
1. Base de datos
Crea una base de datos llamada r_fast_lab en PostgreSQL.
Ejecuta el script SQL: database/r_fast_lab.sql.


2. Backend


cd senasoft-lab-backend
npm install
cp .env.example .env  # y configura tus credenciales de PostgreSQL
npm start
# Servidor corriendo en http://localhost:5001

***************************************************

3. Frontend
cd senasoft-lab-frontend
npm install
cp .env.example .env  # y configura tu clave de reCAPTCHA si es necesario
npm run dev
# Aplicación en http://localhost:5174