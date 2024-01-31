const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bcalc')
		.setDescription('Calcula quantas BoVs você precisa para chegar em determinado nível.')
        .addIntegerOption(option =>
			option.setName("nivel-atual")
				.setDescription("Nível atual da maestria.")
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName("nivel-alvo")
				.setDescription("Nível alvo da maestria.")
				.setRequired(true)),
	async execute(interaction) {
		let iBovAmount = 0;
		const iCurrentLevel = interaction.options.getInteger("nivel-atual");
		const iAimedLevel = interaction.options.getInteger("nivel-alvo");

		if (iAimedLevel <= 640) {
			if (iCurrentLevel > 0 && iCurrentLevel < iAimedLevel) {
				iBovAmount = (iAimedLevel * iAimedLevel + iAimedLevel) - (iCurrentLevel * iCurrentLevel + iCurrentLevel);
				await interaction.reply(`Quantidade de BoVs requeridas do nível ${iCurrentLevel} até ${iAimedLevel} é de ${iBovAmount}.`);
			}
			else {
				await interaction.reply(`O nível atual deve ser acima de zero e menor que o nível alvo.`);
			}
		}
		else {
			await interaction.reply(`O nível máximo atual é 640.`);
		}
		
	},
};
