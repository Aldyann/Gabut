////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/nkm");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed"); 
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "stop",
  description: "Mengentikan Musik",
  aliases: ["leave", "end"],
  cooldown: 5,
  edesc: `Ketik Perintah, untuk berhenti bermain dan keluar dari saluran.\nPenggunaan: ${PREFIX}stop`,

async execute(message,args,client) {
  //if not in a guild retunr
  if (!message.guild) return;
  //react with approve emoji
  message.react("✅").catch(console.error);
  const { channel } = message.member.voice;
  //get the serverQueue
  const queue = message.client.queue.get(message.guild.id);
  //if not a valid channel
  if (!channel) return attentionembed(message, "Silakan bergabung dengan Saluran Suara terlebih dahulu");  
  //If not in the same channel return error
  if (queue && channel !== message.guild.me.voice.channel)
  return attentionembed(message, `Anda harus berada di Saluran Suara yang sama dengan saya`);
  //if no Queue return error
  if (!queue)
    return attentionembed(message, "Tidak ada yang bisa Anda hentikan!");
  //if not in the same channel return
  if (!canModifyQueue(message.member)) return;
  //Leave the channel
  await channel.leave();
  //send the approve message    
  message.channel.send(new MessageEmbed()
  .setColor("#1ace00")
  .setAuthor(`${message.author.username} hentikan musiknya!`))
  .catch(console.error);
  }
};
