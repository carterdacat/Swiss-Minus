import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";
import { getRandom } from "../../utils";

export let name = "randomfact";
export let description = "Gives you a random fact";
export let cooldown = 5;
export let aliases = ["randomfact", "fact", "rf"];
export let canBeOff = true;

    const factArray = [
        "Actor Michael Keaton got his start in show business as a production assistant on Mister Rogers' Neighborhood. He helped with the puppets and ran the trolley.",
        "Regina Rohde was a student at both Columbine High and Virginia Tech during both shootings.",
        "The Sultan of Morocco and Queen Elizabeth I drew up a plan to conquer the Spanish Americas and partition them between Morocco and England in 1603. Historians speculate that had the Sultan and the Queen not die the next year, Morocco might have colonized much of the New World.",
        "The word 'bald' in 'bald eagle' has nothing to do with the definition as a lack of hair. Rather, the term bald eagle is derived in English from the word 'piebald', in reference to their white heads and tail feathers in contrast to the darker color of the rest of their bodies.",
        "Jenny Slate got fired from SNL for dropping the F-bomb.",
        'Natalie Portman helped with the writing of "The Social Network" by providing inside information about the social life at Harvard because she was a Harvard student at the time Facebook first appeared there. The lines "Who was the movie star?", "Does it matter?" in the movie refers to her.',
        "King George V’s last words were “God damn you!”, to a nurse who gave him a sedative.",
        "The founder of Bitcoin is someone called Satoshi Nakamoto. Nobody knows who he is, what his real name is or where he lives. He holds 1 million bitcoins which is equivalent to $3.3 billion (as of December 2018).",
        "Prince Philip, the husband of Queen Elizabeth, was born into both the Danish and Greek Royal Families and is the oldest ever male member of the British Royal Family at the age of 96. He retired from royal duties last year after completing 22,219 solo engagements since 1952.",
        "Iron Maiden lead singer, Bruce Dickinson is considered a polymath by Intelligent Life magazine due to excelling in a wide variety of pursuits. He is a commercial pilot, presented shows on radio and TV, written novels, brews his own beer and was once ranked 7th in Great Britain for fencing.",
        'A college student named Derek Kieper wrote against seat belt laws, saying they are "intrusions on individual liberties" and that he won\'t wear one. He died in a car crash, and his 2 passengers survived because they were wearing seatbelts.',
        "In ‘The Incredibles’, one scene has a clear reference to Die Hard 3, to the scene where a police officer points a gun at Samuel Jackson. Samuel Jackson played both Frozone and the policeman in ‘The Incredibles’.",
        "The 1940 Winter Olympics were originally given to Japan. They declined the games due to the start of the Sino-Japanese War. Eventually, they were awarded to Germany. 3 months later, Germany invaded Poland. The games were canceled altogether.",
        "In 2017, archeologists in Israel discovered a cave that was used by humans some 400,000 years ago. They think it was used as a ‘school’ where people were taught how to make primitive tools.",
        "The East India Trading Company once had a private army of 260,000. Double that of the British Army. It also once accounted for half of the world's trade.",
        "In Batman Begins, the homeless man that gets Bruce's coat was Rade Serbedzija. He is the same actor that played the father out for revenge in Taken 2 (2012), also featuring Liam Neeson.",
        'It is a myth that you should fully discharge your cell phone/laptop batteries before charging - it\'s a holdover from the Ni-Cad chemistry era and its "memory effect", but lithium-ion batteries are at their healthiest when you use very little and charge very often.',
        'John Cusack once asked his agent to present him with the "craziest, the most unproduceable script you can find." His agent presented "Being John Malkovich". Impressed with the script, Cusack auditioned and won a role in the film.',
        "There is a long-term care facility in the Netherlands that allows college students to stay for free in exchange for 30 hours of volunteer per month. When students come home from a class, concert, or party, they share those experiences with their elderly neighbors, some of whom are over 90",
        "When UPS set up shop in West Germany in 1976, the company’s brown color scheme upset locals who still had fresh memories of the Nazi Party and its “brown shirts.” To defuse tensions, UPS had its employees wear green uniforms.",
        "The most decorated American WWI veteran from Texas was an undocumented Mexican immigrant named Marcelino Serna. He was also the first Hispanic to be awarded the Distinguished Service Cross",
        'In 1975, a Physicist named Jack H. Hetherington made his Cat named F.D.C. Willard was the Co-Author of a paper because he\'d accidentally written "We" instead of "I" throughout the paper and couldn\'t be bothered of changing it.',
        'While writing Hot Fuzz, Simon Pegg and Edgar Wright referred to the supermarket manager, Simon Skinner as being played by a "Timothy Dalton type" actor before thinking to ask Dalton himself to be in the film. To their surprise, Dalton had loved Shaun of the Dead and signed on for the role.',
        "18th-century Prussian king Frederick William I was obsessed with having soldiers over 6 foot tall. He paid families for tall children, kidnapped tall men, bred them by pairing up his soldiers with tall women, and even stretched them on a rack to make them taller.",
        "People used to think the kidneys governed one's conscience, and several Bible verses say God inspects the kidneys of the dead. Jewish tradition holds that one kidney counsels what is good, and the other what is evil.",
        'Seattle is planning to build a new city park filled with hundreds of edible plants- such as fruit trees, vegetable plants, herbs, etc- which will be free to everyone. If successful, it will be the first "Urban Food Forest" of the nation.',
        "When you turn 100 in Japan, the Prime Minister sends you a silver cup to celebrate. So many people are turning 100 that they had to find a way to make cheaper cups.",
        "In Nigeria's Yoruba culture, the second born twin is the elder twin. The first born twin (Taiwo) is kicked out of the womb by the second born twin (Kehinde) to 'test' the world. Kehinde knows it is safe once Taiwo starts crying.",
        'Nintendo pushed the term "videogame console" so people would stop calling competing products "Nintendos" and they wouldn\'t risk losing the valuable trademark.',
        "During the Glasgow Ice cream wars, rival ice cream truck drivers sold drugs from their trucks, shot at each other and committed arson throughout the 80's.",
        "In social psychology, the pratfall effect is the tendency for attractiveness to increase or decrease after an individual makes a mistake, depending on the individual’s perceived ability to perform well in a general sense. A perceived able individual would be, on average, more likable after committing a blunder, while the opposite would occur if a perceived average person makes a mistake."
    ];

    export async function execute(client: SwissClient, message: Message, _args: string[]) {
        const embed = new MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setTitle("Here is a random fact!")
          .setDescription(getRandom(factArray))
          .setColor(swiss_blue)
          .setFooter(client.version)
          .setTimestamp();
        await message.channel.send(embed);
      }