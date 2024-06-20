import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import path from 'path';
import mysql from 'mysql2';
import pool from './db.js'; // Ensure correct path to db.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Database connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "P@ssw0rd",
  database: "recette"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid duplicates
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/api/menus', (req, res) => {
  const query = 'SELECT menuid, menu FROM menu';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching menus:', err);
      return res.status(500).send('Error fetching menus');
    }
    res.status(200).json(results);
  });
});

app.get('/api/submenus/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT ssmenuid, ssmenu FROM ssmenu WHERE menuid = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching submenus:', err);
      return res.status(500).send('Error fetching submenus');
    }
    res.status(200).json(results);
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT userid,username FROM user WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.length > 0) {
      res.json({ success: true, message: 'Login successful', user: result[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});
// API Endpoint to insert data
app.post('/api/users', (req, res) => {
  const { userid, username, roles, groupeid, password } = req.body;
  const sql = `INSERT INTO users (userid, username, roles, groupeid, password) VALUES (?, ?, ?, ?, ?)`;
  connection.query(sql, [userid, username, roles, groupeid, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data');
      return;
    }
    console.log('Inserted new user:', result.insertId);
    res.status(201).send('User created successfully');
  });
});
app.post('/test', upload.single('image'), (req, res) => {
  const { scenario, resultat, userid, Etat, ATI, GTI, menuid, ssmenuid } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const imagePath = image.path; // Save the image path

  const query = `
    INSERT INTO test (scenario, resultat, image_path, userid, Etat, ATI, GTI, menuid, ssmenuid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [scenario, resultat, imagePath, userid, Etat, ATI, GTI, menuid, ssmenuid];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return res.status(500).json({ message: 'Error inserting new test' });
    }

    res.status(201).json({ message: 'New test inserted', testId: result.insertId });
  });
});
app.get('/api/searchTests', async (req, res) => {
  const { scenario, username, etat } = req.query;

  let query = `
    SELECT
        test.testid,
        test.scenario,
        test.resultat,
        user.username,
        menu.menu AS menu_name,
        ssmenu.ssmenu AS submenu_name,
        test.userid,
        test.etat,
        test.ati,
        test.gti,
        test.image_path,
        DATE_FORMAT(test.date, '%Y-%m-%d %H:%i:%s') AS date
    FROM
        test
    JOIN
        user ON test.userid = user.userid
    JOIN
        menu ON test.menuid = menu.menuid
    JOIN
        ssmenu ON test.ssmenuid = ssmenu.ssmenuid
    WHERE 1=1
  `;
  
  const params = [];

  if (scenario) {
    query += ' AND test.scenario LIKE ?';
    params.push(`%${scenario}%`);
  }
  if (username) {
    query += ' AND user.username LIKE ?';
    params.push(`%${username}%`);
  }
  if (etat) {
    query += ' AND test.etat = ?';
    params.push(etat);
  }

  query += ' ORDER BY test.date ASC';

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error searching for tests:', error);
    res.status(500).send('Server error');
  }
});
app.put('/api/updateTest/:testid', (req, res) => {
  const { testid } = req.params;
  const { etat, gti } = req.body;

  const query = `
    UPDATE test
    SET etat = ?, gti = ?
    WHERE testid = ?
  `;

  db.query(query, [etat, gti, testid], (err, result) => {
    if (err) {
      console.error('Error updating test details:', err);
      return res.status(500).json({ message: 'Error updating test details' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Test details updated successfully' });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(8800, () => {
  console.log("Connected to backend SQL");
});
