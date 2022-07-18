const { InteractionType, EmbedBuilder } = require('discord.js');
module.exports = async (client, interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;
    const { commandName } = interaction;
    const command = client.commands.get(commandName);
    if (!command) return;

    const me = interaction.guild.members.cache.get(client.user.id);

    const player = client.kazagumo.players.get(interaction.guild.id);

    if (client.ready !== true) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Not ready' })
            .setDescription('The bot is not ready yet. Please wait a moment and try again.')
            .setColor(client.config.errorColor)
            .setFooter(client.config.footer);
        return interaction.reply({ embeds: [embed] });
    }

    if (command.permissions.length > 0) {
        if ((command.permissions.includes('OWNER') || command.category == 'owner') && !client.config.owners.includes(interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('**You do not have sufficient permissions to run this command.**\nOnly the bot owner can use this command.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            return interaction.reply({ embeds: [embed] });
        }
        const index = command.permissions.indexOf('OWNER');
        if (index > -1) {
            command.permissions.splice(index, 1);
        }
        for (let i = 0; i < command.permissions.length; i++) {
            if (!interaction.member.permissions.has(command.permissions[i]) && !client.config.owners.includes(interaction.user.id)) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Error' })
                    .setDescription(`**You do not have sufficient permissions to run this command.**\nYou need the \`${command.permissions[i]}\` permission.`)
                    .setColor(client.config.errorColor)
                    .setFooter(client.config.footer);
                return interaction.reply({ embeds: [embed] });
            }
        }
    }
    if (command.checks?.length > 0) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Error' })
            .setColor(client.config.errorColor)
            .setFooter(client.config.footer);
        if (command.checks.includes('IN_VC') && interaction.member.voice.channelId == null) {
            embed.setDescription('You are not in a voice channel.');
            return interaction.reply({ embeds: [embed] });
        }
        if (command.checks.includes('SAME_VC') && me.voice?.channelId !== null && interaction.member.voice.channelId !== me.voice?.channelId) {
            embed.setDescription('You are not in the same voice channel as me.');
            return interaction.reply({ embeds: [embed] });
        }
        if (command.checks.includes('PLAYING') && (!player || !player?.queue?.current)) {
            embed.setDescription('There is nothing playing.');
            return interaction.reply({ embeds: [embed] });
        }
        if (command.checks.includes('QUEUE') && !player.queue.length) {
            embed.setDescription('There is nothing in the queue.');
            return interaction.reply({ embeds: [embed] });
        }
    }

    try {
        await command.run(client, interaction, player);
    } catch (err) {
        client.logger.error(`Error executing command ${commandName}: ${err.toString()}`);
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Error' })
            .setDescription(`__Error executing command **${commandName}**:__\n\`\`\`${err.toString()}\`\`\``)
            .setColor(client.config.errorColor)
            .setFooter(client.config.footer);
        if (interaction.deferred == true || interaction.replied == true) return await interaction.editReply({ embeds: [ embed ], ephemeral: true });
        await interaction.reply({ embeds: [ embed ], ephemeral: true });
    }
};