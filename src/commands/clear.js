const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue of all tracks.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING', 'QUEUE'],
    async run (client, interaction, player) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Queue cleared' })
            .setDescription(`Removed **${player.queue.length}** tracks from the queue.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        await player.queue.clear();
        interaction.reply({ embeds: [embed], fetchReply: true }).then(msg => player.cleanup.push(msg));
    }
};