// index.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
const placesRoute = require('./routes/places');
const searchRoute = require('./routes/search')

app.use('/api/search', searchRoute)
app.use('/api/places', placesRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
