const { Events } = require('discord.js');

// Tableau de gros mots à surveiller
const grosMots = [
    'imbécile', 'con', 'abruti', 'pute', 'connard',
    'enculé', 'foutre', 'taré', 'enfoiré', 'batard', 'bouffon',
    'goujat', 'ordure','trou du cul', 'salopard',
    'fils de pute', 'connasse', 'niquer', 'lèche-cul', 'pédale',
    'clochard', 'pétasse', 'casse-toi', 'va te faire', 'ta gueule', 'ferme la',
    'nique', 'ta gueule', 'fumier', 'baltringue',
    'morue', 'cagole', 'tapette', 'tocard', 'connard de base', 'merdeux', 'pisseux', 'pouffiasse',
    'pleurnicheur', 'alcoolo', 'cul-terreux', 'grosse vache', 'glandeur',
    'truffe', 'sous-merde', 'vaut rien', 'gros naze', 'péteux', 'cancre', 'bas du front',
    'raclure', 'mou du bulbe', 'balourd', 'bordel de merde', 'bande de cons',
    'minable', 'raté', 'tête de noeud', 'gros blaireau', 'pourriture',
    'face de pet', 'chieur', 'âne bâté', 'trouduc', 'peau de vache'
];

// Réponse pour "Qui est Allan ?"
const allanQuestion = "qui est preda";
const rbtsQuestion =  "qui est rbts"

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

		console.log("Événement `messageCreate` capturé"); // Vérification d'exécution
		console.log(`Message reçu : ${message.content}`); // Log pour vérifier le contenu des messages

		// Vérifiez si l'auteur n'est pas le bot pour éviter les boucles
		if (message.author.bot) return;

		// Convertir le message en minuscules pour faciliter la comparaison
		const messageContent = message.content.toLowerCase();

		// Réponse spécifique à "Qui est Allan ?"
		if (messageContent.includes(allanQuestion)) {
			await message.reply("Preda est un grand dieu vénéré du serveur, il a conçu ce serveur et veille sur lui avec bienveillance ! 🙌✨");
			return;
		}

        if (messageContent.includes(rbtsQuestion)) {
			await message.reply("Rbts est le créateur de ce bot et l'esclave invétéré de Preda, le sous-fifre des jeux, l'incompétent qui ne range pas ses caisses ! 😆");
			return;
		}


		// Vérifiez si le message contient un gros mot
		const motInterdit = grosMots.find(mot => messageContent.includes(mot));

		// Si un mot interdit est détecté, le bot répond avec le nom de l'utilisateur
		if (motInterdit) {
			await message.reply(`${message.author.username}, ce n'est pas bien de dire des gros mots comme "${motInterdit}" ! 🚫`);
		}
	},
};
