import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Requerido para Azure
    trustServerCertificate: true, // Mejor seguridad
  },
};

let poolPromise;

// Patrón Singleton para reutilizar la conexión
if (!global._sqlPoolPromise) {
  global._sqlPoolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      console.log('Pool de SQL Server conectado globalmente');
      return pool;
    })
    .catch(err => {
      console.error('Error al conectar con SQL Server:', err);
      global._sqlPoolPromise = null;
      throw err;
    });
}

poolPromise = global._sqlPoolPromise;

export async function getDBConnection() {
  return poolPromise;
}

export { sql };