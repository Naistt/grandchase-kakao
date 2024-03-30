const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reliquia')
		.setDescription('Exibe informações sobre relíquias do jogo.')
		.addStringOption(option =>
			option.setName('nome')
				.setDescription('Nome da relíquia.')
				.setRequired(true)
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('tipo')
				.setDescription('Tipo do herói.')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		// handle the autocompletion response

		// Get the 'currently writing option' value
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		// Array of possible choices
		if (focusedOption.name === 'nome') {
			choices = ['flamejante', 'congelante', 'amaldiçoada'];
		}

		if (focusedOption.name === 'tipo') {
			choices = ['guardião', 'guerreiro', 'mago', 'atirador', 'sacerdote'];
		}

		// filters the array of possible choices with starting value
		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		// console.log(filtered);

		// Discord has a limited showing options of 25 at a time by default,
		// so I sliced from 0 to 25 while user hasn't type anything yet.
		// The choices will update as the user provides inputs.
		if (filtered.length > 25) {
			// console.log("true");
			choices = filtered.slice(0, 25);
			// sconsole.log(choices);
		}
		else {
			choices = filtered;
		}

		// Actually shows the user some choices based on their inputs.
		try {
			await interaction.respond(
				choices.map(choice => ({ name: choice, value: choice })),
			);
		}
		catch (error) {
			console.error(error);
			return;
		}
		
		
	},			
	async execute(interaction) {
        await interaction.deferReply();

		const rawAccData = fs.readFileSync('./src/equipamentos/reliquias.json');
		const relicDataJSON = JSON.parse(rawAccData);
		const inputRelic = relicDataJSON[interaction.options.getString('nome').toLowerCase()];
        const tipoRelic = interaction.options.getString('tipo').toLowerCase();
        const nomeRelic = interaction.options.getString('nome').toLowerCase();

		if (inputRelic === undefined || inputRelic === null) {
			await interaction.editReply({ content: 'Relíquia ainda não adicionada à biblioteca.', ephemeral: true });
			return;
		}

		if (inputRelic["enabled"] === undefined || inputRelic["enabled"] === null || inputRelic["enabled"] === 'false') {
			console.log(123);
			await interaction.editReply({ content: 'Relíquia desabilitada temporariamente.', ephemeral: true });
			return;
		}
		
		try {

            const arr = inputRelic[tipoRelic];

			if (Object.keys(arr).length == undefined || Object.keys(arr).length < 1) {
				await interaction.editReply("Essa relíquia não serve em ninguém. Caso acredite que esteja desatualizado, entre em contato com <@197514134349283328>.");
				return;
			}
			else {
				let personagens = "";
				for (let i = 0; i <= Object.keys(arr).length - 1; i++) {
					// console.log(Object.values(arr)[i] + (i == Object.keys(arr).length - 1 ? '.' : ', '));

					personagens += Object.values(arr)[i] + (i == Object.keys(arr).length - 1 ? '.' : ', ');
				}
				await interaction.editReply('Essa relíquia é utilizada nos personagens: ' + personagens);
			}
            
		}
		catch (error) {
			console.log(`Houve um erro. Linha 103.`);
			console.log(error);
			await interaction.editReply("Houve um erro ao carregar as informações da relíquia. Entre em contato com <@197514134349283328>.");
			return;
		}


        // await interaction.editReply(`@${interaction.user.tag}`);
		// await interaction.editReply("teste");
	},
};
