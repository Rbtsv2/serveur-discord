const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Chemin du fichier JSON des jeux
const filePath = path.join(__dirname, '../../jeux.json');
const rolesPath = path.join(__dirname, '../../roles.json');
const eventsFilePath = path.join(__dirname, '../../events.json');

// Fonction pour charger les jeux depuis le fichier JSON
function chargerJeuxDepuisJSON() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jeux = JSON.parse(data);
        console.log("Jeux chargés depuis JSON :", jeux);
        return jeux.slice(0, 25);
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier JSON des jeux :", error);
        return [];
    }
}

// Charger les rôles depuis le fichier roles.json

function chargerRolesDepuisJSON() {
    try {
        const data = fs.readFileSync(rolesPath, 'utf8');
        const rolesData = JSON.parse(data);
        console.log("Rôles chargés depuis JSON :", rolesData.roles);
        return rolesData.roles;
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier JSON des rôles :", error);
        return [];
    }
}

// Fonction pour ajouter ou mettre à jour un événement
function ajouterOuMettreAJourEvent(eventId, eventData) {
    let events = { events: {} };

    // Charger le fichier JSON existant s'il existe
    if (fs.existsSync(eventsFilePath)) {
        const data = fs.readFileSync(eventsFilePath, 'utf8');
        events = JSON.parse(data);
    }

    // S'assure que la structure events.events existe
    if (!events.events) {
        events.events = {};
    }

    // Ajouter ou mettre à jour l'événement dans la structure
    events.events[eventId] = {
        id: eventId,
        name: eventData.name || "Événement",
        date: eventData.date || new Date().toISOString(),
        description: eventData.description || "Pas de description",
        participants: eventData.participants || []
    };

    // Sauvegarder le fichier JSON mis à jour
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
    console.log(`L'événement avec l'ID ${eventId} a été ajouté ou mis à jour.`);
}



// Fonction pour mettre à jour les participants de l'événement
function mettreAJourParticipants(eventId, userId, action) {
    // Charger le fichier JSON existant
    let events;
    try {
        const data = fs.readFileSync(eventsFilePath, 'utf8');
        events = JSON.parse(data);
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier JSON des événements :", error);
        return;
    }

    // Vérifier si la structure events.events existe
    if (!events.events) {
        console.error("La structure 'events' est absente dans le fichier JSON.");
        return;
    }

    // Vérifier si l'événement avec l'ID existe
    const event = events.events[eventId];
    if (!event) {
        console.error(`Événement avec l'ID ${eventId} introuvable.`);
        return;
    }

    // Vérifier que 'participants' est un tableau
    if (!Array.isArray(event.participants)) {
        event.participants = [];
    }

    // Ajouter ou supprimer le participant
    if (action === 'ajouter') {
        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
            console.log(`Utilisateur ${userId} ajouté à l'événement ${eventId}.`);
        }
    } else if (action === 'supprimer') {
        event.participants = event.participants.filter(id => id !== userId);
        console.log(`Utilisateur ${userId} supprimé de l'événement ${eventId}.`);
    }

    // Mettre à jour l'événement dans la structure et sauvegarder
    events.events[eventId] = event;
    try {
        fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf8');
        console.log(`L'événement avec l'ID ${eventId} a été mis à jour.`);
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des événements dans le fichier JSON :", error);
    }
}



const rolesList = chargerRolesDepuisJSON();

// Charge la liste de jeux pour les choix dynamiques dans les options de commande
const jeuxVideos = chargerJeuxDepuisJSON();



const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const currentDay = new Date().getDate();
const defaultHour = 20; // Heure par défaut


module.exports = {
    data: new SlashCommandBuilder()
        .setName('sondage')
        .setDescription("Démarre un sondage pour choisir un jeu vidéo.")


        .addStringOption(option => {
            option.setName('role')
                .setDescription("Choisissez le rôle des membres à qui envoyer le sondage")
                .setRequired(true);
            rolesList.forEach(role => {
                option.addChoices({ name: role.name, value: role.id });
            });
            return option;
        })

        .addStringOption(option =>
            option.setName('mois')
                .setDescription("Sélectionnez le mois de l'événement")
                .setRequired(false)
                .addChoices(
                    { name: 'Janvier', value: '01' },
                    { name: 'Février', value: '02' },
                    { name: 'Mars', value: '03' },
                    { name: 'Avril', value: '04' },
                    { name: 'Mai', value: '05' },
                    { name: 'Juin', value: '06' },
                    { name: 'Juillet', value: '07' },
                    { name: 'Août', value: '08' },
                    { name: 'Septembre', value: '09' },
                    { name: 'Octobre', value: '10' },
                    { name: 'Novembre', value: '11' },
                    { name: 'Décembre', value: '12' }
                )
            )

        .addIntegerOption(option =>
            option.setName('jour')
                .setDescription("Sélectionnez le jour de l'événement (1 à 31)")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(31)
               
        )
        .addIntegerOption(option =>
            option.setName('heure')
                .setDescription("Sélectionnez l'heure de l'événement")
                .setRequired(false)
                .addChoices(
                    { name: '00:00', value: 0 },
                    { name: '01:00', value: 1 },
                    { name: '02:00', value: 2 },
                    { name: '03:00', value: 3 },
                    { name: '04:00', value: 4 },
                    { name: '05:00', value: 5 },
                    { name: '06:00', value: 6 },
                    { name: '07:00', value: 7 },
                    { name: '08:00', value: 8 },
                    { name: '09:00', value: 9 },
                    { name: '10:00', value: 10 },
                    { name: '11:00', value: 11 },
                    { name: '12:00', value: 12 },
                    { name: '13:00', value: 13 },
                    { name: '14:00', value: 14 },
                    { name: '15:00', value: 15 },
                    { name: '16:00', value: 16 },
                    { name: '17:00', value: 17 },
                    { name: '18:00', value: 18 },
                    { name: '19:00', value: 19 },
                    { name: '20:00', value: 20 },
                    { name: '21:00', value: 21 },
                    { name: '22:00', value: 22 },
                    { name: '23:00', value: 23 }
                )
            )
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

        const roleId = interaction.options.getString('role');


        const month = parseInt(interaction.options.getString('mois'), 10) || currentMonth;
        const day = interaction.options.getInteger('jour') || currentDay;
        const hour = interaction.options.getInteger('heure')|| defaultHour;
        
        // Ajuste l'année si le mois sélectionné est passé
        const eventYear = month < currentMonth ? currentYear + 1 : currentYear;
        
        // Crée la date de l'événement avec l'année, le mois, le jour et l'heure spécifiés
        const eventDate = new Date(`${eventYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00`);
        
        



        const jeuxSelectionnes = [];
        for (let i = 1; i <= 5; i++) {
            const jeu = interaction.options.getString(`jeu_${i}`);
            if (jeu) jeuxSelectionnes.push(jeu);
        }

        if (jeuxSelectionnes.length < 1) {
            await interaction.reply({ content: "Veuillez sélectionner au moins 1 jeu pour démarrer l'event.", ephemeral: true });
            return;
        }

        const eventId = `event_${Date.now()}`;
       
        ajouterOuMettreAJourEvent(eventId, {
            id: eventId,
            name: 'Session de jeu',
            date: eventDate.toISOString(),
            description: "Rejoignez-nous pour une session de jeu !",
            participants: []
        });


        const votes = jeuxSelectionnes.map(() => []);
        
        const characters = [
            '👶', '🧒', '👦', '👧', '🧑', '👱‍♂️', '👱‍♀️', '👨', '👩', '🧔', '🧔‍♂️', '🧔‍♀️',
            '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳', '👨‍🦲', '👩‍🦲', '🧑‍🦰', '🧑‍🦱', '🧑‍🦳', '🧑‍🦲',
            '👱', '👱‍♀️', '👱‍♂️', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️',
            '👷', '👷‍♂️', '👷‍♀️', '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '👰', '🤵', '🤵‍♂️',
            '🤵‍♀️', '👰‍♂️', '👰‍♀️', '🤰', '🤱', '👩‍⚕️', '👨‍⚕️', '🧑‍⚕️', '👩‍🌾', '👨‍🌾', '🧑‍🌾', '👩‍🍳',
            '👨‍🍳', '🧑‍🍳', '👩‍🎓', '👨‍🎓', '🧑‍🎓', '👩‍🎤', '👨‍🎤', '🧑‍🎤', '👩‍🏫', '👨‍🏫', '🧑‍🏫', '👩‍🏭',
            '👨‍🏭', '🧑‍🏭', '👩‍💻', '👨‍💻', '🧑‍💻', '👩‍🔧', '👨‍🔧', '🧑‍🔧', '👩‍🔬', '👨‍🔬', '🧑‍🔬', '👩‍🎨',
            '👨‍🎨', '🧑‍🎨', '👩‍🚒', '👨‍🚒', '🧑‍🚒', '👩‍✈️', '👨‍✈️', '🧑‍✈️', '👩‍🚀', '👨‍🚀', '🧑‍🚀', '👩‍⚖️',
            '👨‍⚖️', '🧑‍⚖️', '👰‍♂️', '👰‍♀️', '🤵‍♂️', '🤵‍♀️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳',
            '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍🔧', '👨‍🔧',
            '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️',
            '🧙‍♀️', '🧙‍♂️', '🧛‍♀️', '🧛‍♂️', '🧟‍♀️', '🧟‍♂️', '🧞‍♀️', '🧞‍♂️', '🧝‍♀️', '🧝‍♂️', '🧑‍⚕️', '🧑‍🌾'
        ];
        
        const userEmojis = {}; // Associe chaque utilisateur à un émoji unique

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle("** 🎮 Votez pour notre prochain jeu à jouer ensemble ! 👾** ")
            .setDescription("Cliquez sur un bouton pour voter. La liste des votants sera affichée sous chaque jeu avec un badge coloré.")
            .setFooter({ text: `Sondage en temps réel - Date de l'événement : ${eventDate.toLocaleDateString()} à ${eventDate.getHours()}h` });


        const rows = jeuxSelectionnes.map((jeu, index) => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`vote_${index}`)
                        .setLabel(`${jeu} (0)`)
                        .setStyle(ButtonStyle.Primary)
                );
        });

        // On envoi le sondage dans le canal général
        const generalChannel = interaction.guild.channels.cache.find(channel => channel.name === 'général');
        if (!generalChannel) {
            await interaction.reply("Le canal 'général' n'a pas été trouvé.");
            return;
        }

        const pollMessage = await generalChannel.send({ embeds: [embed], components: rows });
        await interaction.reply({ content: 'Sondage lancé dans le canal général !', ephemeral: true });

        const collector = pollMessage.createMessageComponentCollector({ time: 24 * 60 * 60 * 1000 });

        let voters = new Set();

        collector.on('collect', async (buttonInteraction) => {

            const userId = buttonInteraction.user.id;

            voters.add(userId);

            const member = await interaction.guild.members.fetch(userId);

            const [action, index] = buttonInteraction.customId.split('_');

            const voteIndex = parseInt(index, 10);



            // Vérifiez si l'utilisateur possède le rôle requis avant de permettre le vote
            if (!member.roles.cache.has(roleId)) {
                await buttonInteraction.reply({ content: "Vous n'avez pas la permission de voter pour ce sondage.", ephemeral: true });
                return;
            }

            if (action === 'vote') {
                const hasVotedForThisOption = votes[voteIndex].includes(userId);
            
                // Si l'utilisateur a déjà voté pour cette option, on annule son vote pour cette option spécifique
                if (hasVotedForThisOption) {
                    votes[voteIndex] = votes[voteIndex].filter(id => id !== userId);
                    rows[voteIndex].components[0].setLabel(`${jeuxSelectionnes[voteIndex]} (${votes[voteIndex].length})`);
                    
                    mettreAJourParticipants(eventId, userId, 'supprimer');

                    // Met à jour la liste des pseudos et icônes pour cette option
                    const voterNames = await Promise.all(votes[voteIndex].map(async id => {
                        const member = await interaction.guild.members.fetch(id);
                        return `${userEmojis[id]} ${member.displayName}`; // Pseudo avec émoji unique
                    }));
                    const voters = voterNames.length > 0 ? voterNames.join(', ') : "Aucun vote";
                    rows[voteIndex].components[0].setLabel(`${jeuxSelectionnes[voteIndex]} (${votes[voteIndex].length})\n${voters}`);
                    
                    await pollMessage.edit({ components: rows });
                    await buttonInteraction.deferUpdate();
                    return;
                }
            
                // Supprime le vote précédent de l'utilisateur sans affecter les autres votants pour chaque option
                for (let idx = 0; idx < votes.length; idx++) {
                    const voteList = votes[idx];
                    if (voteList.includes(userId)) {
                        votes[idx] = voteList.filter(id => id !== userId);
                        
                        // Met à jour la liste des pseudos et icônes pour chaque option sans toucher aux autres votants
                        const voterNames = await Promise.all(votes[idx].map(async id => {
                            const member = await interaction.guild.members.fetch(id);
                            return `${userEmojis[id]} ${member.displayName}`;
                        }));
                        const voters = voterNames.length > 0 ? voterNames.join(', ') : "";
                        rows[idx].components[0].setLabel(`${jeuxSelectionnes[idx]} (${votes[idx].length})\n${voters}`);
                    }
                }
            
                // Assigne un émoji unique aléatoire à l'utilisateur s'il n'en a pas déjà un
                if (!userEmojis[userId]) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    userEmojis[userId] = characters.splice(randomIndex, 1)[0] || '👤'; // Retire un émoji aléatoire
                }
            
                votes[voteIndex].push(userId);
                mettreAJourParticipants(eventId, userId, 'ajouter');
            
                // Récupère les pseudos et les formate avec émojis pour la nouvelle option de vote
                const voterNames = await Promise.all(votes[voteIndex].map(async id => {
                    const member = await interaction.guild.members.fetch(id);
                    return `${userEmojis[id]} ${member.displayName}`; // Pseudo avec émoji unique
                }));
                const voters = voterNames.length > 0 ? voterNames.join(', ') : "";
                rows[voteIndex].components[0].setLabel(`${jeuxSelectionnes[voteIndex]} (${votes[voteIndex].length})\n${voters}`);
                
                await pollMessage.edit({ components: rows });
                await buttonInteraction.deferUpdate();
            }
            


        });



    },
};
