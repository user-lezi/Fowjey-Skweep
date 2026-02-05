import { BaseCommand } from "@tryforge/forgescript";

export default new BaseCommand({
  type: "messageCreate",
  name: "ping",
  code: `My ping is $pingms`,
});
