const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Connection to your Railway MySQL
const db = mysql.createConnection(process.env.MYSQL_URL);

// 2. Your Groq API Key
const GROQ_API_KEY = "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";

app.post('/mood', async (req, res) => {
  const { mood } = req.body;

  // STEP A: Save to Railway Database
  const query = "INSERT INTO mood_entries (moodtext) VALUES (?)";
  db.query(query, [mood], async (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // STEP B: Get AI Support from Groq
    try {
      const aiResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are a supportive mental health advisor. Provide a short, calming 1-sentence response." },
            { role: "user", content: `I am feeling: ${mood}` }
          ]
        },
        {
          headers: { "Authorization": `Bearer ${GROQ_API_KEY}` }
        }
      );

      const advice = aiResponse.data.choices[0].message.content;
      res.json({ message: advice }); // Send the AI advice back to the website

    } catch (error) {
      console.warn("Groq AI failed, using fallback message.");
      res.json({ message: "Take a deep breath. You are doing better than you think." });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});