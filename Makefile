# Chemins vers les fichiers et variables d'environnement
NODE_BIN = /usr/bin/node
BOT_DIR = /var/www/discord/bot-discord

# Commandes Makefile
.PHONY: deploy start stop restart logs

# Commande pour exécuter deploy-commands.js
deploy:
	$(NODE_BIN) $(BOT_DIR)/deploy-commands.js

# Commande pour démarrer le bot avec PM2
start:
	pm2 start $(NODE_BIN) --name bot -- $(BOT_DIR)/index.js

run: deploy start

# Commande pour arrêter le bot avec PM2
stop:
	pm2 stop bot

# Commande pour redémarrer le bot après deploy-commands.js
restart: deploy
	pm2 restart bot

# Commande pour voir les logs du bot dans PM2
log:
	pm2 logs bot
# Commande pour voir les logs du bot dans PM2
delete:
	pm2 delete bot