"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forge_canvas_1 = require("@tryforge/forge.canvas");
const forgescript_1 = require("@tryforge/forgescript");
const dotenv_1 = require("dotenv");
const forge_color_1 = require("forge.color");
const forge_user_1 = require("forge.user");
(0, dotenv_1.config)({ quiet: true });
const userBot = new forge_user_1.ForgeUser({
    token: process.env.UserToken,
    events: ["ready", "messageCreate"],
});
const client = new forgescript_1.ForgeClient({
    intents: ["GuildMembers", "GuildMessages", "Guilds", "MessageContent"],
    events: ["clientReady", "messageCreate", "interactionCreate"],
    extensions: [new forge_canvas_1.ForgeCanvas(), new forge_color_1.ForgeColor(), userBot],
    mobile: true,
    logLevel: forgescript_1.LogPriority.High,
    prefixes: [process.env.Prefix, "~"],
});
client.commands.load("dist/commands");
client.login(process.env.BotToken);
