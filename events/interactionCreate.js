const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int) => {
    const req = int.customId.split('_')[0];
    let role = '963176004371771473'

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    switch (req) {
        case 'createTicket': {
            const selectMenu = new MessageSelectMenu();

            selectMenu.setCustomId('newTicket');
            selectMenu.setPlaceholder('Bilet için bir neden seçin');
            selectMenu.addOptions([
                {
                    emoji: '📙',
                    label: 'Sorular',
                    description: 'Bize soru sorun!',
                    value: 'newTicket'
                },
                {
                    emoji: '🙋',
                    label: 'Genel Destek',
                    description: 'Yardım istemekten çekinmeyin!',
                    value: 'newTicket_Destek'
                 }
                ]);

            const row = new MessageActionRow().addComponents(selectMenu);

            return int.reply({ content: 'Biletin konusu ne olacak?', components: [row], ephemeral: true });
        }

        case 'newTicket': {
            const reason = int.values[0].split('_')[1];

            const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

            if (!channel) {
                await int.guild.channels.create(`ticket-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    topic: `Bilet ${int.member.user.username} tarafından oluşturulmuştur. Sebep: ${reason ? ` (${reason})` : ''} ${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                        },
                        {
                            id: int.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                        },
                        {
                            id: role,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);
                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor(`Biletiniz başarıyla oluşturuldu ${int.member.user.username} ${reason ? ` (${reason})` : ''} ✅`);
                ticketEmbed.setDescription('Destek birimini kullandığınız için teşekkür ederiz. Yardımcı olmamızı istediğiniz konuyu bize iletebilir misiniz? \n \nGereksiz talep oluşturmak ve yetkili ekibine etiket spamlamak yasaktır, yetkili insiyatifine göre ceza uygulanabilir.');
                channel.send(`<@${int.member.id}> - <@&${role}>`);
                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('Bu bileti kapat');
                closeButton.setCustomId(`closeTicket_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);

                await channel.send({ embeds: [ticketEmbed], components: [row] });

                return int.update({ content: `Biletiniz oluşturuldu <@${int.member.id}> <#${channel.id}> ✅`, components: [], ephemeral: true });
            } else {
                return int.update({ content: `Aktif bir biletiniz bulunmaktadır. <#${channel.id}> ❌`, components: [], ephemeral: true });
            }
        }

        case 'closeTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    },
                    {
                        id: role,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('BLUE');
            ticketEmbed.setAuthor(`${int.member.user.username} bu bileti kapatma kararına vardı. ❌`);
            ticketEmbed.setDescription('Aşağıdaki butonlardan ne yapmak istediğinizi seçebilirsiniz. Bizimle iletişime geçtiğiniz için teşekkür ederiz, sağlıklı günler dileriz.');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('Bu bileti tekrar aktifleştir.');
            reopenButton.setCustomId(`reopenTicket_${int.customId.split('_')[1]}`);

            const saveButton = new MessageButton();

            saveButton.setStyle('SUCCESS');
            saveButton.setLabel('Bu biletin yedeğini kaydet.');
            saveButton.setCustomId(`saveTicket_${int.customId.split('_')[1]}`);

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('Bu bileti ebediyen sil.');
            deleteButton.setCustomId('deleteTicket');

            const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'reopenTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    },
                    {
                        id: role,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('GREEN');
            ticketEmbed.setAuthor(`Bilet yendien aktifleştirildi ✅`);
            ticketEmbed.setDescription('Mevcut bileti kapatmak için aşağıdaki tepkiye tıklayın, dikkat geri dönemeyeceksiniz!');

            const closeButton = new MessageButton();

            closeButton.setStyle('DANGER');
            closeButton.setLabel('Bu bileti kapat');
            closeButton.setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

            const row = new MessageActionRow().addComponents(closeButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'deleteTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            return channel.delete();
        }

        case 'saveTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.messages.fetch().then(async msg => {
                let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (bilet sahibi)' : ''}`;

                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (messages.length < 1) messages = 'Bu bilette bir konuşma gerçekleştirilmemiş. Garip';

                const ticketID = Date.now();

                const stream = await createWriteStream(`./data/${ticketID}.txt`);

                stream.once('open', () => {
                    stream.write(`Kullanıcı bileti ${int.customId.split('_')[1]} (channel #${channel.name})\n\n`);
                    stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);

                    stream.end();
                });

                stream.on('finish', () => int.reply({ files: [`./data/${ticketID}.txt`] }));
            });
        }
    }
};