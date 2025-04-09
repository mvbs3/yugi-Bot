import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    next(); // Continua para o próximo middleware/rota
});

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

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.post('/webhook', (req, res) => {
    const data = req.body;

    if (data.object) {
        data.entry.forEach(entry => {
            console.log(entry);
             entry.changes.forEach(change => {
               
                const messages = change.value.messages;
                if (messages){
                    messages.forEach(message => {
                        const senderId = message.from;
                        const messageText = message.text.body;
                        console.log(`Mensagem recebida de ${senderId}: ${messageText}`);
                        sendMessage(senderId, `Obrigado por sua mensagem! 😊${messageText}`);
                    })
                } 
             });
        });

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// 📌 Função para enviar mensagem no WhatsApp

// curl -i -X POST `
//   https://graph.facebook.com/v22.0/543100915558553/messages `
//   -H 'Authorization: Bearer <access token>' `
//   -H 'Content-Type: application/json' `
//   -d '{ \"messaging_product\": \"whatsapp\", \"to\": \"\", \"type\": \"template\", \"template\": { \"name\": \"hello_world\", \"language\": { \"code\": \"en_US\" } } }'

async function sendMessage(to, text) {
    const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    console.log(to)
    // Formatando o número do destinatário se necessário
    // Certifique-se que o número esteja no formato internacional, sem + ou espaços
    const formattedTo = to.replace(/\D/g, '');
    console.log(`meu numero é: ${to} e mei tipo: ${typeof to} ${typeof 5581995362886}`)
    
    const data = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text }
    };
    
    const config = {
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    };
    
    try {
      const response = await axios.post(url, data, config);
      console.log("Mensagem enviada com sucesso:", response.data);
      return response.data;
    } catch (error) {
      // Log detalhado do erro
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
        console.error("Erro na resposta do servidor:", {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error("Sem resposta do servidor:", error.request);
      } else {
        // Algo aconteceu na configuração da requisição que causou o erro
        console.error("Erro na configuração da requisição:", error.message);
      }
      throw error;
    }
  }
// 📌 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
            

