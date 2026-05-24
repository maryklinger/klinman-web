--Creación de tablas

CREATE TABLE solicitudes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255),
    empresa NVARCHAR(255),
    telefono NVARCHAR(50),
    email NVARCHAR(100),
    servicio NVARCHAR(100),
    mensaje NVARCHAR(500),

    estado NVARCHAR(50) DEFAULT 'pendiente',
    prioridad NVARCHAR(50) DEFAULT 'normal',

    fecha_creacion DATETIME DEFAULT GETDATE()
);


-- Añadimos las columnas de relación
ALTER TABLE solicitudes ADD empresa_id INT NULL;
ALTER TABLE solicitudes ADD servicio_id INT NULL;

-- (Opcional) Si quieres que aparezca el código KLIN-0013 automáticamente
ALTER TABLE solicitudes ADD codigo_ticket AS ('KLIN-' + RIGHT('0000' + CAST(id AS NVARCHAR(10)), 4));


DROP TABLE empresas


-- TABLA DE EMPRESAS (Como el menú "Empresas" de tu captura)
CREATE TABLE empresas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_empresa NVARCHAR(255) NOT NULL,
    rut NVARCHAR(50),
    industria NVARCHAR(100),
    propietario_id INT -- Para asignar a un usuario de Klinman (como Mary Klinger)
);

-- TABLA DE SERVICIOS (El catálogo que gestionas en configuración)
CREATE TABLE servicios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio NVARCHAR(100) NOT NULL,
    color_etiqueta NVARCHAR(20) -- Para que en el Kanban se vea visual
);





-- Para actualizar los registros erróneos.s
UPDATE solicitudes
SET servicio = 'Limpieza Corporativa'
WHERE servicio = 'Limpieza';

UPDATE solicitudes
SET servicio = 'Mantenimiento de Áreas Comunes'
WHERE servicio = 'Mantenimiento';



UPDATE solicitudes
SET empresa = 'Mi aula'
WHERE empresa = 'Miaula';



SELECT * FROM solicitudes;



--INSERCIONES
-- 1. Insertamos las empresas únicas que ya tienes en tus registros
INSERT INTO empresas (nombre_empresa)
SELECT DISTINCT empresa FROM solicitudes WHERE empresa IS NOT NULL;

-- 2. Insertamos los servicios únicos que ya tienes
INSERT INTO servicios (nombre_servicio)
SELECT DISTINCT servicio FROM solicitudes WHERE servicio IS NOT NULL;

-- 3. Vinculamos los IDs nuevos con tus registros antiguos
UPDATE s
SET s.empresa_id = e.id
FROM solicitudes s
JOIN empresas e ON s.empresa = e.nombre_empresa;

UPDATE s
SET s.servicio_id = ser.id
FROM solicitudes s
JOIN servicios ser ON s.servicio = ser.nombre_servicio;




 -- 1. Tabla de Roles (Para definir Admin, Supervisor, Operador, etc.)

CREATE TABLE roles (

    id INT IDENTITY(1,1) PRIMARY KEY,

    nombre_rol NVARCHAR(50) NOT NULL UNIQUE -- Ejemplo: 'Administrador'

);



-- 2. Tabla de Usuarios Klinman (Vinculada a un Rol)

CREATE TABLE usuarios (

    id INT IDENTITY(1,1) PRIMARY KEY,

    nombre NVARCHAR(255) NOT NULL,

    email NVARCHAR(100) NOT NULL UNIQUE,

    password_hash NVARCHAR(MAX) NOT NULL, -- Para seguridad

    rol_id INT FOREIGN KEY REFERENCES roles(id),

    estado BIT DEFAULT 1, -- 1 para Activo, 0 para Inactivo

    fecha_registro DATETIME DEFAULT GETDATE()

);

--se agrega nueva columna para vincular con gmail
ALTER TABLE usuarios ADD google_id NVARCHAR(255) NULL;




-- 3. Tabla de Permisos (Las acciones que definimos en la matriz)

CREATE TABLE permisos (

    id INT IDENTITY(1,1) PRIMARY KEY,

    clave_permiso NVARCHAR(50) NOT NULL UNIQUE, -- Ejemplo: 'ver_cartera'

    descripcion NVARCHAR(255)

);


--INSERTS:
-- 1. Limpiamos la tabla de permisos para no duplicar datos
DELETE FROM rol_permisos;
DELETE FROM permisos;

-- 2. Insertamos las claves maestros traduciendo tus checkboxes al formato del Layout
INSERT INTO permisos (clave_permiso, descripcion) VALUES 
('dashboard', 'ACCESO AL DASHBOARD'),
('solicitudes', 'ACCESO A SOLICITUDES'),
('clientes', 'ACCESO A CLIENTES'),
('reportes', 'ACCESO A REPORTES'),
('configuracion', 'ACCESO A CONFIGURAR'),
('cambiar_prioridad', 'CAMBIAR PRIORIDAD'),
('cambiar_estado', 'CAMBIAR ESTADO'),
('modificar_permisos', 'MODIFICAR PERMISOS USUARIOS'),
('descargar_reportes', 'DESCARGAR REPORTES');


-- 4. Tabla Intermedia: Matriz de Permisos (Aquí se guarda lo que "marcas")

-- Si existe el registro, el rol tiene el permiso. Si se borra, se le quita.

CREATE TABLE rol_permisos (

    rol_id INT FOREIGN KEY REFERENCES roles(id),

    permiso_id INT FOREIGN KEY REFERENCES permisos(id),

    PRIMARY KEY (rol_id, permiso_id)

);


CREATE TABLE usuario_permisos (
    usuario_id INT FOREIGN KEY REFERENCES usuarios(id),
    permiso_id INT FOREIGN KEY REFERENCES permisos(id),
    PRIMARY KEY (usuario_id, permiso_id)
);




-- INSERCIÓN INICIAL DE DATOS (Ejemplo)

INSERT INTO roles (nombre_rol) VALUES ('Administrador'), ('Supervisor'), ('Operador');

INSERT INTO permisos (clave_permiso, descripcion) VALUES 

('ver_cartera', 'Ver Cartera de Clientes'),

('edit_ticket', 'Editar Estados de Tickets'),

('admin_users', 'Gestionar Usuarios y Configuración');


-- TABLA DE FEEDBACK / CALIFICACIONES
CREATE TABLE feedback_servicios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,               -- Vinculado a solicitudes(id)
    calificacion INT NOT NULL,            -- 1 a 5 estrellas
    comentario NVARCHAR(MAX),             -- Comentarios detallados
    fecha_registro DATETIME DEFAULT GETDATE(),
    
    -- Restricción para asegurar integridad
    CONSTRAINT FK_Feedback_Ticket FOREIGN KEY (ticket_id) REFERENCES solicitudes(id)
);



CREATE TABLE bitacora_ticket (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    mensaje_actualizacion NVARCHAR(MAX),
    fecha_registro DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ticket_id) REFERENCES solicitudes(id)
);



SELECT * FROM rol_permisos;

SELECT * FROM permisos;

SELECT * FROM usuarios;

DELETE FROM solicitudes;

SELECT * FROM solicitudes;


--para resetear el contador de solicitudes
DELETE FROM solicitudes;
DBCC CHECKIDENT ('solicitudes', RESEED, 0);