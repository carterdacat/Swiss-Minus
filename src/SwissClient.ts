import { Client, Collection, ClientOptions } from "discord.js";
import { Client as PgClient } from "pg";
import { join } from "path";
import { readdirSync } from "fs";

interface SwissOptions {
  db: PgClient;
  dev: boolean;
  version: string;
  commandPath: string;
  eventPath: string;
}
class SwissClient extends Client {
  public db: PgClient;
  public dev: boolean;
  public version: string;
  public commands: Collection<string, any>;
  public commandsExecuted: number;
  public commandsFailed: number;
  public events: Collection<string, any>;

  public constructor(options: SwissOptions, discordOptions: ClientOptions) {
    super(discordOptions);
    this.db = options.db;
    this.dev = options.dev;
    this.version = `v${options.version}`;
    this.commands = new Collection();
    this.readCommands(options.commandPath);
    this.commandsExecuted = 0;
    this.commandsFailed = 0;
    this.events = new Collection();
    this.readEvents(options.eventPath);
  }

  // Command handling
  public readCommands(p: string) {
    const path = join(__dirname, p);
    const categories = readdirSync(path);
    const miscCommands = categories.filter(file =>
      file.endsWith(this.dev ? ".ts" : ".js")
    );
    miscCommands.forEach(m =>
      this.addCommandFromPath(join(__dirname, p, m), "Misc")
    );
    categories
      .filter(c => !c.includes("."))
      .forEach(category => {
        const commands = readdirSync(join(__dirname, p, category));
        commands.forEach(command => {
          this.addCommandFromPath(
            join(__dirname, p, category, command),
            category
          );
        });
      });
  }

  private addCommandFromPath(path: string, category: string) {
    const command = require(path);
    if (this.dev) {
      console.log(`Loading in command ${command.name} of category ${category}`);
    }
    command.category = category;
    this.commands.set(command.name, command);
  }

  // Event handling
  public readEvents(p: string) {
    const path = join(__dirname, p);
    const categories = readdirSync(path);
    const events = categories.filter(file =>
      file.endsWith(this.dev ? ".ts" : ".js")
    );
    events.forEach(m => this.addEventFromPath(join(__dirname, p, m)));
  }

  private addEventFromPath(path: string) {
    const event = require(path);
    if (this.dev) {
      console.log(`Loading in event ${event.name}`);
    }
    const execute = (event.execute as Function).bind(null, this);
    this.on(event.invoke, execute);
    this.events.set(event.name, event);
  }
}

export default SwissClient;
