const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Chemin du fichier JSON des jeux
const filePath = path.join(__dirname, '../../jeux.json');

// Fonction pour charger les jeux depuis le fichier JSON
function chargerJeuxDepuisJSON() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jeux = JSON.parse(data);
        console.log("Jeux chargés depuis JSON :", jeux); // Log pour vérifier le contenu chargé
        return jeux.slice(0, 25); // Limite à 25 jeux pour respecter la limite de Discord
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier JSON des jeux :", error);
        return [];
    }
}

// Charge la liste de jeux pour les choix dynamiques dans les options de commande
const jeuxVideos = chargerJeuxDepuisJSON();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sondage')
		.setDescription("Démarre un sondage pour choisir un jeu vidéo.")
        // Ajoute une option pour chaque jeu vidéo dans la liste, jusqu'à cinq jeux maximum
        .addStringOption(option =>
            option.setName('jeu_1')
                .setDescription("Choix du premier jeu")
                .addChoices(...jeuxVideos.map(jeu => ({ name: jeu, value: jeu }))))
        .addStringOption(option =>
            option.setName('jeu_2')
                .setDescription("Choix du deuxième jeu")
                .addChoices(...jeuxVideos.map(jeu => ({ name: jeu, value: jeu }))))
        .addStringOption(option =>
            option.setName('jeu_3')
                .setDescription("Choix du troisième jeu")
                .addChoices(...jeuxVideos.map(jeu => ({ name: jeu, value: jeu }))))
        .addStringOption(option =>
            option.setName('jeu_4')
                .setDescription("Choix du quatrième jeu")
                .addChoices(...jeuxVideos.map(jeu => ({ name: jeu, value: jeu }))))
        .addStringOption(option =>
            option.setName('jeu_5')
                .setDescription("Choix du cinquième jeu")
                .addChoices(...jeuxVideos.map(jeu => ({ name: jeu, value: jeu })))),

	async execute(interaction) {
        // Collecte les jeux sélectionnés
        const jeuxSelectionnes = [];
        for (let i = 1; i <= 5; i++) {
            const jeu = interaction.options.getString(`jeu_${i}`);
            if (jeu) jeuxSelectionnes.push(jeu);
        }

                // Vérifie qu'au moins 3 jeux ont été sélectionnés
        if (jeuxSelectionnes.length < 3) {
            await interaction.reply({ content: "Veuillez sélectionner au moins 3 jeux pour démarrer le sondage.", ephemeral: true });
            return;
        }

        // Crée l'embed pour afficher le sondage
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle("🎮 Votez pour notre prochain jeu à jouer ensemble ! 👾")
            .setDescription("Votez pour votre jeu préféré dans la liste ci-dessous !\nLe sondage sera ouvert pendant 24 heures.")
            .setFooter({ text: 'Sondage en temps réel - Temps restant : 24 heures' });

        // Ajoute les jeux choisis en tant que champs de l'embed
        jeuxSelectionnes.forEach((jeu, index) => {
            embed.addFields({ name: `Option ${index + 1}`, value: jeu, inline: true });
        });

        // Envoie le sondage dans le canal général
        const generalChannel = interaction.guild.channels.cache.find(channel => channel.name === 'général');
        if (!generalChannel) {
            await interaction.reply("Le canal 'général' n'a pas été trouvé.");
            return;
        }

        const pollMessage = await generalChannel.send({ embeds: [embed] });

        // Ajoute des réactions pour chaque option
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        for (let i = 0; i < jeuxSelectionnes.length; i++) {
            await pollMessage.react(reactions[i]);
        }

        await interaction.reply({ content: 'Sondage lancé dans le canal général !', ephemeral: true });

        // Suivi des votes et affichage des résultats après 24 heures
        setTimeout(async () => {
            try {
                const message = await generalChannel.messages.fetch(pollMessage.id);
                const reactionCounts = message.reactions.cache.map(reaction => reaction.count - 1); // -1 pour exclure le bot
                let resultsDescription = '';

                jeuxSelectionnes.forEach((jeu, index) => {
                    const count = reactionCounts[index] || 0;
                    resultsDescription += `${reactions[index]} ${jeu} - **${count} vote(s)**\n`;
                });

                const resultsEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("🎮 Résultats du sondage 🎮")
                    .setDescription("Voici les résultats du sondage de 24 heures :\n\n" + resultsDescription)
                    .setFooter({ text: 'Merci pour votre participation !' });

                await generalChannel.send({ embeds: [resultsEmbed] });
            } catch (error) {
                console.error("Erreur lors de la récupération des résultats du sondage :", error);
            }
        }, 24 * 60 * 60 * 1000); // 24 heures
	},
};
