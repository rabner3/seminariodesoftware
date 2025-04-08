# Sistema de Gestión de Equipos Informáticos

Un sistema web completo para la gestión, asignación y reparación de equipos informáticos. Diseñado para organizaciones que necesitan mantener un control detallado de su inventario tecnológico.

![Sistema de Gestión de Equipos Informáticos]

## Características Principales

- 📱 **Inventario detallado** de equipos informáticos con información técnica completa
- 👥 **Asignación de equipos** a usuarios finales
- 🔧 **Gestión de reparaciones** con proceso completo desde solicitud hasta entrega
- 📊 **Estadísticas y reportes** para toma de decisiones
- 📋 **Sistema de bitácoras** detalladas de asignaciones y reparaciones
- 🔔 **Sistema de notificaciones** para mantener informados a usuarios y técnicos

## Módulos del Sistema

1. **Gestión de Usuarios**
   - Diferentes roles: Administrador, Técnico, Usuario
   - Control de acceso basado en roles
   - Perfiles de usuario detallados

2. **Gestión de Equipos**
   - Inventario completo con detalles técnicos
   - Historial de asignaciones y reparaciones
   - Control de estado (disponible, asignado, en reparación, etc.)

3. **Asignaciones**
   - Asignación de equipos a usuarios
   - Reasignaciones
   - Bitácora de movimientos

4. **Solicitudes y Reparaciones**
   - Creación de solicitudes por usuarios
   - Asignación a técnicos
   - Proceso completo: recepción, diagnóstico, reparación, entrega
   - Registro de partes utilizadas y costos

5. **Reportes y Estadísticas**
   - Generación de reportes en PDF
   - Gráficos estadísticos
   - Dashboard para análisis rápido

## Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca JavaScript para interfaces de usuario
- **React Router**: Navegación entre componentes
- **Axios**: Cliente HTTP para peticiones a la API
- **Chart.js**: Visualización de datos
- **jsPDF**: Generación de reportes en PDF

### Backend
- **Node.js**: Entorno de ejecución JavaScript
- **Express**: Framework para aplicaciones web
- **MySQL**: Base de datos relacional
- **bcrypt**: Encriptación de contraseñas
- **JWT**: Autenticación basada en tokens

## Diagrama de la Base de Datos

El sistema utiliza una base de datos relacional MySQL con las siguientes tablas principales:

- `usuarios`: Almacena información de todos los usuarios del sistema
- `departamentos`: Organización jerárquica de la empresa
- `equipos`: Inventario completo de dispositivos tecnológicos
- `asignaciones`: Registro de asignaciones de equipos a usuarios
- `solicitudes`: Peticiones de soporte técnico
- `reparaciones`: Seguimiento de procesos de reparación
- `partes`: Inventario de repuestos disponibles
- `bitacoras_asign`: Registro histórico de asignaciones
- `bitacoras_repar`: Registro histórico de actividades de reparación
- `notificaciones`: Sistema de alertas para usuarios y técnicos

## Instalación

### Requisitos
- Node.js v16 o superior
- MySQL 5.7 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/gestion-equipos.git
   cd gestion-equipos
   ```

2. **Configurar la base de datos**
   - Crear una base de datos MySQL
   - Importar el esquema desde `bd.sql`

3. **Configurar variables de entorno**
   - Editar el archivo `.env` con las credenciales de tu base de datos:
     ```
     PORT=8080
     CORS_ORIGIN=http://localhost:5173
     DB_HOST=localhost
     DB_USER=tu_usuario
     DB_PASSWORD=tu_password
     DB_NAME=proyecto
     ```

4. **Instalar dependencias del servidor**
   ```bash
   cd server
   npm install
   ```

5. **Instalar dependencias del cliente**
   ```bash
   cd ../client
   npm install
   ```

6. **Iniciar el servidor (modo desarrollo)**
   ```bash
   cd ../server
   npm run dev
   ```

7. **Iniciar el cliente (modo desarrollo)**
   ```bash
   cd ../client
   npm run dev
   ```

8. Acceder a la aplicación en `http://localhost:5173`

## Estructura del Proyecto

```
proyecto/
├── client/                 # Frontend en React
│   ├── public/             # Archivos estáticos
│   └── src/                # Código fuente
│       ├── assets/         # Estilos y recursos
│       ├── components/     # Componentes React
│       ├── context/        # Context API
│       └── pages/          # Páginas principales
│
└── server/                 # Backend en Node.js/Express
    ├── config/             # Configuración BD y conexiones
    ├── controllers/        # Controladores
    ├── models/             # Modelos 
    ├── routes/             # Rutas API
    └── services/           # Servicios adicionales
```

## Uso del Sistema

### Roles de Usuario

1. **Administrador**
   - Acceso completo a todas las funcionalidades
   - Gestión de usuarios y departamentos
   - Generación de reportes y estadísticas

2. **Técnico**
   - Gestión de reparaciones
   - Diagnóstico de equipos
   - Registro de bitácoras

3. **Usuario Regular**
   - Ver equipos asignados
   - Crear solicitudes de soporte
   - Recibir notificaciones

### Flujo de Trabajo Típico

1. **Administrador**: Registra equipos en el inventario
2. **Administrador**: Asigna equipos a usuarios
3. **Usuario**: Solicita soporte si hay problemas
4. **Administrador**: Asigna solicitud a un técnico
5. **Técnico**: Realiza diagnóstico y reparación
6. **Técnico**: Completa la reparación y reporta
7. **Usuario**: Recibe equipo reparado

## Licencia

[MIT](LICENSE)

## Contacto

Para cualquier consulta o sugerencia, contáctenos por correo electrónico:
- rabneraa@gmail.com

---

Desarrollado por [Sala9, Seminario de Software] &copy; 2025
