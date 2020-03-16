import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import cp from "child_process";
import { convertMs } from "../../utils";
import { error_red, swiss_blue } from "../../config";

export let name = "exec";
export let description = "Execute a command in a terminal";

const allowedUsers = ["660238973943152707", "502446928303226890"];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  if (!client.dev) {
    if (!allowedUsers.includes(message.author.id))
      return message.channel.send(
        "This is a command only for certain people, and you're not one of them."
      );
  }
  const command = args.join(" ");
  if (!command) return message.channel.send("Nothing to execute");
  const startTime = Date.now();
  const data = cp.exec(command, (err, stdout, stderr) => {
    if (err) {
      const errEmbed = new MessageEmbed()
        .setColor(error_red)
        .setAuthor(`${message.author.tag} | Error`)
        .setTitle(`:x: Error: ${err}`)
        .setDescription(`\`\`\`${stderr}\`\`\``)
        .setFooter(client.version)
        .setTimestamp();
      return message.channel.send(errEmbed);
    }
    const duration = convertMs(
      new Date(Date.now() - startTime).getMilliseconds()
    );
    const embed = new MessageEmbed()
      .setColor(swiss_blue)
      .setAuthor(`${message.author.tag} | Exec`)
      .setTitle(`:white_check_mark: Success!`)
      .setDescription(`\`\`\`${stdout}\`\`\``)
      .setFooter(client.version)
      .setTimestamp();
    message.channel.send(embed);
  });
}
