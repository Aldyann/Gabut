////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/nkm");
const { MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed"); 
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Toggle musik loop",
  cooldown: 3,
  edesc: `Cukup ketik Perintah di obrolan untuk mengaktifkan / menonaktifkan loop, Anda juga dapat bereaksi terhadap emoji loop, untuk menerima tujuan yang sama!\nPenggunaan: ${PREFIX}loop`,
async execute(message) {
    //if not in a Guild return
    if(!message.guild) return;
    //Get the current Queue
    const queue = message.client.queue.get(message.guild.id);
    //If no Queue Error
    if (!queue) return attentionembed(message, "Tidak ada yang bermain").catch(console.error);
    //If not in a VOICE 
    if (!await canModifyQueue(message.member)) return;
    //Reverse the Loop state
    queue.loop = !queue.loop;
    //Define the Loop embed
    const loopembed = new MessageEmbed()
    .setColor(queue.loop ? "#1ace00" : "#c20000")
    .setAuthor(`Loop sekarang ${queue.loop ? " AKTIF" : " MATI"}`)
    //react with approve emoji
    message.react("✅");
    //send message into the Queue chat
    return queue.textChannel
      .send(loopembed)
      .catch(console.error);
  }
};
