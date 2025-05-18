// routes/places.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
      place_name,
      ST_X(coordinate::geometry) AS longitude,
      ST_Y(coordinate::geometry) AS latitude,
      elevation,
      incident,
      incident_data,
      description
      FROM changzhenluarmy1
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
