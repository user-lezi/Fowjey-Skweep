"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.BaseCommand({
    type: "messageCreate",
    name: "eval",
    aliases: ["e"],
    disableConsoleErrors: true,
    code: `
  $onlyForUsers[nuh uh;910837428862984213]
  $eval[$message]
  `,
});
