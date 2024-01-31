const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Exibe informações sobre a build de um personagem específico.')
		.addStringOption(option =>
			option.setName('personagem')
				.setDescription('Personagem a ter sua build consultada.')
				.setRequired(true)
				.setAutocomplete(true)),
		// .addStringOption(option =>
		// 	option.setName('cl')
		// 		.setDescription('CL20 ou CL25.')
		// 		.setRequired(false)
		// 		.setAutocomplete(true)),
	async autocomplete(interaction) {
		// handle the autocompletion response

		// Get the 'currently writing option' value
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		// Array of possible choices
		if (focusedOption.name === 'personagem') {
			choices = ['elesis', 'mari', 'lapis', 'ronan', 'serdin',
				'lire', 'harpe', 'lass', 'jin', 'rin',
				'rufus', 'calisto', 'arme', 'zero', 'io',
				'cindy', 'sieghart', 'asin', 'ley', 'kanavan',
				'lime', 'ragna', 'tia', 'veigas', 'hwarin',
				'europa', 'werner', 'myst', 'amy', 'edel',
				'nellia', 'grandiel', 'ryan', 'dio', 'ganimede',
				'decane', 'sol',
				'exelesis', 'exarme', 'exlire', 'exronan', 'exmari', 'examy',
				'exlime', 'exedel', 'exjin', 'exley', 'exharpe', 'exserdin',
				'exsieghart', 'exio', 'exlass'];
		}

		if (focusedOption.name === 'cl') {
			choices = ['cl20', 'cl25'];
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
		// eslint-disable-next-line no-constant-condition
		if (true) {
			await interaction.reply({ content: 'Desabilitado temporariamente.', ephemeral: true });
			return;
		}
		
        await interaction.deferReply();

		const rawHerodata = fs.readFileSync('./src/hero-library/library.json');
		const heroDataJSON = JSON.parse(rawHerodata);
		const inputHero = heroDataJSON[interaction.options.getString('personagem').toLowerCase()];


		if (inputHero === undefined || inputHero === null) {
			await interaction.reply({ content: 'Personagem ainda não adicionado à biblioteca.', ephemeral: true });
			return;
		}

		if (inputHero["enabled"] === undefined || inputHero["enabled"] === null || inputHero["enabled"] === 'false') {
			await interaction.reply({ content: 'Personagem desabilitado temporariamente.', ephemeral: true });
			return;
		}


        const canvas = Canvas.createCanvas(1500, 863);
		const context = canvas.getContext('2d');
		const heroBanner = inputHero["build"]["banner_id"];
		
		try {
			const background = await Canvas.loadImage(`./src/img/new/Greatkounatexplosion.png`);
            const blackOpacity = await Canvas.loadImage(`./src/img/new/rectangle_50_opacity.png`);
			context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.drawImage(blackOpacity, 0, 0, canvas.width, canvas.height);

            const char = await Canvas.loadImage(`./src/img/new/elesis.png`);
            const shadow = await Canvas.loadImage(`./src/img/new/elesis_shadow.png`);
            context.drawImage(shadow, -200, 0, canvas.width, canvas.height);
            context.drawImage(char, -200, 0, canvas.width, canvas.height);


            // Select the font size and type from one of the natively available fonts
            context.font = '40px Gill Sans sans-serif';

            // Select the style that will be used to fill the text in
            context.fillStyle = '#ffffff';

            // Actually fill the text with a solid color
            context.fillText("SET", canvas.width / 2.5, canvas.height / 6);
			context.fillText("ENCANT. MISTICO", canvas.width / 2.5, canvas.height / 4);
			context.fillText("ESPECIALIZACAO", canvas.width / 2.5, canvas.height / 3);
			context.fillText("HAB. APRIMORADA", canvas.width / 2.5, canvas.height / 2.4);
			context.fillText("ESP. TRAN.", canvas.width / 2.5, canvas.height / 2);
			context.fillText("ACESSORIOS", canvas.width / 2.5, canvas.height / 1.7);
			context.fillText("CHASER SKILL", canvas.width / 2.5, canvas.height / 1.5);
            
		}
		catch (error) {
			console.log(`Plano de fundo não foi carregado pelo Canva. Linha 99.`);
			console.log(error);
			await interaction.editReply("Houve um erro ao carregar as informações do personagem. Entre em contato com <@197514134349283328>.");
			return;
		}
		


		
		






















        // Select the font size and type from one of the natively available fonts
        // context.font = '20px sans-serif';

        // Select the style that will be used to fill the text in
        // context.fillStyle = '#ffffff';

        // Actually fill the text with a solid color
        // context.fillText("Art: Resdryn#3876 / Shizu#5135", canvas.width / 1.5, canvas.height / 1.01);

		// Use the helpful Attachment class structure to process the file for you
		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        // await interaction.editReply(`@${interaction.user.tag}`);
		await interaction.editReply({ files: [attachment] });
	},
};
