const Discord = require(`discord.js`);
const { Client, Collection, MessageEmbed,MessageAttachment } = require(`discord.js`);
const { keep_alive } = require('./keep.js');
const { readdirSync } = require(`fs`);
const { join } = require(`path`);
const { TOKEN, PREFIX } = require(`./config.json`);
const figlet = require("figlet");
const client = new Client({ disableMentions: `` , partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);

//ini menyala ketika BOT MULAI JANGAN SENTUH
client.on(`ready`, () => {	
console.log(`${client.user.username} ready!`);
  const status = [
      `#staysafe & #stayhealth`,
      `bersama ${client.users.cache.size} babu`,
      `stay di ${client.guilds.cache.size} server`,
      `Developers by Aldyann`,
   `Version 3.0  ♬`
    ]
    setInterval(() => {
    client.user.setActivity(status[Math.floor(Math.random() * status.length)], {type : "LISTENING"})
  }, 5000)

   ///////////////////////////////
    ////////////IFCHEMPTY//////////
        //hapus semuanya di antara 2 komentar besar itu jika Anda ingin menonaktifkan bot yang tersisa saat ch. atau antrian kosong!
        setInterval(() => { 
        let member;
      client.guilds.cache.forEach(async guild =>{
      await delay(15);
        member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
      //if not connected
        if(!member.voice.channel)
        return;
        //if connected but not speaking
    if(!member.speaking&&!client.queue)
    { return member.voice.channel.leave(); } 
      //if alone 
      if (member.voice.channel.members.size === 1) 
      { return member.voice.channel.leave(); }
    });
  
    }, (5000));
    ////////////////////////////////
    ////////////////////////////////
    figlet.text(`${client.user.username} ready!`, function (err, data) {
      if (err) {
          console.log('Something went wrong');
          console.dir(err);
      }
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
      console.log(data)
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
    })
   
});
//JANGAN SENTUH
client.on(`warn`, (info) => console.log(info));
//JANGAN SENTUH
client.on(`error`, console.error);
//JAGAN SENTUH
//FOLDERS:
//Data custommsg admin FUN General Music NSFW lainnya
commandFiles = readdirSync(join(__dirname, `Music`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `Music`, `${file}`));
  client.commands.set(command.name, command);
}
commandFiles = readdirSync(join(__dirname, `others`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `others`, `${file}`));
  client.commands.set(command.name, command);
}
//COMMANDS //JANGAN SENTUH
client.on(`message`, async (message) => {
  if (message.author.bot) return;
  
  if(message.content === `${PREFIX}ping`)
  return message.reply(":ping_pong: `" + client.ws.ping + "ms`")

  if (message.content.toLowerCase() === `${PREFIX}uptime`) {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
   return message.channel.send(`***__Music-Bot-Uptime:__***\n\`\`\`fix\n${days}d ${hours}h ${minutes}m ${seconds}s\n\`\`\``);
}

  if(message.content.includes(client.user.id)) {
    message.reply(new Discord.MessageEmbed().setColor("#00ebaa").setAuthor(`${message.author.username}, Prefix saya adalah ${PREFIX}, Untuk memulai; Tekan ${PREFIX}help`, message.author.displayAvatarURL({dynamic:true})));
  } 
//command Handler JANGAN SENTUH
 const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
 if (!prefixRegex.test(message.content)) return;
 const [, matchedPrefix] = message.content.match(prefixRegex);
 const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
 const commandName = args.shift().toLowerCase();
 const command =
   client.commands.get(commandName) ||
   client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
 if (!command) return;
 if (!cooldowns.has(command.name)) {
   cooldowns.set(command.name, new Collection());
 }
 const now = Date.now();
 const timestamps = cooldowns.get(command.name);
 const cooldownAmount = (command.cooldown || 1) * 1000;
 if (timestamps.has(message.author.id)) {
   const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
   if (now < expirationTime) {
     const timeLeft = (expirationTime - now) / 1000;
     return message.reply(
      new MessageEmbed().setColor("#30ff91")
      .setTitle(`❌ Please wait \`${timeLeft.toFixed(1)} seconds\` before reusing the \`${PREFIX}${command.name}\`!`)    
     );
   }
 }
 timestamps.set(message.author.id, now);
 setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
 try {
   command.execute(message, args, client);
 } catch (error) {
   console.error(error);
   message.reply(`There was an error executing that command.`).catch(console.error);
 }


});
function delay(delayInms) {
 return new Promise(resolve => {
   setTimeout(() => {
     resolve(2);
   }, delayInms);
 });
}

//Bot coded by yannJg [ Aldyan ]!
