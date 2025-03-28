import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID!;

// 📌 Webhook para verificação do Meta
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verificado com sucesso! ✅");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 📌 Webhook para receber mensagens do WhatsApp
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object) {
        const entry = body.entry?.[0]?.changes?.[0]?.value;
        if (entry && entry.messages) {
            const message = entry.messages[0];
            const sender = message.from;
            const text = message.text?.body;

            console.log(`Mensagem recebida de ${sender}: ${text}`);

            await sendMessage(sender, "Olá! Sou um bot profissional no WhatsApp 🚀");

        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// 📌 Função para enviar mensagem no WhatsApp
async function sendMessage(to: string, message: string) {
    await axios.post(
        `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: to,
            text: { body: message }
        },
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
}

// 📌 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
            