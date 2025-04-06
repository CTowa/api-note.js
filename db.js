const sqlite3 = require('sqlite3').verbose();

// Crear conexión a la base de datos
const db = new sqlite3.Database('./students.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite');
  }
});

// Crear tabla de estudiantes
const createTableQuery = `
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  gender TEXT NOT NULL,
  age TEXT
)`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err.message);
  } else {
    console.log('Tabla de estudiantes creada exitosamente');
    
    // Opcional: Insertar algunos datos de prueba
    const insertData = `
    INSERT INTO students (firstname, lastname, gender, age)
    VALUES 
      ('Juan', 'Pérez', 'Masculino', '20'),
      ('María', 'González', 'Femenino', '22')
    `;
    
    db.run(insertData, (err) => {
      if (err) {
        console.error('Error al insertar datos de prueba:', err.message);
      } else {
        console.log('Datos de prueba insertados exitosamente');
      }
    });
  }
});

// Cerrar la conexión a la base de datos
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos cerrada');
  }
});