const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    }
});

client.on("qr", qr => {
    console.log("QR Recebido! Escaneie no WhatsApp.");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp conectado com sucesso!");
});

client.on("auth_failure", () => {
    console.log("Falha de autenticação. Apagando sessão...");
});

client.initialize();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

client.on("message", async (msg) => {
  if (
    msg.body.match(
      /(menu|oi|olá|ola|bom dia|boa tarde|boa noite|fala|ajuda|suporte|atendimento|assistência|assistencia|duvida|dúvida|como funciona|horário|horario|aberto|start|iniciar|ok)/i
    ) &&
    msg.from.endsWith("@c.us")
  ) {
    const chat = await msg.getChat();

    await delay(2000);
    await chat.sendStateTyping();
    await delay(2000);

    // Saudação automática
    const hora = new Date().getHours();
    let saudacao = "Olá";

    if (hora >= 5 && hora < 12) saudacao = "Bom dia";
    else if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    // Texto final com o que você pediu
    const texto =
      `${saudacao}! 😊\n\n` +
      "✨ *Eu sou o assistente virtual da Black White Hair!* ✨\n" +
      "Trabalhamos com *trançados* e *unha simples* estilos personalizados e muito cuidado com seu visual! 💇🏽‍♀️✨\n\n" +
      "📌 *Horário de funcionamento:*\n" +
      "🕒 Segunda a Sabado: *08h às 18h*\n" +
      "❌ Domingo e feriados: horário à combinar\n\n" +
      "No momento, a Evelyn não está disponível.\n" +
      "Por favor, *aguarde um pouquinho, assim que possivel ela entrará em contato*, tá bom? 💛\n\n" +
      "e continuará seu atendimento Obrigada! 😊";

    await client.sendMessage(msg.from, texto);
  }
});
