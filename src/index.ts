import { ForgeCanvas } from "@tryforge/forge.canvas";
import { ForgeDB } from "@tryforge/forge.db";
import { ForgeClient, LogPriority } from "@tryforge/forgescript";
import { ForgeChess } from "@weebforge/chess";
import { config } from "dotenv";
import { ForgeColor } from "forge.color";

config({ quiet: true });
const chess = new ForgeChess({
  events: ["start"],
});

const db = new ForgeDB({
  type: "better-sqlite3",
  folder: "database",
  events: ["connect"],
});

const client = new ForgeClient({
  intents: ["GuildMembers", "GuildMessages", "Guilds", "MessageContent"],
  events: ["clientReady", "messageCreate", "interactionCreate"],
  extensions: [new ForgeCanvas(), new ForgeColor(), db, chess],
  mobile: true,
  logLevel: LogPriority.High,
  prefixes: [process.env.Prefix!, "~"],
});

client.commands.load("dist/commands");
db.commands.load("dist/extensions/db");

client.login(process.env.BotToken);
