# yugi-Bot
Chatbot de yugioh para genrenciar torneios e ranking da comunidade

1. Criar API

Criar a api do wpp no site developers.facebook


2. Criar o server express ts.

Configurar o script "dev" e "start"

    npm install ts-node-dev

3. Iniciar o ngrok e o server

        npx ngrok http 3000

        npm run dev

4. Testar o endpoint

    https://random-id.ngrok.io/webhook?hub.mode=subscribe&hub.verify_token=seu_token_personalizado&hub.challenge=1234
    
    https://5466-190-171-84-117.ngrok-free.app/webhook?hub.mode=subscribe&hub.verify_token=494048223801187&hub.challenge=1234


    
5. Cadastrar o webhook

No site do Meta Developer, cadastre o webhook como o endereco do ngrok/webhook e a token de validaçãod o wpp do .env