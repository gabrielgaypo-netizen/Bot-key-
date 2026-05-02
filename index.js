const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// ⚠️ depois vamos colocar o token no Render
const TOKEN = process.env.TOKEN;MTQ5OTkyNjk3NjI2ODYwMzQ5Mg.GI9Z3w.z8MN35R2H1sslphK1RW6ayTGDGvpoq7sOeF3AU

let keys = {};

function gerarKey() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

client.once('ready', () => {
  console.log("Bot online!");
});

client.on('messageCreate', message => {

  if (message.content.startsWith("!key")) {

    const args = message.content.split(" ");
    const tempo = args[1];

    const key = gerarKey();

    let expires = null;

    if (tempo === "1d") {
      expires = Date.now() + 86400000;
    }

    else if (tempo === "7d") {
      expires = Date.now() + (7 * 86400000);
    }

    else if (tempo === "perm") {
      expires = null;
    }

    else {
      return message.reply("use: !key 1d | 7d | perm");
    }

    keys[key] = { expires };

    message.reply(`🔑 ${key}`);
  }

});

// API
app.get('/check', (req, res) => {
  const key = req.query.key;

  if (!keys[key]) return res.send("invalid");

  if (keys[key].expires && Date.now() > keys[key].expires) {
    return res.send("expired");
  }

  return res.send("valid");
});

app.listen(3000);

client.login(TOKEN);
