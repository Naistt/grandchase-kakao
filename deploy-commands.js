const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./security.json');
const fs = require('node:fs');


const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
}
    // console.log(commands);


const rest = new REST().setToken(token);

// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
// 	.then(() => console.log('Successfully registered application commands.'))
// 	.catch(console.error);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		// Routes.applicationGuildCommands(clientId, guildId), IF YOU NEED TO RESTRICT TO A SPECIFIC GUILD (DISCORD SERVER)
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();