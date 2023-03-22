const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bcalc')
		.setDescription('Calculates how many BoVs you need to reach a specific level.')
        .addIntegerOption(option =>
			option.setName("current-level")
				.setDescription("The hero's type current level.")
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName("target-level")
				.setDescription("The hero's type aimed level.")
				.setRequired(true)),
	async execute(interaction) {
		let iBovAmount = 0;
		const iCurrentLevel = interaction.options.getInteger("current-level");
		const iAimedLevel = interaction.options.getInteger("target-level");

		if (iAimedLevel <= 520) {
			if (iCurrentLevel > 0 && iCurrentLevel < iAimedLevel) {
				iBovAmount = (iAimedLevel * iAimedLevel + iAimedLevel) - (iCurrentLevel * iCurrentLevel + iCurrentLevel);
				await interaction.reply(`Amount of Blessings of Valor required from level ${iCurrentLevel} to level ${iAimedLevel} is ${iBovAmount}.`);
			}
			else {
				await interaction.reply(`The current level must be above zero (0) and lesser than the target level.`);
			}
		}
		else {
			await interaction.reply(`The current max level is 520.`);
		}
		
	},
};
