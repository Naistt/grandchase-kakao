const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('acessorio')
		.setDescription('Exibe informações sobre acessórios do jogo.')
		.addStringOption(option =>
			option.setName('nome')
				.setDescription('Nome do acessório.')
				.setRequired(true)
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('tipo')
				.setDescription('Tipo do acessório.')
				.setRequired(true)
				.setAutocomplete(true))
        .addStringOption(option =>
            option.setName('cor')
                .setDescription('Cor do acessório.')
                .setRequired(true)
                .setAutocomplete(true)),
	async autocomplete(interaction) {
		// handle the autocompletion response

		// Get the 'currently writing option' value
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		// Array of possible choices
		if (focusedOption.name === 'nome') {
			choices = ['sol', 'congelante', 'vento',
				'disciplina', 'lava', 'guardião',
				'lei', 'ventania', 'frio', 'árvore'];
		}

		if (focusedOption.name === 'tipo') {
			choices = ['anel', 'colar', 'brinco'];
		}

        if (focusedOption.name === 'cor') {
			choices = ['roxo', 'azul', 'laranja'];
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

		const rawAccData = fs.readFileSync('./src/acessorios-biblioteca/acessorios.json');
		const accDataJSON = JSON.parse(rawAccData);
		const inputAcc = accDataJSON[interaction.options.getString('tipo').toLowerCase()];
        const tipoAcc = interaction.options.getString('tipo').toLowerCase();
        const nomeAcc = interaction.options.getString('nome').toLowerCase();
        const corAcc = interaction.options.getString('cor').toLowerCase();

        const avatar = fs.readFileSync('./src/img/IconHero-Decanee-Hyper.png');
        // console.log(inputAcc);

		if (inputAcc === undefined || inputAcc === null) {
			await interaction.reply({ content: 'Acessório ainda não adicionado à biblioteca.', ephemeral: true });
			return;
		}

		if (inputAcc["enabled"] === undefined || inputAcc["enabled"] === null || inputAcc["enabled"] === 'false') {
			await interaction.reply({ content: 'Acessório desabilitado temporariamente.', ephemeral: true });
			return;
		}
		
		try {



            // await interaction.editReply("");
            // console.log(inputAcc[nomeAcc]["cor"][corAcc]);
            let arr = inputAcc[nomeAcc]["cor"][corAcc];
            // console.log(arr.length);
			console.log(Object.keys(arr).length);
			if (Object.keys(arr).length == undefined || Object.keys(arr).length < 1) {
				await interaction.editReply("Esse acessório não serve em ninguém. Caso acredite que esteja desatualizado, entre em contato com <@197514134349283328>.");
				return;
			}
			else {
				for (let i = 0; i < Object.keys(arr).length; i++) {
					// console.log(Object.values(arr));
					await interaction.editReply('Este acessório é utilizado nos personagens: ' + Object.values(arr) + (i == Object.keys(arr).length ? ', ' : "."));
				}
			}
            
		}
		catch (error) {
			console.log(`Houve um erro. Linha 96.`);
			console.log(error);
			await interaction.editReply("Houve um erro ao carregar as informações do acessório. Entre em contato com <@197514134349283328>.");
			return;
		}


        // await interaction.editReply(`@${interaction.user.tag}`);
		// await interaction.editReply("teste");
	},
};
