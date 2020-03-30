import {Client, Message} from "discord.js";

const rules = [
  "You must be over the age of 13. If we suspect a user being under the age of 13, we may enforce appropriate action to make sure all users are above the age of 13. You may continue to stay in this server with parental permission.",
  "Inappropriate discord username or profile pictures are not allowed, you will be given a formal warning to change this and may lead to further action being taken upon you.",
  "Moderators reserve the right to change your server nickname if it is found to be violating the rules. This will be followed by a formal warning as stated above.",
  "Please withhold only a single account within the server. Prior permission will be required from the staff team if you wish to bring in another account for any legit reason.",
  "With custom statuses, you may not have any inappropriate/racist/offensive content in anyway. Self advertising is also prohibited and action may be taken if these rules are broken.",
  "Alternate accounts are not tolerated within the server.",
  "Discriminatory jokes, language and hate speech will not be tolerated at any point.",
  "We will not tolerate any insults, verbal abuse and any threats towards others/the server.",
  "DDOS Threats are Zero Tolerance and you will be banned immediately. No questions asked.",
  "Excessive Swearing is not allowed and you will be warned. Please do not try and use loopholes.",
  "The excessive use of capital letters is not allowed and will result in a warning.",
  "No advertising is allowed (except from in #showcase which only allows you to self-promote your social media. No instant invites allowed. ) This includes but not limited to: Discord invites, YouTube, Instagram, or any other social medias. This does include DM advertising, if someone is advertising in your DMs, please contact a staff member.",
  "Please do not flood the text channels with rapid messages. E.g sending 3-5 messages in a consecutive manner.",
  "Trolling or being a general nuisance is discouraged.",
  "Please try and avoid posting large obnoxious paragraphs of text.",
  "Please respect everyone within the server. Everyone has a different opinion and should be able to express them.",
  "We have a zero tolerance policy for terrorism. Please avoid promoting terrorism or making any remarks. You will be permanently banned from the Discord Server.",
  "Please post any content in the correct channels.",
  "Please do not ask to become a Moderator or Admin. You can apply for these roles when applications are open, however you may also be directly selected. Asking for these roles will decrease your chance of getting them.",
  "Please avoid backseat moderating",
  "Refrain from posting blank messages. Some of them are just annoying and pointless in this server.",
  "Do not leak chats to banned users of the Swiss server.",
  "Absolutely no NSFW content.",
  "Posting any offensive, sexually explicit or derogatory content is not allowed.",
  "Please do not promote any illegal content including, but not limited to: Piracy and drugs.",
  "Do not post any content which reveals the personal information of a specific user.",
  "We reserve the right to remove any user content at any time, this can be for any reason.",
  "Do not plagarise any content from the internet and claim that it is yours. This includes planespotting images, please give credit.",
  "Please use the VC for its intended purpose. E.g. use the general VC for general discussion and not music chat.",
  "Please do not play any racist, homophobic or songs which contain excessive swearing. Action will be taken.",
  "Please avoid earraping the VC, however if all agree then you can go ahead.",
  "Please avoid playing any high pitched, loud or annoying sounds.",
  "Try and reduce any background noise.",
  "Moderators reserve the right to disconnect anyone from any VC at any time.",
  "Moderators also have the right to enter any VC at any time.",
  "We reserve the right to remove the DJ role from anyone at anytime."
];
const wordmap = {
  age: 1
};

export let name = "rule";
export let description = "Gets a rule";
export let cooldown = 0;
export let canBeOff = true;

export async function execute(
    client: Client,
    message: Message,
    args: string[]
) {
  let pete = client.users.cache.get("660238973943152707");
  if (!args[0]) return;
  if (args[0] === '16a') return await message.channel.send('Politics are not tolerated; this is an aviation server.');
  if (rules[parseInt(args[0]) - 1] !== undefined)
    await message.channel.send(rules[parseInt(args[0]) - 1]);
  if (rules[wordmap[args[0]] - 1] !== undefined)
    await message.channel.send(rules[wordmap[args[0].toLowerCase()] - 1]);
  if (parseInt(args[0]) > 36)
    `Swiss Minus is the best bot, no questions. If you do for some absurd reason have a question, dm **Non-Ping(${
        (await pete).tag
    })**`;
}
