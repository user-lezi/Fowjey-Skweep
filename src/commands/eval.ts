import { BaseCommand } from "@tryforge/forgescript";

export default new BaseCommand({
  type: "messageCreate",
  name: "eval",
  aliases: ["e"],
  disableConsoleErrors: true,
  code: `
  $onlyForUsers[nuh uh;910837428862984213]
  $eval[$message]
  `,
});
