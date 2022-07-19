const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the currently playing track.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC'],
    async run (client, interaction, player) {
        if (player.paused == true) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('The player is already paused. Resuming for you instead.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            await player.pause(false);
            return await interaction.reply({ embeds: [embed] }).then(x => player.cleanup.push(x));
        }
        if (!player?.queue?.current) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('There is no track currently playing.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Paused' })
            .setDescription(`Paused **${player.queue.current.title}** by **${player.queue.current.author}**.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        await player.pause(true);
        await interaction.reply({ embeds: [embed] }).then(msg => player.cleanup.push(msg));
    }
};