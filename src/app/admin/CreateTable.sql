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




-- Para actualizar los registros erróneos.s
UPDATE solicitudes
SET servicio = 'Limpieza Corporativa'
WHERE servicio = 'Limpieza';

UPDATE solicitudes
SET servicio = 'Mantenimiento de Áreas Comunes'
WHERE servicio = 'Mantenimiento';


SELECT * FROM solicitudes;



