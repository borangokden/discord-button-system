const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const Jimp = require("jimp");
const db = require("quick.db");
const matthe = require('discord-buttons')
matthe(client)

var prefix = ayarlar.prefix;

client.on("ready", () => {
  console.log(`[MATTHE] bot başarıyla aktif edildi: ${client.user.tag}!`);
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

require("./util/eventLoader")(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`[MATTHE] ${files.length} adet komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`[MATTHE] yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.login(ayarlar.token);

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});


client.on("message", (message) => {

    if (message.content !== "KANKA BURAYA SADECE 1 KERELİK BİRŞEY YAZ YOKSA HERKES KULLANABİLİR! ÖRNEK !buton KULLANDIKTAN SONRA SALLAMASYON BİSEYLER YAZ ÖRNEK sfklsdlfksşlkfd" || message.author.bot) return;
  
  let EtkinlikKatılımcısı = new matthe.MessageButton()
    .setStyle('red') 
    .setLabel('Etkinlik Katılımcısı') 
    .setID('EtkinlikKatılımcısı'); 

  let ÇekilişKatılımcısı = new matthe.MessageButton()
    .setStyle('green') 
    .setLabel('Çekiliş Katılımcısı') 
    .setID('ÇekilişKatılımcısı');
  
  message.channel.send(`
Merhaba!
 
Çekiliş Katılımcısı alarak **nitro, spotify, netflix ve benzeri çekilişlere katılıp ödül sahibi** olabilirsiniz.

Aşağıda bulunan butonlardan **Etkinlik Katılımcısı alarak konserlerimizden, oyunlarımızdan, ve etkinliklerimizden** faydalanabilirsiniz.

\`NOT:\` Kayıtlı , kayıtsız olarak hepiniz bu kanalı görebilmektesiniz. Bu sunucumuzda everyone here atılmayacağından dolayı kesinlikle rollerinizi almayı unutmayın.
`, { 
    buttons: [ EtkinlikKatılımcısı, ÇekilişKatılımcısı]
});
});
  
client.on('clickButton', async (button) => {

    if (button.id === 'EtkinlikKatılımcısı') {
        if (button.clicker.member.roles.cache.get((ayarlar.EtkinlikKatılımcısı))) {
            await button.clicker.member.roles.remove((ayarlar.EtkinlikKatılımcısı))
            await button.reply.think(true);
            await button.reply.edit("Etkinlik Katılımcısı rolü başarıyla üzerinizden alındı!")
        } else {
            await button.clicker.member.roles.add(((ayarlar.EtkinlikKatılımcısı)))
            await button.reply.think(true);
            await button.reply.edit("Etkinlik Katılımcısı rolünü başarıyla aldınız!")
        }
    }


    if (button.id === 'ÇekilişKatılımcısı') {
        if (button.clicker.member.roles.cache.get((ayarlar.ÇekilişKatılımcısı))) {
            await button.clicker.member.roles.remove((ayarlar.ÇekilişKatılımcısı))
            await button.reply.think(true);
            await button.reply.edit(`Çekiliş Katılımcısı rolü başarıyla üzerinizden alındı!`)
        } else {
            await button.clicker.member.roles.add((ayarlar.ÇekilişKatılımcısı))
            await button.reply.think(true);
            await button.reply.edit(`Çekiliş Katılımcısı rolünü başarıyla aldınız!`)
        }

    }
  });