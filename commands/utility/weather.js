const { SlashCommandBuilder } = require('discord.js');
const API = require('../../api/api');

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
            // const embed = new MessageEmbed()
            //     .setColor('#0099ff')
            //     .setTitle(`Weather Information for ${airportCode}`)
            //     .setDescription('Current METAR data')
            //     .addFields(
            //         { name: 'Temperature', value: `${weatherData.temperature}°C`, inline: true },
            //         { name: 'Wind Speed', value: `${weatherData.wind_speed} knots`, inline: true },
            //         { name: 'Visibility', value: `${weatherData.visibility} meters`, inline: true }
            //     )
            //     .setTimestamp()
            //     .setFooter({ text: 'Weather data provided by AviationWeather.gov' });
            // console.log('Embed prepared:', embed); // Affiche les détails de l'embed préparé
            // await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.editReply('Error fetching weather data: ' + error.message);
        }
        
        //await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};










