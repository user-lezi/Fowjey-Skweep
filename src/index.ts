import { ForgeCanvas } from "@tryforge/forge.canvas";
import { ForgeClient, LogPriority } from "@tryforge/forgescript";
import { config } from "dotenv";

config({ quiet: true });
const client = new ForgeClient({
  intents: ["GuildMembers", "GuildMessages", "Guilds", "MessageContent"],
  events: ["clientReady", "messageCreate", "interactionCreate"],
  extensions: [new ForgeCanvas()],
  mobile: true,
  logLevel: LogPriority.High,
  prefixes: [process.env.Prefix!, "~"],
});

client.commands.load("dist/commands");

client.login(process.env.BotToken);
