import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  CommandInteractionOption,
  Message,
} from "discord.js";
import {
  CommandConfig,
  CommandOption,
  CommandRunner,
  InteractionCommandContext,
  PrefixedCommandContext,
} from "../types/command";
import { Arguments } from "./Arguments";
import { Utils } from "./Utils";

export class HybridCommand<T extends CommandOption[]>
  implements CommandConfig<T>
{
  declare name: string;
  declare runner: CommandRunner<HybridCommand<T>["options"]>;
  declare options: T;

  public description?: string | undefined;

  public constructor(config: CommandConfig<T>) {
    Object.assign(this, config);
  }

  private normalizeOptions(): CommandInteractionOption[] {
    const normalizedOptions: CommandInteractionOption[] = new Array(
      this.options.length
    );

    this.options.forEach((option, i) => {
      const normalizedOptionType =
        ApplicationCommandOptionType[
          option.type as unknown as ApplicationCommandOptionType
        ];
      normalizedOptions[i] = {
        ...option,
        type: normalizedOptionType as unknown as ApplicationCommandOptionType,
      };
    });

    return normalizedOptions;
  }

  public toJSON() {
    const { name, description } = this;
    const options = this.normalizeOptions();
    
    return { name, description, options, type: ApplicationCommandType.ChatInput };
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
