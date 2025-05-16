// routes/search.js
const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    const keyword = req.query.q
    try {
        const result = await pool.query(`
      SELECT 
        place_name, 
        ST_X(coordinate::geometry) AS longitude, 
        ST_Y(coordinate::geometry) AS latitude 
      FROM changzhenluarmy1
      WHERE place_name ILIKE $1
      LIMIT 10
    `, [`%${keyword}%`])

        res.json(result.rows)
    } catch (err) {
        console.error('搜索失败:', err)
        res.status(500).send('搜索失败')
    }
})

module.exports = router
