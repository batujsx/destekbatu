const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
      name: 'uptime',

    execute(client, message) {
const setupEmbed = new MessageEmbed();

      		setupEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
          setupEmbed.setDescription(`Sophia - Hey hey ben çalışıyorum, bir problemim yok!`)
          	setupEmbed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
		  	setupEmbed.setColor(message.guild.me.displayColor)
  message.channel.send({ embeds: [setupEmbed]});
    },
};