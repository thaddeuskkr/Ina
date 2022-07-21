const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const _ = require('lodash');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current queue.'),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC', 'PLAYING',],
    async run (client, interaction, player) {
        await interaction.deferReply();
        const currentDuration = client.util.formatTime(player.queue.current.length, player.queue.current.isStream);
        const currentTime = player.shoukaku.position;
        const embeds = [];
        const finalEmbeds = [];
        const bar = player.queue.current.isStream ? '' : client.util.createProgressBar(currentTime, player.queue.current.length, 20);
        if (!player.queue?.length) {
            let loopString = '';
            if (player.loop === 'track') loopString = '\n*Looping the currently playing track*';
            else if (player.loop === 'queue') loopString = '\n*Looping the whole queue*';
            finalEmbeds.push(new EmbedBuilder()
                .setAuthor({ name: `Queue for ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ size: 4096 }) })
                .setDescription(`**__Now playing:__**\n**${player.queue.current.title}** - **${player.queue.current.author}** [${currentDuration}] (${player.queue.current.requester.toString()})\n${client.util.formatTime(currentTime)} ${bar} ${currentDuration}\n\n**No tracks in queue.**${loopString}`)
                .setColor(client.config.color));
        } else {
            let chunked = _.chunk(player.queue, client.config.tracksPerPage);
            let totalDurationMs = 0;
            for (const track of player.queue) {
                totalDurationMs += track.length;
            }
            let totalDuration = client.util.formatTime(totalDurationMs);
            if (player.queue.find(x => x.isStream === true)) totalDuration = '∞';
            let loopString = '';
            if (player.loop === 'track') loopString = '\n*Looping the currently playing track*';
            else if (player.loop === 'queue') loopString = '\n*Looping the whole queue*';
            for (let i = 0; i < chunked.length; i++) {
                let msgArr = [];
                msgArr.push(`**__Now playing:__**\n**${player.queue.current.title}** - **${player.queue.current.author}** [${currentDuration}] (${player.queue.current.requester.toString()})`);
                msgArr.push(`${client.util.formatTime(currentTime)} ${bar} ${currentDuration}\n`);
                for (let e = 0; e < chunked[i].length; e++) {
                    let track = chunked[i][e];
                    let trackDuration = client.util.formatTime(track.length, track.isStream);
                    msgArr.push(`**\`${e + 10 * i + 1}\`**: **${track.title}** [${trackDuration}] (${track.requester.toString()})`);
                }
                msgArr.push(`\n**${player.queue.length}** tracks in queue.\n**Total duration:** \`${totalDuration}\`${loopString}`);
                let text = msgArr.join('\n');
                embeds.push(text);
            }
            for (const text of embeds) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Queue for ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ size: 4096 }) })
                    .setDescription(text)
                    .setColor(client.config.color);
                finalEmbeds.push(embed);
            }
        }
        const buttons = [
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary), 
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
        ];
        client.util.pagination(interaction, finalEmbeds, buttons, undefined, client.config.footer);
    }
};