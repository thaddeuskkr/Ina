const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Changes the player volume. If no arguments provided, shows you the current volume.')
        .addIntegerOption(option => option
            .setName('volume')
            .setDescription('What would you like to set the new volume to?')
            .setRequired(false)),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING'],
    async run (client, interaction, player) {
        const volume = interaction.options.getInteger('volume');
        const oldVolume = player.filters.volume * 100;
        if (!volume) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Volume' })
                .setDescription(`The volume is currently set to **${oldVolume}%**.`)
                .setColor(client.config.color)
                .setFooter(client.config.footer);
            player.cleanup.push(interaction);
            return await interaction.reply({ embeds: [embed] });
        }
        if (!inRange(volume, 0, 200)) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('The volume must be between 0% and 200%.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        player.setVolume(volume / 100);
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Volume' })
            .setDescription(`The volume has been changed from **${oldVolume}%** to **${volume}%**.`)
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        player.cleanup.push(interaction);
        return await interaction.reply({ embeds: [embed] });
        function inRange(x, min, max) {
            return (x - min) * ( x - max) <= 0;
        }
    }
    
};