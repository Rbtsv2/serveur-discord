// tasks/eventReminder.js

const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Chemin du fichier JSON des événements
const eventsPath = path.join(__dirname, '../events.json');

function lireEvenements() {
    try {
        const data = fs.readFileSync(eventsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur de lecture du fichier JSON :", error);
        return [];
    }
}

function lancerCronRappels(client) {
    cron.schedule('0 9 * * *', async () => { // Chaque jour à 9h00
        const now = new Date();
        const events = lireEvenements();

        events.forEach(async (event) => {
            const eventDate = new Date(`${event.eventDate}T${event.eventTime}:00`);
            const reminderTime = new Date(eventDate.getTime() - 2 * 24 * 60 * 60 * 1000);

            if (now >= reminderTime && now < eventDate) {
                for (let userId of event.voters) {
                    try {
                        const member = await client.guilds.cache.first().members.fetch(userId);
                        await member.send(`Rappel : Vous avez voté pour "${event.eventName}" prévu le ${event.eventDate} à ${event.eventTime}.`);
                    } catch (error) {
                        console.error(`Erreur lors de l'envoi du rappel à ${userId}:`, error);
                    }
                }
            }
        });
    }, {
        timezone: "Europe/Paris"
    });
}

module.exports = { lancerCronRappels };
