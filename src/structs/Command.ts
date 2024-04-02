import { ChatInputCommandInteraction, Client, Message } from "discord.js";
import {
  CommandConfig,
  CommandOption,
  CommandRunner,
  InteractionCommandContext,
  PrefixedCommandContext,
} from "../types/command";
import { Arguments } from "./Arguments";
import { Utils } from "./Utils";

export class HybridCommand<T extends CommandOption[]> implements CommandConfig<T> {
  declare name: string;
  declare runner: CommandRunner<HybridCommand<T>["options"]>;
  declare options: T;

  public constructor(config: CommandConfig<T>) {
    Object.assign(this, config);
  }

  public executeSlashCommand(
    interaction: ChatInputCommandInteraction,
    client: Client
  ) {
    const ctx: InteractionCommandContext<T> = {
      interaction,
      command: this,
    };

    const utils = new Utils(ctx);
    const args = new Arguments(ctx, utils, client, this.options);

    const result = this.runner({ ctx, args, utils });

    return result;
  }

  public executePrefixCommand(
    message: Message<true>,
    prefix: string,
    client: Client
  ) {
    const ctx: PrefixedCommandContext<T> = {
      message,
      prefix,
      command: this,
    };

    const utils = new Utils(ctx);
    const args = new Arguments(ctx, utils, client, this.options);

    const result = this.runner({ ctx, args, utils });
    return result;
  }
}
