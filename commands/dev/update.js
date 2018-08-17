//Base
const { Command } = require("discord.js-commando");
// const path = require("path");

//Embed
const { RichEmbed } = require("discord.js");

const isLunix = process.platform === "linux";
const isWin = process.platform === "win32";

module.exports = class UpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: "update",
			memberName: "update",
			group: "dev",
			description: "updates the bot",
			aliases: ["up"],
			details: "updates the bot with a file over git",
			ownerOnly: true,
		});
	}
	async run(msg) {
		const upEmbed = new RichEmbed()
			.setTitle("Updating")
			.setDescription("🔄 Updating...")
		;

		let upMsg = await msg.cahnnel.send(upEmbed);
		if (isLunix) { // execFile .sh
			const { exec } = require("child_process");
			const sh = exec(__dirname + `/../../../${this.name}.sh`);

			sh.stdout.on("data", data => console.log(data.toString()));
			sh.stderr.on("data", data => console.log(data.toString()));
			sh.on("exit", async code => await outcomeMsg(msg, upMsg, code, sh));
			return;
		} else if (isWin) { // windows only
			const { spawn } = require("child_process");
			const bat = spawn(__dirname + `/../../src/scripts/${this.name}.bat`);

			bat.stdout.on("data", data => console.log(data.toString()));
			bat.stderr.on("data", data => console.log(data.toString()));
			bat.on("exit", async code => await outcomeMsg(msg, upMsg, code, bat));
			return;
		}

	}
};

async function outcomeMsg(msg, embed, code, child) {
	switch (code) {
	case 0:
		embed.setDescription(`📥 Update successful *code: ${code}*`);
		await msg.channel.send(embed);
		child.kill();
		return;
	default:
		embed.setDescription(`⚠ Update failed *code: ${code}*`);
		await msg.channel.send(embed);
		child.kill();
		return ;
	}
}