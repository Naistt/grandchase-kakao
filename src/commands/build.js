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
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('cl')
				.setDescription('CL20 ou CL25.')
				.setRequired(false)
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		// handle the autocompletion response

		// Get the 'currently writing option' value
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		// Array of possible choices
		if (focusedOption.name === 'personagem') {
			choices = ['exelesis', 'exarme', 'exlire', 'exronan', 'exmari', 'examy',
				'exlime', 'exedel', 'exjin', 'exley', 'exharpe', 'exserdin',
				'exsieghart'];
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
        // await interaction.deferReply();

		const rawHerodata = fs.readFileSync('./src/hero-library/library.json');
		const heroDataJSON = JSON.parse(rawHerodata);
		const inputHero = heroDataJSON[interaction.options.getString('personagem').toLowerCase()];


		if (inputHero === undefined || inputHero === null) {
			await interaction.reply({ content: 'Personagem ainda não adicionado à biblioteca.', ephemeral: true });
			return;
		}

		if (inputHero["enabled"] === undefined || inputHero["enabled"] === null || inputHero["enabled"] === false) {
			await interaction.reply({ content: 'Personagem desabilitado temporariamente.', ephemeral: true });
			return;
		}


        const canvas = Canvas.createCanvas(1500, 863);
		const context = canvas.getContext('2d');
		const heroBanner = inputHero["build"]["banner_id"];
		const background = await Canvas.loadImage(`./src/img/Oblivious/chars/${heroBanner}.png`);



		const setColor = await Canvas.loadImage(`./src/img/sets/set_${inputHero["build"]["sets"]}.png`);

		// This uses the canvas dimensions to stretch the image onto the entire canvas
		context.drawImage(background, 0, 0, canvas.width, canvas.height);


		// PvE set
		context.drawImage(setColor, 635, 60, 75, 75);
		// PvP set
		context.drawImage(setColor, 835, 60, 75, 75);

		// Enchantment
		context.font = '23px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText(`${inputHero["build"]["enchantment"]["white"]}`, canvas.width / 1.58, canvas.height / 4.1);
		context.fillText(`${inputHero["build"]["enchantment"]["red"]}`, canvas.width / 1.31, canvas.height / 4.1);
		context.fillText(`${inputHero["build"]["enchantment"]["blue"]}`, canvas.width / 1.12, canvas.height / 4.1);





		// Level Traits Block - 80 em 80 ou 120 em 120
		let arr = inputHero["build"]["level-traits"];
		let dx = 835;
		// console.log("ARR LENGTH: " + Object.keys(arr).length);
		for (let i = 1; i < Object.keys(arr).length + 1; i++) {
			const lvlTrait = await Canvas.loadImage(`./src/img/level traits/${arr[i]}.png`);
			
			context.drawImage(lvlTrait, dx, 280, 75, 75);
			
			// console.log(arr[i]);
			dx += 120;
		}

		// let lvlTrait = await Canvas.loadImage(`./src/img/level traits/${}.png`);
		// context.drawImage(lvlTrait, 835, 280, 75, 75);
		// context.drawImage(lvlTrait, 955, 280, 75, 75);
		// context.drawImage(lvlTrait, 1075, 280, 75, 75);
		// context.drawImage(lvlTrait, 1195, 280, 75, 75);
		// // context.fillText("CHANCE DE CRÍTICO, AUMENTO DE DANO AO IGNORAR DEFESA,", canvas.width / 1.9, canvas.height / 3.1);





		// HABILIDADE APRIMORADA
		// context.fillText("N/A", canvas.width / 1.50, canvas.height / 1.97);
		// context.fillText("N/A", canvas.width / 1.20, canvas.height / 1.97);
		// context.drawImage(ttTrait, 835, 400, 75, 75);


		// TRANSCENDANT TRAITS BLOCK
		arr = inputHero["build"]["transcend-traits"];
		dx = 1075;
		// console.log("ARR LENGTH: " + Object.keys(arr).length);
		for (let i = 1; i < Object.keys(arr).length + 1; i++) {
			const tTrait = await Canvas.loadImage(`./src/img/transcend traits/${arr[i]}.png`);
			
			context.drawImage(tTrait, dx, 510, 75, 75);
			
			// console.log(arr[i]);
			dx += 100;
		}
		// const ttTrait = await Canvas.loadImage('./src/img/transcend traits/tt_unlim_power.png');
		// context.drawImage(ttTrait, 1075, 510, 75, 75);
		// context.drawImage(ttTrait, 1175, 510, 75, 75);
		// context.drawImage(ttTrait, 1275, 510, 75, 75);
		// context.drawImage(ttTrait, 1375, 510, 75, 75);




		// ACCESSORIES PvE BLOCK
		arr = inputHero["build"]["accessories"];
		dx = 765;
		let strCorAcc = inputHero["build"]["acc-color"];
		// console.log(corAcc);
		for (let i = 1; i < Object.keys(arr).length + 1; i++) {
			let acc = await Canvas.loadImage(`./src/img/accessories/${arr[i]}.png`);
			let corAcc = await Canvas.loadImage(`./src/img/accessories/${strCorAcc}.png`);
			
			context.drawImage(corAcc, dx, 620, 75, 75);
			context.drawImage(acc, dx, 620, 75, 75);
			
			// console.log(arr[i]);
			dx += 80;
		}
		// let acc = await Canvas.loadImage('./src/img/accessories/lava.png');
		// context.drawImage(acc, 765, 620, 75, 75);
		// context.drawImage(acc, 845, 620, 75, 75);
		// context.drawImage(acc, 925, 620, 75, 75);



		// RELIC PvE BLOCK
		let relic = inputHero["build"]["relic"];
		let relicImg = await Canvas.loadImage(`./src/img/relics/${relic}.png`);
		
		context.drawImage(relicImg, 995, 620, 75, 75);





		// ACCESSORIES PvP
		arr = inputHero["build"]["accessories-pvp"];
		dx = 1175;
		strCorAcc = inputHero["build"]["acc-pvp-color"];
		// console.log("ARR LENGTH: " + Object.keys(arr).length);
		for (let i = 1; i < Object.keys(arr).length + 1; i++) {
			let acc = await Canvas.loadImage(`./src/img/accessories/${arr[i]}.png`);
			let corAcc = await Canvas.loadImage(`./src/img/accessories/${strCorAcc}.png`);
			
			context.drawImage(corAcc, dx, 620, 75, 75);
			context.drawImage(acc, dx, 620, 75, 75);
			
			// console.log(arr[i]);
			dx += 80;
		}
		// acc = await Canvas.loadImage('./src/img/accessories/lava.png');
		// context.drawImage(acc, 1175, 620, 75, 75);
		// context.drawImage(acc, 1255, 620, 75, 75);
		// context.drawImage(acc, 1335, 620, 75, 75);

		// // RELIC PvP
		relic = inputHero["build"]["relic-pvp"];
		relicImg = await Canvas.loadImage(`./src/img/relics/${relic}.png`);
		
		context.drawImage(relicImg, 1405, 620, 75, 75);



		// // CHASER TRAITS
		let cl = interaction.options.getString('cl');
		if (cl === undefined || cl === null) {
			cl = 20;
		}
		console.log(cl);
		// console.log(cl);
		arr = inputHero["build"]["chaser-traits"][`cl${cl}`];
		console.log("ARR: " + arr);
		dx = 765;
		console.log("ARR LENGTH: " + Object.keys(arr).length);
		for (let i = 1; i < Object.keys(arr).length + 1; i++) {
			const cs = await Canvas.loadImage(`./src/img/chaser traits/${arr[i]}.png`);
			
			context.drawImage(cs, dx, 740, 75, 75);
			
			// console.log(arr[i]);
			dx += 80;
		}
		// acc = await Canvas.loadImage('./src/img/chaser traits/ct_Impeto.png');
		// context.drawImage(acc, 845, 740, 75, 75);
		// context.drawImage(acc, 925, 740, 75, 75);
		// context.drawImage(acc, 1005, 740, 75, 75);
		// context.drawImage(acc, 1085, 740, 75, 75);
		






















        // Select the font size and type from one of the natively available fonts
        // context.font = '20px sans-serif';

        // Select the style that will be used to fill the text in
        // context.fillStyle = '#ffffff';

        // Actually fill the text with a solid color
        // context.fillText("Art: Resdryn#3876 / Shizu#5135", canvas.width / 1.5, canvas.height / 1.01);

		// Use the helpful Attachment class structure to process the file for you
		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        // await interaction.editReply(`@${interaction.user.tag}`);
		await interaction.reply({ files: [attachment] });
	},
};
