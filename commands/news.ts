import SwissClient from "../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";
import { swiss_blue } from "../config";

export let name = "news";
export let description = "Get the latest news headlines from flightglobal.com";
export let aliases = ["whatsup"];
export let cooldown = 15;

const url = "https://flightglobal.com"; // This must not be changed

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  let maxArticles = 10;
  if (
    args[0] &&
    !isNaN(parseInt(args[0])) &&
    parseInt(args[0]) > 0 &&
    parseInt(args[0]) < 20
  )
    maxArticles = parseInt(args[0]);
  const newsMsg = await message.channel.send(
    `Loading in news content from <${url}>...`
  );
  message.channel.startTyping();
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const articles = Array.from(
    $(
      ".columnOne > #latest_112 > .sleeve > .sliderContent > .thumbs > .swiper-container > .swiper-wrapper > *"
    )
  )
    .map((element: any, index: number) => {
      return {
        name: $(
          `.columnOne > #latest_112 > .sleeve > .sliderContent > .thumbs > .swiper-container > .swiper-wrapper > *:nth-child(${index})`
        ).text(),
        link: $(
          `.columnOne > #latest_112 > .sleeve > .sliderContent > .thumbs > .swiper-container > .swiper-wrapper > *:nth-child(${index}) > *:first-child > *:first-child > *:first-child > *:first-child`
        ).attr("href"),
        thumbnail: $(
          `.columnOne > #latest_112 > .sleeve > .sliderContent > .thumbs > .swiper-container > .swiper-wrapper > *:nth-child(${index}) > *:first-child > *:first-child > *:first-child > *:first-child > *:first-child`
        ).attr("src")
      };
    })
    .slice(1, maxArticles + 1);
  const newsEmbed = new MessageEmbed()
    .setAuthor(
      `${message.author.tag} | News`,
      message.author.displayAvatarURL()
    )
    .setTitle(`Latest Headlines from ${url}`)
    .setColor(swiss_blue)
    .setFooter(client.version)
    .setTimestamp();
  articles.forEach((article, index) => {
    newsEmbed.addField(
      `${index + 1}: ${article.name}`,
      `[Read More](${article.link})`
    );
  });
  message.channel.stopTyping(true);
  message.channel.send(newsEmbed);
  newsMsg.delete();
}
