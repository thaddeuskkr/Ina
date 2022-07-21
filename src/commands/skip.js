const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the currently playing track.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING'],
    async run (client, interaction, player) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Skipped' })
            .setDescription(`Skipped **${player.queue.current.title}** by **${player.queue.current.author}**.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        await player.skip();
        interaction.reply({ embeds: [embed] }).then(player.cleanup.push(interaction));
    }
};
