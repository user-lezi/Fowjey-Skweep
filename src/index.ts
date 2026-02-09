import { ForgeCanvas } from "@tryforge/forge.canvas";
import { ForgeClient, LogPriority } from "@tryforge/forgescript";
import { config } from "dotenv";
import { ForgeColor } from "forge.color";
import { ForgeUser } from "forge.user";

config({ quiet: true });
const userBot = new ForgeUser({
  token: process.env.UserToken,
  events: ["ready", "messageCreate"],
});

const client = new ForgeClient({
  intents: ["GuildMembers", "GuildMessages", "Guilds", "MessageContent"],
  events: ["clientReady", "messageCreate", "interactionCreate"],
  extensions: [new ForgeCanvas(), new ForgeColor(), userBot],
  mobile: true,
  logLevel: LogPriority.High,
  prefixes: [process.env.Prefix!, "~"],
});

client.commands.load("dist/commands");

client.login(process.env.BotToken);
