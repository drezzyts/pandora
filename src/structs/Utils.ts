import { InteractionResponse, Message } from "discord.js";
import { CommandContext, InteractionCommandContext, PrefixedCommandContext } from "../types/command";

export interface CommandUtils {
  isInteractionContext(context: CommandContext): context is InteractionCommandContext;
  isPrefixedContext(context: CommandContext): context is PrefixedCommandContext;
  reply(content: string): Promise<InteractionResponse<boolean>> | Promise<Message<boolean>>;
}

export class Utils implements CommandUtils {
  public constructor(private context: CommandContext) {}

  public isInteractionContext(context: CommandContext): context is InteractionCommandContext {
    if ('interaction' in context) 
      return true;
    return false;
  }

  public isPrefixedContext(context: CommandContext): context is PrefixedCommandContext {
    if ('message' in context) 
      return true;
    return false;
  }

  public reply(content: string) {
    if (this.isInteractionContext(this.context)) 
      return this.context.interaction.reply(content);
    return this.context.message.reply(content);
  }
}