const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');
const library = require('../hero-library/library.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add hero specifics into the bot.')
        .addStringOption(option =>
			option.setName("hero-name")
				.setDescription("The hero's full name.")
				.setRequired(true)),
		// .addIntegerOption(option =>
		// 	option.setName("sets")
		// 		.setDescription("The hero's type aimed level.")
		// 		.setRequired(true)),
	async execute(interaction) {
		let strName = interaction.options.getString("hero-name");
        let strMsg = "";
        const rawHeroData = fs.readFileSync('./src/hero-library/library.json');
        const heroDataJSON = JSON.parse(rawHeroData);

        if (Object.prototype.hasOwnProperty.call(heroDataJSON, strName)) {
            strMsg = "Informed hero already exists.";
            console.log(heroDataJSON[strName]);
        }
        else {
            let strDate = new Date();
            const formatter = new Intl.DateTimeFormat('en', { month: 'long' });
            let month = formatter.format(strDate);
            month = month.charAt(0).toUpperCase() + month.slice(1);
            console.log(`${month} ${strDate.getDay()}, ${strDate.getFullYear()}`);
            console.log(month);



            // heroDataJSON[strName] = {
            //     "build": {
            //         "sets": "",
            //         "traits": "",
            //         "accessories": "",
            //         "priority": {
            //             "PvE": "",
            //             "PvP": "",
            //             "WB": "",
            //         },
            //         "lb-skills": "",
            //         "chaser-traits": {
            //             "cl5": "",
            //             "cl10": "",
            //             "cl15": "",
            //             "cl20": "",
            //         }
            //     },
            //     "color": "",
            //     "enabled": true,
            //     "hero-banner": "",
            //     "hero-description": "",
            //     "hero-short-name": "",
            //     "hero-thumbnail": "",
            //     "last-update": `${month} ${strDate.getDay()}, ${strDate.getFullYear()}`,
            //     "lb": {
            //         "passive-name": "",
            //         "passive-description": "",
            //         "s1-name": "",
            //         "s1-description": "",
            //         "s2-name": "",
            //         "s2-description": ""
            //     },
            //     "passive-name": "",
            //     "passive-description": "",
            //     "s1-name": "",
            //     "s1-description": "",
            //     "s2-name": "",
            //     "s2-description": "",
            //     "ss-name": "",
            //     "ss-description": "",
            //     "title":""
            // };

            // let json = JSON.stringify(heroDataJSON);
            // fs.writeFile('./src/hero-library/library.json', json, function readFileCallback(err) {
            //     if (err) console.log(err);
            // });
        }
        
		
	},
};
