const { SlashCommandBuilder } = require('discord.js');

// Liste des IDs des utilisateurs autorisés à exécuter cette commande
const ALLOWED_USER_IDS = ['373861711368814596']; // Remplacez par les IDs appropriés

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Sends a custom message to all members of the server.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send to all members')
                .setRequired(true)),

	async execute(interaction) {
        const customMessage = interaction.options.getString('message');
        const senderId = interaction.user.id;

        // Vérifie si l'utilisateur est autorisé à exécuter cette commande
        if (!ALLOWED_USER_IDS.includes(senderId)) {
            await interaction.reply({ content: "Vous n'êtes pas autorisé à utiliser cette commande.", ephemeral: true });
            return;
        }

        console.log('Custom event message:', customMessage); // Log pour vérifier le message saisi
        await interaction.deferReply({ ephemeral: true }); // Répond de manière temporaire pour informer l'utilisateur

        const guild = interaction.guild;
        if (!guild) {
            await interaction.editReply('This command can only be used within a server.');
            return;
        }

        try {
            // Récupère tous les membres du serveur
            const members = await guild.members.fetch();
            
            // Envoie un message privé à chaque membre (hors bots et l'expéditeur)
            for (const [memberId, member] of members) {
                if (!member.user.bot && memberId !== senderId) { // Ignore les bots et l'expéditeur
                    try {
                        await member.send(`📢 **Message d'événement :**\n\n${customMessage}`);
                        console.log(`Message sent to ${member.user.tag}`);
                    } catch (error) {
                        console.error(`Could not send message to ${member.user.tag}`, error);
                    }
                }
            }

            await interaction.editReply('Message sent to all members!');
        } catch (error) {
            console.error('Error sending event message:', error);
            await interaction.editReply('Error sending the message to all members.');
        }
	},
};
