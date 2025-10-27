# 🚴‍♂️ Sistema de Alquiler de Bicicletas – Reto SenaSoft

Sistema de información para el control de alquiler de bicicletas y promoción de ciclopaseos en las regionales del SENA.  
Desarrollado como solución al **Reto SenaSoft - Desarrollo Libre V2**.

---

## ✅ Requisitos cumplidos

El sistema cumple con los **8 requisitos mínimos** del reto:

### Para el rol **Usuario**:
- ✅ Autenticación para alquilar bicicletas  
- ✅ Marca la bicicleta como **no disponible** al alquilar  
- ✅ Calcula la **tarifa inicial** del recorrido  
- ✅ Al devolver, la bicicleta se **reactiva como disponible** y se genera el **valor a pagar**  
- ✅ Aplica **descuento por estrato socioeconómico**:
  - Estratos 1–2: 10%
  - Estratos 3–4: 5%
  - Estratos 5–6: 0%
- ✅ Permite **participar en eventos de ciclopaseo**

### Para el rol **Administrador**:
- ✅ Calcula **ganancias netas mensuales**
- ✅ Muestra las bicicletas alquiladas en un **mapa interactivo** (Leaflet + OpenStreetMap)
- ✅ Permite **publicar nuevos eventos de ciclopaseo**

---


## 🏗️ Arquitectura

- **Frontend**: React + Vite  
- **Backend**: Node.js + Express  
- **Base de datos**: PostgreSQL  
- **Mapa**: Leaflet + OpenStreetMap  
- **Autenticación**: Login diferenciado (usuario vs admin)

👥 Usuarios de prueba
ROL
DOCUMENTO / CORREO
FECHA NAC. / CONTRASEÑA
Usuario
123456789
1990-01-01
Admin
admin@senasoft.com
password admin123