////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/nkm");
const { Client, Collection, MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { attentionembed } = require("../util/attentionembed"); 
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "lyrics",
  aliases: ["ly", "text"],
  description: "Dapatkan lirik untuk lagu yang sedang diputar",
  cooldown: 7.5,
  edesc: `Ketik Perintah sambil mendengarkan lagu, untuk mendapatkan liriknya!\nPenggunaan: ${PREFIX}lyrics`,

async execute(message) {
    //if not in a Guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("✅").catch(console.error);
    //Get the current Queue
    const queue = message.client.queue.get(message.guild.id);
    //If no Queue Error
    if (!queue) return attentionembed(message, "Tidak ada yang bermain");
    //If not in a VOICE 
    if (!canModifyQueue(message.member)) return;
    //Set lyrics to null for the try catch
    let lyrics = null;
    //define the temporary Embed
    let temEmbed = new MessageEmbed()
    .setAuthor("Mencari...").setFooter("Lyrics")
    .setColor("#1c00c2")
    //send it and safe it in a variable
    let result = await message.channel.send(temEmbed)
    //try to find lyrics
    try {
      //use lyricsfinder
      lyrics = await lyricsFinder(queue.songs[0].title,"");
      //If no Lyrics define no lyrics
      if (!lyrics) lyrics = `Lirik tidak ditemukan untuk ${queue.songs[0].title}.`;
    }
    //catch any error
    catch (error) {
      lyrics = `Lirik tidak ditemukan untuk ${queue.songs[0].title}.`;
    }
    //define lyrics Embed
    let lyricsEmbed = new MessageEmbed()
      .setTitle("📑 Lyrics")
      .setDescription(lyrics)
      .setColor("#1c00c2")
    //if to long make slice it 
    if (lyricsEmbed.description.length >= 2048)
      //slice the embed description and redefine it
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      //edit to approve
    return result.edit(lyricsEmbed).catch(console.error);
  }
};
