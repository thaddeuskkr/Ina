module.exports = {
    token: '' || process.env.TOKEN,
    database_url: '' || process.env.KEYV,
    lavalink_nodes: [
        {
            name: '' || process.env.LAVALINK_NAME,
            url: '' || process.env.LAVALINK_URL,
            auth: '' || process.env.LAVALINK_AUTH,
            secure: false
        }        
    ],
    spotify: {
        clientId: '' || process.env.SPOTIFY_CLIENT_ID,
        clientSecret: '' || process.env.SPOTIFY_CLIENT_SECRET,
        searchMarket: '' || process.env.SPOTIFY_SEARCH_MARKET
    },
    // Stuff that you can't use a .env file for
    owners: ['275830234262142978'],
    defaultSearchEngine: 'youtube_music', // The default search engine that Lavalink uses to search
    defaultVolume: 100, // The default volume that Lavalink uses 
    url: 'https://inabot.tk', // The URL in the url fields of a lot of embeds. (Usually for author URL - but currently unused)
    color: '#af69ed', // The color of most embeds.
    errorColor: '#ad0000', // The color of error embeds.
    footer: { text: 'Ina, by thaddeuskkr • inabot.tk • v{version}', iconURL: '{avatar}' }, // The default footer used for embeds.
    disconnectTimeout: 300000, // An amount of time before the bot disconnects from the voice channel if there are no more tracks in queue. (In milliseconds)
    presence: {
        status: 'idle', // The status of the bot. - online, idle, dnd, invisible
        activities: [
            {
                name: 'music', // The name of the activity.
                type: 'LISTENING', // The type of the activity.
                url: 'https://inabot.tk' // The URL of the activity (if applicable).
            }
        ]
    }
};