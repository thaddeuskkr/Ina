const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Wait = require('util').promisify(setTimeout);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the player.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING'],
    async run (client, interaction, player) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Stopped' })
            .setDescription('Stopped the player and cleared the queue.')
            .setColor(client.config.color)
            .setFooter(client.config.footer);
        player.commandStop = true;
        player.queue.length = 0;
        player.setLoop('none');
        player.setVolume(client.config.defaultVolume);
        player.skip();
        interaction.reply({ embeds: [embed] });
        Wait(client.config.disconnectTimeout);
        if (player.queue.length == 0 && !player.queue.current) {
            player.destroy();
        } else {
            return;
        }
    }
};