const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		// Message d'accueil personnalisé à envoyer en privé
		const welcomeMessage = `
		🎉 **Bienvenue sur ${member.guild.name} !** 🎉

		Salut, **${member.user.username}** ! On est super contents de t’accueillir dans notre communauté de gamers passionnés ! Ici, on partage nos meilleurs moments de jeu, on discute, on s’entraide, et on rigole ! 🎮👾

		🔥 **Ce que tu trouveras ici :**
		- **Des parties en équipe** : Que tu sois joueur solo ou fan de parties en groupe, il y a toujours quelqu’un pour jouer !
		- **Des discussions épiques** : Rejoins nos salons pour échanger des tips, découvrir de nouveaux jeux ou simplement bavarder.
		- **Événements et tournois** : Garde un œil sur les annonces, on organise régulièrement des soirées et des tournois avec des petites récompenses à la clé ! 🏆

		💬 **Avant de commencer :**
		- Pense à jeter un œil aux **règles** du serveur, pour que tout le monde puisse s’amuser dans une bonne ambiance. 😄
		- Présente-toi dans le salon **#présentations** pour qu’on puisse mieux te connaître !

		N’hésite pas à nous poser des questions si tu en as, et prépare-toi à des moments inoubliables. Encore une fois, bienvenue et… **que le jeu commence !** 🎲✨
		`;

		// Envoie du message en privé à l'utilisateur qui rejoint le serveur
		try {
			await member.send(welcomeMessage);
			console.log(`Message de bienvenue envoyé à ${member.user.tag} en privé.`);
		} catch (error) {
			console.error(`Impossible d'envoyer un message à ${member.user.tag}. Peut-être a-t-il désactivé les messages privés.`, error);
		}
	}
};

