////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const ytsr = require("youtube-sr")
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed"); 
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "search",
  description: "Cari dan pilih video untuk diputar",
  aliases: ["find"],
  cooldown: 3,
  edesc: `Ketik Perintah ini untuk menemukan 5 hasil pertama untuk lagu Anda!\nPenggunaan: ${PREFIX}search <TITEL | URL>`,

async execute(message,args,client) {
    //if its not in a guild return
    if(!message.guild) return;
     //define channel
     const { channel } = message.member.voice;
     //get serverqueue
     const serverQueue = message.client.queue.get(message.guild.id);
    //react with approve emoji
    message.react("✅").catch(console.error);
    //if the argslength is null return error
    if (!args.length)
      return attentionembed(message,`Pakai: ${message.client.prefix}${module.exports.name} <Nama Vidio>`)
    //if there is already a search return error
    if (message.channel.activeCollector)
      return attentionembed(message,"Ada pencarian aktif!");
    //if the user is not in a voice channel return error
    if (!message.member.voice.channel)
      return attentionembed(message,"Silakan bergabung dengan voice channel terlebih dahulu")
       //If not in the same channel return error
    if (serverQueue && channel !== message.guild.me.voice.channel)
    return attentionembed(message, `Anda harus berada di Voice Channel yang sama dengan saya`);
    //define search
    const search = args.join(" ");
    //define a temporary Loading Embed
    let temEmbed = new MessageEmbed()
    .setAuthor("Mencari...", "https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1")
    .setColor("#1c00c2")
    //define the Result Embed
    let resultsEmbed = new MessageEmbed()
      .setTitle("✅ Hasil untuk: ")
      .setDescription(`\`${search}\``)
      .setColor("#1ace00")
      .setFooter("Pilih dengan nomor", client.user.displayAvatarURL() )
    //try to find top 5 results
    try {
      //find them
      const results = await ytsr.search(search, { limit: 5 });
      //map them and sort them and add a Field to the ResultEmbed
      results.map((video, index) => resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`));
      // send the temporary embed
      const resultsMessage = await message.channel.send(temEmbed)
      //react with 5 Numbers
        await resultsMessage.react("1️⃣");
        await resultsMessage.react("2️⃣");
        await resultsMessage.react("3️⃣");
        await resultsMessage.react("4️⃣");
        await resultsMessage.react("5️⃣");
      //edit the resultmessage to the resultembed
        await resultsMessage.edit(resultsEmbed)
      //set the collector to true
      message.channel.activeCollector = true;
      //wait for a response
      let response;
      await resultsMessage.awaitReactions((reaction, user) => user.id == message.author.id,
      {max: 1, time: 60000, errors: ['time'],} ).then(collected => {
        //if its one of the emoji set them to 1 / 2 / 3 / 4 / 5
          if(collected.first().emoji.name == "1️⃣"){ return response = 1; }
          if(collected.first().emoji.name == "2️⃣"){ return response = 2; }
          if(collected.first().emoji.name == "3️⃣"){ return response = 3; }
          if(collected.first().emoji.name == "4️⃣"){ return response = 4; }
          if(collected.first().emoji.name == "5️⃣"){ return response = 5; }
          //otherwise set it to error
          else{
            response = "error";
          }
        });
        //if response is error return error
      if(response === "error"){
        //send error message
        attentionembed(message,"Silakan gunakan emoji yang tepat!");
        //try to delete the message
        return resultsMessage.delete().catch(console.error);
      }
      //get the field name of the response
      const choice = resultsEmbed.fields[parseInt(response) - 1].name;
      //set collector to false aka off
      message.channel.activeCollector = false;
      //play the collected song
      message.client.commands.get("play").execute(message, [choice]);
      //delete the search embed
      resultsMessage.delete().catch(console.error);
      //catch any errors while searching
    } catch (error) {
      //log them
      console.error(error);
      //set collector false, just incase its still true
      message.channel.activeCollector = false;
    }
  }
};
