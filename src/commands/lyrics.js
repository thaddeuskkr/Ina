const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const lyricsSearcher = require('lyrics-searcher');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Searches for lyrics and displays them. If no args are specified, returns the currently playing song.')
        .addStringOption(option => option
            .setName('query-title')
            .setDescription('What song\'s lyrics would you like to search for?')
            .setRequired(false))
        .addStringOption(option => option
            .setName('query-artist')
            .setDescription('Who wrote the song that you are searching for?')
            .setRequired(false)),
    permissions: [],
    checks: ['IN_VC', 'SAME_VC'],
    async run (client, interaction, player) {
        let title = interaction.options.getString('query-title');
        let artist = interaction.options.getString('query-artist');
        if ((title && !artist) || (!title && artist)) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('You must specify both a song title and an artist.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!title && !artist && !player?.playing) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Error' })
                .setDescription('You did not provide a search query, and there is nothing playing.')
                .setColor(client.config.errorColor)
                .setFooter(client.config.footer);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!title && !artist && player.playing) {
            title = player.queue.current.title;
            artist = player.queue.current.author;
        }

        lyricsSearcher(artist, title)
            .then(lyrics => {
                const lyricPages = splitLyrics(lyrics);
                const pages = [];
                for (const page of lyricPages) {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Lyrics - ${title} by ${artist}` })
                        .setDescription(page)
                        .setFooter(client.config.footer)
                        .setColor(client.config.color);
                    pages.push(embed);
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
                client.util.pagination(interaction, pages, buttons, 600000, client.config.footer.text);
            })
            .catch(error => {
                client.logger.warn(`Failed to get lyrics: ${title} - ${artist} | ${error.toString()}`);
                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Error' })
                    .setDescription('Failed to get lyrics.\n`' + error.toString() + '`')
                    .setColor(client.config.errorColor)
                    .setFooter(client.config.footer);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            });
        
        function splitLyrics (lyrics) {
            const maxCharsInAPage = 2000;
            const lineArray = lyrics.split('\n');
            const pages = [];
            for (let i = 0; i < lineArray.length; i++) {
                let page = '';
                while (lineArray[i].length + page.length < maxCharsInAPage) {
                    page += `${lineArray[i]}\n`;
                    i++;
                    if (i >= lineArray.length) break;
                }
                pages.push(page);
            }
            return pages;
        }
    }
};