/* eslint-disable consistent-return */
/* eslint-disable global-require */
import dotenv from "dotenv";
import express from "express";
import { MessageEmbed, TextChannel } from "discord.js";
import { join } from "path";
import { Client as PgClient } from "pg";
// import { version } from "../package.json"; importing it like this includes the package.json in the build which includes the src folder
const { version } = require("../package.json");
import planes from "./planes";
import SwissClient from "./SwissClient";
// import { log_yellow, error_red } from "./config";
// import ffmpeg from "ffmpeg-static";
// import opus from "node-opus";
// import ytdl from "ytdl-core";

dotenv.config({ path: join(__dirname, "../.env") });
const dev = process.env.dev ? true : false;
const aplanes = Object.values(planes);
const db = new PgClient({
  connectionString: dev ? process.env.dev_db_url : process.env.DATABASE_URL,
  ssl: true
});
db.connect().then(_ => {
  console.log("Connected to database.");
});

const client = new SwissClient(
  { db, dev, version, commandPath: "./commands", eventPath: "./events" },
  { partials: ["MESSAGE", "CHANNEL", "REACTION"] }
);
let count: number;
let lengthe = aplanes.length;
const forloop = async (_: string) => {
  for (
    count = 1;
    lengthe * 2 >
    (((
      await db.query(
        "SELECT count(*) FROM information_schema.columns WHERE table_name = 'cards'"
      )
    ).rows[0].count - 8) as number);
    count++
  ) {
    let levels = planes[count].name + "levels";
    let counts = planes[count].name + "count";
    let textl = `ALTER TABLE cards ADD COLUMN IF NOT EXISTS ${levels} int`;
    let textc = `ALTER TABLE cards ADD COLUMN IF NOT EXISTS ${counts} int`;
    await db.query(textl);
    await db.query(textc);
  }
};
forloop("_");
client.on("messageReactionAdd", async reaction => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.message.id === "687721364098252811") {
    await db.query("UPDATE settings SET value = 'on' WHERE name = 'bot'");
  }
});
client.login(process.env.token).then(async _token => {
  console.log(`Ready as ${client.user.tag}`);
  client.user
    .setActivity(`the ${version} update`, { type: "WATCHING" })
    .then()
    .catch(console.error);
});

export async function getSetting(name: string) {
  const res = await db.query("SELECT value FROM settings WHERE name = $1", [
    name
  ]);
  return res.rows[0].value;
}

// YouTube search without API
import puppeteer from "puppeteer";
import { URLSearchParams } from "url";
class Video {
  id: string;
  url: string;
  title: string;
  numViews: string;
  thumbnail: string;
  releaseDate: string;

  constructor(_) {
    this.id = _.videoId;
    this.url = `https://youtube.com/watch?v=${_.videoId}`;
    this.title = _.title.runs[0].text;
    this.numViews = _.viewCountText.simpleText;
    this.thumbnail = _.thumbnail.thumbnails[0].url;
    this.releaseDate = _.publishedTimeText.simpleText;
  }
}
const sleep = (seconds: number = 1) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));
async function searchYoutubeVideos(searchTerm, amount) {
  const browser = await puppeteer.launch({
    headless: !dev,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(
    `https://www.youtube.com/results?${new URLSearchParams({
      search_query: searchTerm
    }).toString()}&sp=EgIQAQ%253D%253D`,
    { timeout: 60000 }
  );
  await sleep(1);
  await page.evaluate(() => {
    //@ts-ignore
    window.scrollTo(
      0,
      //@ts-ignore
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  });
  await sleep(1);
  await page.evaluate(() => {
    //@ts-ignore
    window.scrollTo(
      0,
      //@ts-ignore
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  });
  await sleep(1);
  await page.evaluate(() => {
    //@ts-ignore
    window.scrollTo(
      0,
      //@ts-ignore
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  });
  await sleep(1);
  await page.evaluate(() => {
    //@ts-ignore
    window.scrollTo(
      0,
      //@ts-ignore
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  });
  await sleep(1);
  await page.evaluate(() => {
    //@ts-ignore
    window.scrollTo(
      0,
      //@ts-ignore
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  });
  await sleep(1);
  await page.evaluate(() => {
    //@ts-ignore
    window.scrollTo(
      0,
      //@ts-ignore
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  });
  await sleep(1);
  const results = await page.evaluate(() => {
    //@ts-ignore
    return window.ytInitialData.contents.twoColumnSearchResultsRenderer
      .primaryContents.sectionListRenderer.contents[0].itemSectionRenderer
      .contents;
  });
  const videos: Video[] = results
    .map(v => v.videoRenderer)
    .filter(video => video.ownerText.runs[0].text === "Swiss001")
    .map(v => new Video(v));
  await browser.close();
  return videos.slice(0, amount);
}
const cachedVideos = [];

// Express stuff
const app = express();
app.set("views", join(__dirname, "../webpage/views"));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "../webpage/public")));
app.get("/", (req, res) => {
  res.render("home", { videos: cachedVideos });
});
app.get("/pubsubhubbub", (req, res) => {
  const { channel_id } = req.query;
  searchYoutubeVideos("Swiss001", 30)
    .then(() => {
      client.channels.fetch(channel_id).then((channel: TextChannel) => {
        const embed = new MessageEmbed()
          .setAuthor(`Swiss001 | New Video!`)
          .setTitle(cachedVideos[0].title)
          .setURL(`https://youtube.com/watch?v=${cachedVideos[0].id}`)
          .setFooter(version)
          .setTimestamp();
        channel.send(embed);
      });
      res.redirect("/");
    })
    .catch(error => {
      console.error(error);
      res.redirect("error");
    });
});
app.get("/about", (req, res) => {
  res.render("about", {});
});
app.use("*", (req, res, next) => {
  res.render("404");
});

searchYoutubeVideos("Swiss001", 30)
  .then(results => {
    results.forEach(r => cachedVideos.push(r));
    app.listen(process.env.PORT, () => {
      console.log(
        `Webserver running on port ${process.env.PORT}, http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch(console.error);
