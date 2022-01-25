const { canModifyQueue } = require("../util/nkm");
const { Client, Collection, MessageEmbed } = require("discord.js");

const { attentionembed } = require("../util/attentionembed"); 
const { PREFIX } = require(`../config.json`);
module.exports = {
  name: "pause",
  description: "Jeda musik yang sedang diputar",
  cooldown: 5,
  edesc: `Ketik perintah ini untuk menjeda Lagu!\nPenggunaan: ${PREFIX}pause`,
  execute(message) {
    //If not in a guild return
    if(!message.guild) return;
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message, "Tidak ada yang bermain").catch(console.error);
    //If not in the same channel return
    if (!canModifyQueue(message.member)) return;
    //If its playing
    if (queue.playing) {
      //set playing to false
      queue.playing = false;
      //pause the music
      queue.connection.dispatcher.pause(true);
      //define the pause embed
      const pausemebed = new MessageEmbed().setColor("#1ace00")
      .setAuthor(`${message.author.username} menghentikan musik.`)
      //react with approve emoji
      message.react("✅")
      //return message
      return queue.textChannel.send(pausemebed).catch(console.error);
    }
  }
};
