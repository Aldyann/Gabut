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
  name: "skip",
  aliases: ["s"],
  description: "Lewati lagu yang sedang diputar",
  cooldown: 5,
  edesc: `Ketik Perintah, untuk melompat ke lagu yang sedang didengarkan.\nPenggunaan: ${PREFIX}skip`,

execute(message) {
    //if not in a guild retunr
    if (!message.guild) return;
    //react with approve emoji
    message.react("✅").catch(console.error);
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if no Queue return error
    if (!queue)
      return attentionembed(message, "Tidak ada yang bisa Anda lewati!").catch(console.error);
    //if not in the same channel return
    if (!canModifyQueue(message.member)) return;
    //set playing to true 
    queue.playing = true;
    //end current song
    queue.connection.dispatcher.end();
    //send approve message
    queue.textChannel.send(
      new MessageEmbed().setColor("#1ace00").setAuthor(`${message.author.username} melewatkan lagu.`)
    ).catch(console.error);
  }
};
