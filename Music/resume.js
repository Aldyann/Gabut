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
  name: "resume",
  aliases: ["r"],
  description: "Lanjutkan memutar musik.",
  cooldown: 5,
  edesc: `Ketik perintah ini untuk melanjutkan Lagu yang dijeda!\nPenggunaan: ${PREFIX}resume`,
  
execute(message) {
    //if not a guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("✅").catch(console.error);
    //get the Server Queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message,"Tidak ada yang bermain!").catch(console.error);
    //if user not in the same channel as the bot retunr
    if (!canModifyQueue(message.member)) return;
    //if its paused
    if (!queue.playing) {
      //set it to true
      queue.playing = true;
      //resume the Bot
      queue.connection.dispatcher.resume();
      //Create approve embed
      const playembed = new MessageEmbed().setColor("#1ace00")
      .setAuthor(`${message.author.username} melanjutkan musik!`)
      //send the approve
      return queue.textChannel.send(playembed).catch(console.error);
    }
    //if its not paused return error
    return  attentionembed(message, "Antrian tidak dijeda!").catch(console.error);
  }
};
