////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { play } = require("../include/play");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
const ytsr = require("youtube-sr")

////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Memutar lagu dari YouTube/Stream",
  cooldown: 1.5,
  edesc: `Ketik perintah ini untuk memutar musik.\nPenggunaan: ${PREFIX}play <TITLE | URL>`,
  
async execute(message, args, client) {
    //If not in a guild return
    if (!message.guild) return;
    //define channel
    const { channel } = message.member.voice;
    //get serverqueue
    const serverQueue = message.client.queue.get(message.guild.id);
    //If not in a channel return error
    if (!channel) return attentionembed(message, "Silakan bergabung dengan Saluran Suara terlebih dahulu");
    //If not in the same channel return error
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return attentionembed(message, `Anda harus berada di Saluran Suara yang sama dengan saya`);
    //If no args return
    if (!args.length)
      return attentionembed(message, `Pakai: ${message.client.prefix}play <LINK YouTube | Nama Vidio | LINK Soundcloud >`);
    //react with approve emoji
    message.react("✅").catch(console.error);
    //get permissions and send error if bot doesnt have enough
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return attentionembed(message, "Saya perlu izin untuk bergabung dengan saluran Anda!");
    if (!permissions.has("SPEAK"))
      return attentionembed(message, "Saya perlu izin untuk berbicara di saluran Anda");

    //define some url patterns
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const urlValid = videoPattern.test(args[0]);

    //define Queue Construct
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 69,
      filters: [],
      realseek: 0,
      playing: true
    };
    //get song infos to null
    let songInfo = null;
    let song = null;
    //try catch for errors
    try {
      //If something is playing
      if (serverQueue) {
        //if its an url
        if (urlValid) { //send searching link
          message.channel.send(new MessageEmbed().setColor("#1c00c2")
            .setDescription(`**💢 Mencari 🔍 [\`LINK\`](${args.join(" ")})**`))
        //if not
        }
        else { //send searching TITLE
          message.channel.send(new MessageEmbed().setColor("#1c00c2")
            .setDescription(`**💢 Mencari 🔍 \`${args.join(" ")}\`**`))
        }
      } else {
        //If nothing is playing join the channel
        queueConstruct.connection = await channel.join();
        //send join message
        message.channel.send(new MessageEmbed().setColor("#1ace00")
          .setDescription(`**👍 Bergabung Ke Channel \`${channel.name}\`**`)
          .setFooter(`By: ${message.author.username}#${message.author.discriminator}`))
        //if its an url
        if (urlValid) { //send searching link
          message.channel.send(new MessageEmbed().setColor("#1c00c2")
            .setDescription(`**💢 Mencari 🔍 [\`LINK\`](${args.join(" ")})**`))
          //if not 
        }
        else { //send searching TITLE
          message.channel.send(new MessageEmbed().setColor("#1c00c2")
            .setDescription(`**💢 Mencari 🔍 \`${args.join(" ")}\`**`))
        }
        //Set selfdeaf and serverdeaf true
        queueConstruct.connection.voice.setSelfDeaf(true);
        queueConstruct.connection.voice.setDeaf(true);
      }
    }
    catch {
    }
    //if its a valdi youtube link
    if (urlValid) {
      try {
        songInfo = await ytsr.searchOne(search) ;
        song = {
          title: songInfo.title,
          url: songInfo.url,
          thumbnail: songInfo.thumbnail,
          duration: songInfo.durationFormatted,
       };
      } catch (error) {
        if (error.statusCode === 403) return attentionembed(message, "Maks. penggunaan api Key, harap segarkan!");
        console.error(error);
        return attentionembed(message, error.message);
      }
    } 
    //else try to find the song via ytsr 
    else {
      try {
       //get the result 
        songInfo = await ytsr.searchOne(search) ;
        song = {
          title: songInfo.title,
          url: songInfo.url,
          thumbnail: songInfo.thumbnail,
          duration: songInfo.durationFormatted,
       };
      } catch (error) {
        console.error(error);
        return attentionembed(message, error);        
      }                                                               
    }
    //get the thumbnail
    let thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png"
    if (song.thumbnail === undefined) thumb = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.designtrends.com%2Fwp-content%2Fuploads%2F2016%2F04%2F06131325%2FSnoopy-Playing-Music-Image.jpg&f=1&nofb=1";
    else thumb = song.thumbnail.url;
    //if there is a server queue send that message!
    if (serverQueue) {
      //Calculate the estimated Time
      let estimatedtime = Number(0);
      for (let i = 0; i < serverQueue.songs.length; i++) {
        let minutes = serverQueue.songs[i].duration.split(":")[0];   
        let seconds = serverQueue.songs[i].duration.split(":")[1];    
        estimatedtime += (Number(minutes)*60+Number(seconds));   
      }
      if (estimatedtime > 60) {
        estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
        estimatedtime = estimatedtime + " Menit"
      }
      else if (estimatedtime > 60) {
        estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
        estimatedtime = estimatedtime + " Jam"
      }
      else {
        estimatedtime = estimatedtime + " Detik"
      }
      //Push the ServerQueue
      serverQueue.songs.push(song);
      //the new song embed
      const newsong = new MessageEmbed()
        .setTitle("✅ " + song.title)
        .setColor("#1c00c2")
        .setThumbnail(thumb)
        .setURL(song.url)
        .setDescription(`\`\`\`Telah ditambahkan ke Antrian.\`\`\``)
        .addField("Perkiraan waktu sampai bermain:", `\`${estimatedtime}\``, true)
        .addField("Posisi dalam Antrean", `**\`${serverQueue.songs.length - 1}\`**`, true)
        .setFooter(`Request dari: ${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      //send the Embed into the Queue Channel
        return serverQueue.textChannel
        .send(newsong)
        .catch(console.error);
      
    }
    //push the song list by 1 to add it to the queu
    queueConstruct.songs.push(song);
    //set the queue
    message.client.queue.set(message.guild.id, queueConstruct);
    //playing with catching errors
    try {
    
      //try to play the song
      play(queueConstruct.songs[0], message, client);
    } catch (error) {
      //if an error comes log
      console.error(error);
      //delete the Queue
      message.client.queue.delete(message.guild.id);
      //leave the channel
      await channel.leave();
      //sent an error message
      return attentionembed(message, `Tidak dapat bergabung dengan saluran: ${error}`);
    }
  }
};