const { SlashCommandBuilder } = require('discord.js');
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
				.setDescription("The hero's base-specifics to be retrieved.")
				.setRequired(true))
		.addStringOption(option =>
			option.setName("info")
				.setDescription("The hero's specifics to be retrieved.")
				.setRequired(false)),

	async execute(interaction) {
		const rawHerodata = fs.readFileSync('./src/hero-library/library.json');
		const heroDataJSON = JSON.parse(rawHerodata);
		const chosenHero = heroDataJSON[interaction.options.getString("hero-name")];
		const heroWhichInfo = interaction.options.getString("info");
		
		if (chosenHero === undefined) return;


		if (chosenHero["enabled"]) {

			// Base template for hero's Embed Messages info
			const heroEmbed = new MessageEmbed()
			.setColor(chosenHero["color"])
			.setTitle(chosenHero["title"])
			.setDescription(chosenHero["hero-description"])
			.setThumbnail(chosenHero["hero-thumbnail"])
			.setImage(chosenHero["hero-banner"])
			.setTimestamp()
			.setFooter({ text: 'Credits: Mariestad#0001 \nLast updated on ' + chosenHero["last-update"], iconURL: interaction.user.displayAvatarURL() });



			// Choose whether you ask for base or LB's hero info
			if (heroWhichInfo == "base" || heroWhichInfo == "" || heroWhichInfo == undefined) {
				heroEmbed.addFields(
					{ name: chosenHero["passive-name"], value: chosenHero["passive-description"] },
					{ name: '\u200B', value: '\u200B' },
					{ name: chosenHero["s1-name"], value: chosenHero["s1-description"], inline: true },
					{ name: chosenHero["s2-name"], value: chosenHero["s2-description"], inline: true },
					{ name: '\u200B', value: '\u200B' },
				);
				heroEmbed.addField(chosenHero["ss-name"], chosenHero["ss-description"]);


				await interaction.reply({ embeds: [heroEmbed] });
			}
			else if (heroWhichInfo === "lb") {
				// console.log("lb:" + chosenHero["lb"]["passive-name"]);
				heroEmbed.addFields(
					{ name: chosenHero["lb"]["passive-name"], value: chosenHero["lb"]["passive-description"] },
					{ name: '\u200B', value: '\u200B' },
					{ name: chosenHero["lb"]["s1-name"], value: chosenHero["lb"]["s1-description"], inline: true },
					{ name: chosenHero["lb"]["s2-name"], value: chosenHero["lb"]["s2-description"], inline: true },
					{ name: '\u200B', value: '\u200B' },
				);

				await interaction.reply({ embeds: [heroEmbed] });
			}
			else if (heroWhichInfo === "build") {

				heroEmbed.addFields(
					{ name: 'Recommended Set(s): ', value: chosenHero["build"]["sets"] },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Recommended Traits: ', value: chosenHero["build"]["traits"] },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Recommended LB Skills: ', value: chosenHero["build"]["lb-skills"] },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Recommended Accessories: ', value: chosenHero["build"]["accessories"] },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'PvE priority: ', value: chosenHero["build"]["priority"]["PvE"], inline: true },
					{ name: 'PvP priority: ', value: chosenHero["build"]["priority"]["PvP"], inline: true },
					{ name: 'WB priority: ', value: chosenHero["build"]["priority"]["WB"], inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Chaser Build', value: 'RANK :zero::five: | ' + chosenHero["build"]["chaser-traits"]["cl5"] +
													'\nRANK :one::zero: | ' + chosenHero["build"]["chaser-traits"]["cl10"] +
													'\nRANK :one::five: | ' + chosenHero["build"]["chaser-traits"]["cl15"] +
													'\nRANK :two::zero: | ' + chosenHero["build"]["chaser-traits"]["cl20"] },
					// { name: 'asd', value: 'asd' },
					// { name: '\u200B', value: chosenHero["build"]["chaser-traits"]["cl15"] },
					// { name: '\u200B', value: chosenHero["build"]["chaser-traits"]["cl20"] },
				);

				await interaction.reply({ embeds: [heroEmbed] });
			}
			else {
				await interaction.reply({ content: `${chosenHero["hero-short-name"]} specifics are temporarily unavailable. Try again later.`, ephemeral: true });
			}
		}
		
	},
};
