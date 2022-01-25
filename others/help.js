const { Client, Collection, MessageEmbed } = require(`discord.js`);
const { 
  PREFIX, 
} = require(`../config.json`);

module.exports = {
  name: `help`,
  description: `Memberi Anda daftar semua Commands.`,
  aliases: ["h","commands"],
  cooldown: 3,
  edesc: "Ketik **help** untuk mendapatkan pratinjau singkat dari semua Commands, Ketik help <COMMANDNAME> untuk mendapatkan informasi tambahan tentang Command yang satu ini!",
  execute(message,args,client) {
     
    let commands = message.client.commands.array();
 
    let helpEmbed = new MessageEmbed()
      .setTitle("Collective World-v1 Help")
      .setDescription(`**Version:** \`v3.0\` \n**PREFIX:** \`${PREFIX}\``)
      .setFooter( client.user.username +`Type: ${PREFIX}help <Command>  Untuk informasi lainnya.\nCrated by yannJg.`)
      .setColor("#RANDOM");

      let ifargstruedothis = -1;
      
      switch(args[0]){
          case "filter":
           ifargstruedothis=0;
          break;
          case "loop":
            ifargstruedothis=1;
          break;
          case "lyrics":
            ifargstruedothis=2
          break;
          case "nowplaying":
            ifargstruedothis=3
          break;
          case "pause":
            ifargstruedothis=4
          break;
          case "play":
            ifargstruedothis=5
          break;
          case "playlist":
            ifargstruedothis=6
          break;
          case "queue":
            ifargstruedothis=7
          break;
          case "radio":
            ifargstruedothis=8
          break;
          case "remove":
            ifargstruedothis=9
          break;
          case "resume":
            ifargstruedothis=10
          break;
          case "search":
            ifargstruedothis=11
          break;
          case "shuffle":
            ifargstruedothis=12
          break;
          case "skip":
            ifargstruedothis=13
          break;
          case "skipto":
            ifargstruedothis=14
          break;
          case "stop":
            ifargstruedothis=15
          break;
          case "volume":
            ifargstruedothis=16
          break;
          case "help":
            ifargstruedothis=17
          break;
          default:        
            commands.forEach((cmd) => {
              helpEmbed.addField(
                `**${message.client.prefix}${cmd.name}**`,
                `${cmd.description}`,
                true
              );
            });
          if(!message.guild) {
            if(!args[0]) {message.react("✅");return message.author.send(helpEmbed);}
            return
            }
            message.react("✅");
            message.author.send(new MessageEmbed().setColor("#000035")
            .setDescription(`**👍 Dikirim Dari<#${message.channel.id}>**`))
            message.author.send(helpEmbed)
            message.channel.send( new MessageEmbed().setColor("#000035")
            .setDescription(`**👍 ${message.author} Cek  \`DM\` kamu untuk melihat daftar Commands!**`)
            );
           
        break;
       }
     
       if(ifargstruedothis>=0){
         let aliases = commands[ifargstruedothis].aliases;
         if(aliases === undefined || !aliases) aliases="No Aliases!";
         let cooldown = commands[ifargstruedothis].cooldown;
         if(cooldown === undefined || !cooldown) cooldown="Tidak Cooldown!";


        helpEmbed.addField(
          `**${message.client.prefix}${commands[ifargstruedothis].name}**`,
          `\`\`\`fix\n${commands[ifargstruedothis].edesc}\n\`\`\`\n\`${commands[ifargstruedothis].description}\``
        );
        helpEmbed.addField(
          `**:notes: Aliases:**`,
          `\`${aliases}\``
        );
        helpEmbed.addField(
          `**:wrench: Cooldown:**`,
          `\`${cooldown}\``
        );
        if(!message.guild) return message.author.send(helpEmbed);
          message.author.send(helpEmbed)
          message.channel.send( new MessageEmbed().setColor("#c219d8")
          .setDescription(`**👍 ${message.author} Cek  \`DM\` kamu untuk melihat daftar Commands!**`)
          );
       }

}
} 
