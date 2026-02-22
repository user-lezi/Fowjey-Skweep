"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forge_canvas_1 = require("@tryforge/forge.canvas");
const forge_db_1 = require("@tryforge/forge.db");
const forgescript_1 = require("@tryforge/forgescript");
const chess_1 = require("@weebforge/chess");
const dotenv_1 = require("dotenv");
const forge_color_1 = require("forge.color");
(0, dotenv_1.config)({ quiet: true });
const chess = new chess_1.ForgeChess({
    events: ["start"],
});
const db = new forge_db_1.ForgeDB({
    type: "better-sqlite3",
    folder: "database",
    events: ["connect"],
});
const client = new forgescript_1.ForgeClient({
    intents: ["GuildMembers", "GuildMessages", "Guilds", "MessageContent"],
    events: ["clientReady", "messageCreate", "interactionCreate"],
    extensions: [new forge_canvas_1.ForgeCanvas(), new forge_color_1.ForgeColor(), db, chess],
    mobile: true,
    logLevel: forgescript_1.LogPriority.High,
    prefixes: [process.env.Prefix, "~"],
});
client.functions.load("dist/functions");
client.commands.load("dist/commands");
db.commands.load("dist/extensions/db");
client.login(process.env.BotToken);
