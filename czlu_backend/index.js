// index.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
const placesRoute = require('./routes/places');
const searchRoute = require('./routes/search')
const imageRoute = require('./routes/image');

app.use('/api/search', searchRoute)
app.use('/api/places', placesRoute);
app.use('/api/image', imageRoute);

// 连接 PostgreSQL 数据库
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
