import { InteractionResponse, Message } from "discord.js";
import { CommandContext, CommandOption, InteractionCommandContext, PrefixedCommandContext } from "../types/command";

export interface CommandUtils<T extends CommandOption[]> {
  isInteractionContext(context: CommandContext<T>): context is InteractionCommandContext<T>;
  isPrefixedContext(context: CommandContext<T>): context is PrefixedCommandContext<T>;
  reply(content: string): Promise<InteractionResponse<boolean>> | Promise<Message<boolean>>;
}

export class Utils<T extends CommandOption[]> implements CommandUtils<T> {
  public constructor(private context: CommandContext<T>) {}

  public isInteractionContext(context: CommandContext<T>): context is InteractionCommandContext<T> {
    return 'interaction' in context;
  }

  public isPrefixedContext(context: CommandContext<T>): context is PrefixedCommandContext<T> {
    return 'message' in context;
  }

  public reply(content: string) {
    if (this.isInteractionContext(this.context)) 
      return this.context.interaction.reply(content);
    return this.context.message.reply(content);
  }
}