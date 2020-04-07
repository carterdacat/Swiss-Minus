import request from "request";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  console.log("pubsubhubbub nonsense has been invoked!");
  const args = process.argv.slice(2);
  if (!args[0]) return console.log("You need to pass in an ip address!");
  const swiss001channel = "UCYiaHzwtsww6phfxwUtZv8w";
  const dev = !!process.env.dev;
  console.log(
    request.post("http://pubsubhubbub.appspot.com/subscribe", {
      form: {
        "hub.mode": "subscribe",
        "hub.callback": `${args[0]}:${
          process.env.PORT
        }/pubsubhubbub?discord_channel_id=${
          dev ? "665372782972108803" : "593107179700224050"
        }`,
        "hub.topic": `https://youtube.com/xml/feeds/videos.xml?channel_id=${swiss001channel}`,
        "hub.lease_seconds": "604800"
      }
    })
  );
})();
