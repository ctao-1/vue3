const express = require('express')
const router = express.Router()
const pool = require('../db') // 已连接的 pg client pool

router.post('/', async (req, res) => {
    const { place_name, longitude, latitude, elevation, incident, incident_data, description } = req.body

    // 拼成 "POINT(lon lat)" 字符串
    const pointWKT = `POINT(${longitude} ${latitude})`

    try {
        await pool.query(
            `INSERT INTO changzhenluarmy1 
            (place_name, coordinate, elevation, incident, incident_data, description) 
            VALUES ($1, ST_GeogFromText($2), $3, $4, $5, $6)`,
            [place_name, `SRID=4326;${pointWKT}`, elevation, incident, incident_data, description]
        )
        res.status(201).json({ message: '上传成功' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: '上传失败' })
    }
})
module.exports = router