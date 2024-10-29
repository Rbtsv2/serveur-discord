const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Affiche la liste des commandes du bot"),
        
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle("Commandes disponibles")
            .setDescription("Voici la liste des commandes que vous pouvez utiliser avec ce bot :\n\n" +
                            "**/sondage** - Démarre un sondage pour choisir un jeu vidéo.\n" +
                            "**/help** - Affiche la liste des commandes disponibles.\n" +
                            "**/statistiques** - Affiche des statistiques sur le serveur.\n" +
                            "**/info** - Affiche les informations sur un utilisateur.\n\n" +
                            "*Tapez `/nom_de_commande` pour utiliser une commande.*")
            .setFooter({ text: 'Bot de gestion de serveur - Commandes de base' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};