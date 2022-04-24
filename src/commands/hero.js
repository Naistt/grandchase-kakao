const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// const base = require("path").resolve(".");
const fs = require('fs');
const message = require('../events/message');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("hero")
		.setDescription("Replies with SR heroes data.")
		.addStringOption(option =>
			option.setName("hero-name")
				.setDescription("The hero to be retrieved.")
				.setRequired(true)),
	async execute(interaction) {
		const rawHerodata = fs.readFileSync('./src/hero-library/library.json');
		const heroData = JSON.parse(rawHerodata);
		const chosenHero = interaction.options.getString("hero-name");
		// console.log("chosen hero: " + chosenHero);

		const heroSpecifics = new MessageEmbed()
			// .setColor(heroData.color)
			// .setTitle(heroData.title)
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org/')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setDescription('Some description here')
			.setThumbnail('https://i.imgur.com/AfFp7pu.png')
			.addFields(
				{ name: 'Regular field title', value: 'Some value here' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
			.addField('Inline field title', 'Some value here', true)
			.setImage('https://i.imgur.com/AfFp7pu.png')
			.setTimestamp()
			.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

		await interaction.reply({ embeds: [heroSpecifics] });
	},
};
