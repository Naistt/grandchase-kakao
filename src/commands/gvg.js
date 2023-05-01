const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gvg')
		.setDescription('Envia um ping para os membros da guilda que há um GvG em andamento.'),
	async execute(interaction) {
        await interaction.deferReply();
        
        const canvas = Canvas.createCanvas(1024, 710);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('./src/img/Oblivious/gvg.png');

		// This uses the canvas dimensions to stretch the image onto the entire canvas
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Select the font size and type from one of the natively available fonts
        context.font = '20px sans-serif';

        // Select the style that will be used to fill the text in
        context.fillStyle = '#ffffff';

        // Actually fill the text with a solid color
        context.fillText("Credits: Resdryn#3876 / Shizu#5135", canvas.width / 1.5, canvas.height / 1.01);

		// Use the helpful Attachment class structure to process the file for you
		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        await interaction.editReply(`<@&889239497236181062>`);
		await interaction.followUp({ files: [attachment] });
	},
};
