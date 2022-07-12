import { Command } from "../structures/commands/Command.js";

export class Register extends Command {
  aliases = ["reg"];
  name = "register";
  filter = undefined;

  execute(ctx) {
    return "que registruda";
  }
}
