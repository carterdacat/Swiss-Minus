import SwissClient from "../../SwissClient";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Client as PgClient } from "pg";
import { log_yellow } from "../../config";
import GitHub from "github-api";

export let name = "bug";
export let description = "Report a bug, or suggest a feature!";
export let usage = "[bug/suggestions/report]";
export let aliases = ["report", "suggest"];
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[],
  db: PgClient
) {
  const gh = new GitHub({
    username: "Swiss-Plus",
    password: process.env.gitlogin
  });
  if (args.length < 2) {
    return message.channel.send("You didnt provide any arguments!");
  }
  let body = "";
  let log = client.channels.cache.get("682450929634770946") as TextChannel;
  let embed = new MessageEmbed().setTitle("New Bug!");
  for (let c = 1; args.length > c; c++) {
    body = body + " " + args[c];
  }
  let iText = {
    title: args[0],
    body: body
  };
  let issue = gh.getIssues("carterdacat", "Swiss-Minus");
  issue
    .createIssue(iText)
    .then(b => {
      let report = new MessageEmbed()
        .setColor(log_yellow)
        .setTitle("Succsesfuly sent the issue")
        .setURL(b.data.html_url)
        .setFooter(client.version)
        .setTimestamp();
      message.channel.send(report);
      embed
        .setColor(log_yellow)
        .setDescription("A new issue!")
        .setURL(b.data.html_url)
        .setFooter(client.version)
        .setTimestamp();
      log.send(embed);
      log.send("<@660238973943152707>");
    })
    .catch(console.error);
}
