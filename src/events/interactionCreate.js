const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// if (!interaction.isChatInputCommand()) return;
		// if (!interaction.isAutocomplete()) return;

		// const command = interaction.client.commands.get(interaction.commandName);

		// // If command does not exists, return
		// if (!command) return;

		// try {
		// 	await command.execute(interaction);
		// }
		// catch (error) {
		// 	console.error(error);
		// 	await interaction.reply({ content: `Houve um erro ao executar este comando: ${command}`, ephemeral: true });
		// }
		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction. ${interaction.module}`);




		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			// If command does not exists, return
			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: `Houve um erro ao executar este comando: ${command}`, ephemeral: true });
			}
		}
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			// If command does not exists, return
			if (!command) return;

			try {
				await command.autocomplete(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: `Houve um erro ao executar este comando: ${command}`, ephemeral: true });
			}
		}

		





	},
};
