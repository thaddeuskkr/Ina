const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING', 'QUEUE'],
    async run (client, interaction, player) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Shuffled' })
            .setDescription(`Shuffled **${player.queue.length}** tracks.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        await player.queue.shuffle();
        interaction.reply({ embeds: [embed], fetchReply: true }).then(msg => player.cleanup.push(msg));
    }
};