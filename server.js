const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This is the "Mood" endpoint your Frontend is looking for
app.post('/mood', (req, res) => {
  const { mood } = req.body;
  console.log("Received mood:", mood);
  res.json({ message: `Server received your mood: ${mood}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});