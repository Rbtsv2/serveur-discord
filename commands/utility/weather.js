const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const API = require('../../api/api');
const { translateCloudCover, getOrdinalSuffix } = require('../../utils/metarUtils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Provides information about the meteo depend oaci.')
        .addStringOption(option =>
            option.setName('oaci')
                .setDescription('The OACI code of the airport')
                .setRequired(true)),

	async execute(interaction) {
        const airportCode = interaction.options.getString('oaci');
        console.log('Airport code:', airportCode); // Affiche le code de l'aéroport reçu
        const api = new API();

        await interaction.deferReply();
        try {
            const weatherData = await api.getMetarData(airportCode);
            console.log('Weather data received:', weatherData); // Affiche les données météorologiques reçues
            
            const cloudsDescription = weatherData.clouds.map((cloud, index) => {
                const cover = translateCloudCover(cloud.cover);
                const base = cloud.base ? `${cloud.base} feet` : 'Unknown base';
                const layer = getOrdinalSuffix(index + 1);
                return `${layer} couche nuageuse ${cover} à ${base}`;
            }).join('\n');   
            
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Weather Information for ${weatherData.name}`)
                .setDescription(`Données METAR actuelles ${airportCode}`)
                .addFields(

                    { name: 'METAR', value: `\`${weatherData.rawOb !== null ? weatherData.rawOb : 'N/A'}\``, inline: false },
                    { name: 'Température', value: `${weatherData.temp !== null ? weatherData.temp.toFixed(1) : 'N/A'}°C`, inline: true },
                    { name: 'Vitesse du vent', value: `${weatherData.wspd !== null ? weatherData.wspd : 'N/A'} knots`, inline: true },
                    { name: 'Direction du vent', value: `${weatherData.wdir !== null ? weatherData.wdir : 'N/A'}°`, inline: true },
                    { name: 'Visibilité', value: `${weatherData.visib !== null ? weatherData.visib : 'N/A'} miles`, inline: true },
                    { name: 'Point de rosée', value: `${weatherData.dewp !== null ? weatherData.dewp.toFixed(1) : 'N/A'}°C`, inline: true },
                    { name: 'Pression au niveau de la mer', value: `${weatherData.slp !== null ? weatherData.slp.toFixed(1) : 'N/A'} hPa`, inline: true },
                    { name: 'Pression (Altimètre)', value: `${weatherData.altim !== null ? weatherData.altim.toFixed(2) : 'N/A'} hPa`, inline: true },
                    { name: 'Nuages', value: cloudsDescription || 'N/A', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Weather data provided by AviationWeather.gov' });
            console.log('Embed prepared:', embed); // Affiche les détails de l'embed préparé
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.editReply('Error fetching weather data: ' + error.message);
        }
        
        //await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};










