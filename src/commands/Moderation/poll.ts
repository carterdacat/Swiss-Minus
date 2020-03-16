import SwissClient from "../../SwissClient";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { swiss_blue } from "../../config";
import { awaitMessage, arrayJoin } from "../../utils";

export let name = "poll";
export let description = "Creates a poll in whatever channel you would like to";
export let cooldown = 15;

const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const adjNumbers = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth"
];
const abortKeywords = ["cancel", "abort", "go around", "eject"];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  // Input the channel
  const channelEmbed = new MessageEmbed()
    .setDescription(
      `What channel should the poll be in? You can cancel the poll by saying \`${arrayJoin(
        abortKeywords,
        "`, `",
        "`",
        "or"
      )}\``
    )
    .setColor(swiss_blue)
    .setFooter(client.version)
    .setTimestamp();
  const channelMessage = await message.channel.send(channelEmbed);
  const channelResponse: Message = await awaitMessage(
    message,
    (m: Message) =>
      m.author.id === message.author.id && m.mentions.channels.first() !== null
  );
  const channel: TextChannel = channelResponse.mentions.channels.first();
  channelMessage.delete();
  channelResponse.delete();
  if (abortKeywords.includes(channelResponse.content.toLowerCase())) {
    return message.channel.send("Aborted the poll");
  }

  // Input the question
  const questionEmbed = new MessageEmbed()
    .setDescription(
      `Poll will be in <#${
        channel.id
      }>, what should the question be? You can cancel the poll by saying \`${arrayJoin(
        abortKeywords,
        "`, `",
        "`",
        "or"
      )}\``
    )
    .setColor(swiss_blue)
    .setFooter(client.version)
    .setTimestamp();
  const questionMessage = await message.channel.send(questionEmbed);
  const questionResponse: Message = await awaitMessage(
    message,
    (m: Message) => m.author.id === message.author.id
  );
  const question: string = questionResponse.content;
  questionMessage.delete();
  questionResponse.delete();
  if (abortKeywords.includes(questionResponse.content.toLowerCase())) {
    return message.channel.send("Aborted the poll");
  }

  // Input the amount of possible options
  const amountEmbed = new MessageEmbed()
    .setDescription(
      `Question is \`${question}\`, how many options should the poll have? You can cancel the poll by saying \`${arrayJoin(
        abortKeywords,
        "`, `",
        "`",
        "or"
      )}\``
    )
    .setColor(swiss_blue)
    .setFooter(client.version)
    .setTimestamp();
  const amountMessage = await message.channel.send(amountEmbed);
  const amountResponse: Message = await awaitMessage(
    message,
    (m: Message) =>
      (m.author.id === message.author.id && !isNaN(parseInt(m.content))) ||
      abortKeywords.includes(m.content.toLowerCase())
  );
  const amount: number = parseInt(amountResponse.content);
  if (amount > 10 || amount < 2)
    return message.channel.send(
      `The amount of options you have must be between 2 and 10`
    );
  amountMessage.delete();
  amountResponse.delete();
  if (abortKeywords.includes(amountResponse.content.toLowerCase())) {
    return message.channel.send("Aborted the poll");
  }

  // Input every option
  const options = [];
  inputOptionLoop(1);
  async function inputOptionLoop(ctr) {
    const optionEmbed = new MessageEmbed()
      .setDescription(
        `Option ${adjNumbers[ctr - 1]} is \`${
          options[ctr - 2]
        }\`. What should the ${
          adjNumbers[ctr]
        } be? You can cancel the poll by saying \`${arrayJoin(
          abortKeywords,
          "`, `",
          "`",
          "or"
        )}\``
      )
      .setColor(swiss_blue)
      .setFooter(client.version)
      .setTimestamp();
    if (ctr === 1) {
      optionEmbed.setDescription(
        `Number of options is ${amount}, what should the ${
          adjNumbers[ctr]
        } be? You can cancel the poll by saying \`${arrayJoin(
          abortKeywords,
          "`, `",
          "`",
          "or"
        )}\``
      );
    }
    const optionMessage = await message.channel.send(optionEmbed);
    const optionResponse = await awaitMessage(
      message,
      (m: Message) => m.author.id === message.author.id
    );
    const option: string = optionResponse.content;
    options.push(option);
    optionMessage.delete();
    optionResponse.delete();
    if (abortKeywords.includes(optionResponse.content.toLowerCase())) {
      return message.channel.send("Aborted the poll");
    }
    if (ctr === amount) {
      displayPoll();
      return;
    }
    inputOptionLoop(ctr + 1);
  }

  async function displayPoll() {
    const pollReactions = [];
    const poll = new MessageEmbed()
      .setAuthor(message.author.tag, client.user.displayAvatarURL())
      .setColor(swiss_blue)
      .setTitle(question)
      .setTimestamp();
    options.map((option, index) => {
      // I'm using map here so that it won't trigger the send before the loop has finished
      poll.addField(
        `${reactions[index]}: ${options[index]}`,
        `React with ${reactions[index]} to choose this one`
      );
      pollReactions.push(reactions[index]);
    });
    const pollMsg = await channel.send(poll);
    await Promise.all(pollReactions.map(r => pollMsg.react(r)));
  }
}
