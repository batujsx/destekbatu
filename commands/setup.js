const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'destek',

    execute(client, message) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send('❌');
        }

        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('#ffd100');
        setupEmbed.setTimestamp()
        setupEmbed.setThumbnail('https://images.emojiterra.com/twitter/512px/1f39f.png')
        setupEmbed.setTitle('www.ServerİP.com');
        setupEmbed.setDescription('Destek talebi oluşturmak için aşağıdaki menüden talep oluşturmak istediğin alanı seç. Batu2 botu sana özel oluşturacağı kanal üzerinden yetkililer ile anlık iletişime geçebilirsin.');
        setupEmbed.setFooter(`http://www.Serverip.com/`)

        const ticketButton = new MessageButton();

        ticketButton.setEmoji('📝');
        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('Destek');
        ticketButton.setCustomId('createTicket');

        const row = new MessageActionRow().addComponents(ticketButton);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
    },
};