const { Events } = require('discord.js');

// Tableau contenant les IDs des utilisateurs à informer
const ADMIN_USER_IDS = ['373861711368814596'];

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		try {
			const guild = member.guild;

			// Récupérer les logs d’audit pour trouver l'inviteur
			const fetchedLogs = await guild.fetchAuditLogs({
				type: 40, // Code numérique pour INVITE_CREATE
				limit: 1
			});
			const inviteLog = fetchedLogs.entries.first();
			let inviterName;

			if (inviteLog) {
				const inviter = inviteLog.executor;
				inviterName = inviter.tag;
			} else {
				inviterName = "inconnu";
			}

			// Message dans le salon général
			const generalChannel = guild.channels.cache.find(channel => channel.name === 'général'); // Remplacez 'général' par le nom exact du salon
			if (generalChannel) {
				await generalChannel.send(`🎉 ${member.user.tag} a rejoint le serveur, invité par ${inviterName} !`);
			} else {
				console.warn("Aucun salon nommé 'général' n'a été trouvé.");
			}

			// Envoyer un message privé à chaque utilisateur dans le tableau ADMIN_USER_IDS
			for (const userId of ADMIN_USER_IDS) {
				try {
					const user = await guild.members.fetch(userId);
					if (user) {
						await user.send(`🔔 Nouveau membre : ${member.user.tag} a rejoint le serveur, invité par ${inviterName}.`);
					} else {
						console.warn(`Utilisateur avec l'ID ${userId} non trouvé.`);
					}
				} catch (error) {
					console.error(`Erreur lors de l'envoi du message à l'utilisateur avec l'ID ${userId}:`, error);
				}
			}

		} catch (error) {
			console.error("Erreur lors de la récupération des logs d'audit :", error);
		}
	}
};
