const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


// Liste des utilisateurs autorisés à valider les jeux
const VALIDATORS_USER_IDS = ['373861711368814596', '284351967688654850'];

// Chemin du fichier JSON où les jeux seront enregistrés
const filePath = path.join(__dirname, '../../jeux.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jeu')
		.setDescription("Propose un jeu à ajouter à la liste.")
		.addStringOption(option => 
            option.setName('nom')
                .setDescription("Nom du jeu à proposer")
                .setRequired(true)),

	async execute(interaction) {
        const nomJeu = interaction.options.getString('nom');
        const proposeur = interaction.user;
        console.log(`Jeu proposé par ${proposeur.username} : ${nomJeu}`);

        // Envoie une demande de validation aux utilisateurs autorisés
        VALIDATORS_USER_IDS.forEach(async (userId) => {
            try {
                const user = await interaction.client.users.fetch(userId);
                console.log(`Envoi de la demande de validation à ${user.username} (${userId})`);

                // Crée les boutons
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('approve')
                        .setLabel('👍 Approuver')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('deny')
                        .setLabel('👎 Refuser')
                        .setStyle(ButtonStyle.Danger),
                );

                // Envoie le message de demande de validation avec les boutons
                const message = await user.send({
                    content: `**${proposeur.username}** a proposé un nouveau jeu : **${nomJeu}**.\nVoulez-vous l'ajouter à la liste ?`,
                    components: [row]
                });

                // Crée un collecteur d'interactions pour écouter les clics sur les boutons
                const collector = message.createMessageComponentCollector({
                    filter: i => VALIDATORS_USER_IDS.includes(i.user.id),
                    max: 1,
                    time: 604800000 // 1 semaine
                });

                collector.on('collect', async (i) => {
                    if (i.customId === 'approve') {
                        console.log("Jeu approuvé, ajout au fichier JSON.");
                        ajouterJeuAuFichier(nomJeu);
                        await i.update({ content: `Le jeu **${nomJeu}** a été approuvé et ajouté à la liste des jeux !`, components: [] });

                        const generalChannel = interaction.guild.channels.cache.find(channel => channel.name === 'général');
                        if (generalChannel) {
                            await generalChannel.send(`🎉 Le jeu **${nomJeu}** proposé par **${proposeur.username}** a été ajouté à la liste des jeux autorisés !`);
                        }
                    
                    } else if (i.customId === 'deny') {
                        console.log("Jeu refusé.");
                        await i.update({ content: `Le jeu **${nomJeu}** a été refusé.`, components: [] });
                        await proposeur.send(`Désolé, votre proposition de jeu **${nomJeu}** a été refusée.`);
                    }
                });

            } catch (error) {
                console.error(`Erreur lors de l'envoi de la demande de validation à l'utilisateur ${userId}`, error);
            }
        });

        // Envoi du message de confirmation par le bot au proposeur
        await interaction.reply({ content: `${proposeur.username}, votre proposition de jeu a été envoyée pour validation.`, ephemeral: true });
	},
};

// Fonction pour ajouter un jeu au fichier JSON
function ajouterJeuAuFichier(nomJeu) {
    console.log("Début de l'ajout du jeu au fichier JSON...");

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error("Erreur de lecture du fichier JSON :", err);
            return;
        }

        let jeux = data ? JSON.parse(data) : [];

        // Ajoute le jeu s'il n'est pas déjà dans la liste
        if (!jeux.includes(nomJeu)) {
            jeux.push(nomJeu);

            console.log(`Jeu "${nomJeu}" ajouté. Mise à jour du fichier JSON...`);

            // Enregistre la nouvelle liste dans le fichier JSON
            fs.writeFile(filePath, JSON.stringify(jeux, null, 2), (err) => {
                if (err) {
                    console.error("Erreur lors de l'écriture dans le fichier JSON :", err);
                } else {
                    console.log(`Le jeu "${nomJeu}" a été ajouté au fichier JSON avec succès.`);
                    console.log("Fermeture de l'application...");
                    process.exit(); // Ferme le programme après l'ajout
                }
            });
        } else {
            console.log(`Le jeu "${nomJeu}" est déjà dans la liste.`);
        }
    });
}

