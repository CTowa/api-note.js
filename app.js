const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creación de la aplicación Express
const app = express();

// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a la base de datos
function dbConnection() {
  let db = null;
  try {
    db = new sqlite3.Database('./students.sqlite', (err) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
      } else {
        console.log('Conexión exitosa a la base de datos SQLite');
      }
    });
  } catch (err) {
    console.error(err);
  }
  return db;
}

// Ruta para obtener todos los estudiantes o crear uno nuevo
app.route('/students')
  .get((req, res) => {
    const db = dbConnection();
    
    db.all("SELECT * FROM students", [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      const students = rows.map(row => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        gender: row.gender,
        age: row.age
      }));
      
      res.json(students);
    });
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      }
    });
  })
  .post((req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    const db = dbConnection();
    
    const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
    db.run(sql, [firstname, lastname, gender, age], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      res.status(201).send(`Estudiante con id: ${this.lastID} creado exitosamente`);
    });
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      }
    });
  });

// Ruta para operaciones con un estudiante específico por ID
app.route('/student/:id')
  .get((req, res) => {
    const id = req.params.id;
    const db = dbConnection();
    
    db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      if (row) {
        res.json(row);
      } else {
        res.status(404).send('No se encontró el estudiante');
      }
    });
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      }
    });
  })
  .put((req, res) => {
    const id = req.params.id;
    const { firstname, lastname, gender, age } = req.body;
    const db = dbConnection();
    
    const sql = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
    db.run(sql, [firstname, lastname, gender, age, id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      const updatedStudent = {
        id: parseInt(id),
        firstname,
        lastname,
        gender,
        age
      };
      
      res.json(updatedStudent);
    });
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      }
    });
  })
  .delete((req, res) => {
    const id = req.params.id;
    const db = dbConnection();
    
    const sql = "DELETE FROM students WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      res.send(`El estudiante con id: ${id} ha sido eliminado.`);
    });
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      }
    });
  });

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});