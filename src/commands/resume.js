const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the currently paused track.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC'],
    async run (client, interaction, player) {
        if (player.paused === false) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('The player is not paused. Pausing for you instead.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            await player.pause(true);
            return await interaction.reply({ embeds: [embed] }).then(x => player.cleanup.push(x));
        }
        if (!player?.queue?.current) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('There is no currently playing track that is paused.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Resumed' })
            .setDescription(`Resumed **${player.queue.current.title}** by **${player.queue.current.author}**.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        await player.pause(false);
        await interaction.reply({ embeds: [embed] }).then(msg => player.cleanup.push(msg));
    }
};