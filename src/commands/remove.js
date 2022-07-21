const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes a specified track from the queue.')
        .addIntegerOption(option => option
            .setName('index')
            .setDescription('Which track would you like to remove?')
            .setRequired(true)),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING', 'QUEUE'],
    async run (client, interaction, player) {
        const index = interaction.options.getInteger('index') - 1;
        const removedTrack = player.queue.splice(index, 1)[0];
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Removed' })
            .setDescription(`Removed track **${index + 1}** (**${removedTrack.title}** by **${removedTrack.author}**) from the queue.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        player.cleanup.push(interaction);
        return interaction.reply({ embeds: [embed] });
    }
    
};
