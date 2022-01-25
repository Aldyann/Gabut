////////////////////////////
////////CONFIG LOAD/////////
////////////////////////////
const { canModifyQueue } = require("../util/nkm");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "skipto",
  aliases: ["st", "jump"],
  description: "Lewati ke nomor antrian yang dipilih",
  cooldown: 5,
  edesc: `Ketik Perintah, untuk melewati sejumlah lagu tertentu ke lagu yang diinginkan.\nPenggunaan: ${PREFIX}skipto`,

execute(message, args) {
    //if not in a guild return
    if (!message.guild) return;
    //react with approve
    message.react("✅").catch(console.error);
    //if no args return error
    if (!args.length)
      return attentionembed(message, `Mencoba: ${message.client.prefix}${module.exports.name} <Queue Number>`)
    //if not a number return error
    if (isNaN(args[0]))
      return attentionembed(message, `Mencoba: ${message.client.prefix}${module.exports.name} <Queue Number>`)
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if no Queue return error
    if (!queue) return attentionembed(message, "Tidak ada antrian");
    //if member not in the same voice channel as the Bot return
    if (!canModifyQueue(message.member)) return;
    //if args bigger then the Server Queue return error
    if (args[0] > queue.songs.length)
      return attentionembed(message, `Antriannya hanya ${queue.songs.length} panjang!`);
    //set playing to true
    queue.playing = true;
    //if the queue is loop 
    if (queue.loop) {
      //make a loop for all songs to skip and add them at the end again
      for (let i = 0; i < args[0] - 1; i++) 
        queue.songs.push(queue.songs.shift());
    //if not a loop
    } else {
      //remove all songs including the args 
      queue.songs = queue.songs.slice(args[0] - 1);
    }
    //end current song
    queue.connection.dispatcher.end();
    //Send approve
    queue.textChannel.send(
      new MessageEmbed()
        .setColor("#1ace00")
        .setAuthor(`${message.author.username}#${message.author.discriminator} Melewati ${args[0]} Lagu`)
    ).catch(console.error);
  }
};
