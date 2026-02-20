import { BaseCommand } from "@tryforge/forgescript";

export default new BaseCommand({
  type: "connect",
  code: `
  $logger[Info;ForgeDB is connected!]
  `,
});
