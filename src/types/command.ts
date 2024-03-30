import { ChatInputCommandInteraction, Message } from "discord.js";
import { Command } from "../structs/Command";
import { CommandUtils } from "../structs/Utils";
import { CommandArguments } from "../structs/Arguments";
import { EntityType } from "./arguments";

export interface CommandConfig<T> {
  name: string;
  runner: CommandRunner<CommandConfig<T>["options"]>;
  options: T[];
}

export interface InteractionCommandContext {
  interaction: ChatInputCommandInteraction;
  command: Command<unknown>;
}

export interface PrefixedCommandContext {
  message: Message<true>;
  prefix: string;
  command: Command<unknown>;
}

export type CommandContext = InteractionCommandContext | PrefixedCommandContext;

export interface CommandExecutionData<T> {
  ctx: CommandContext;
  args: CommandArguments<T>;
  utils: CommandUtils;
}

export type CommandRunner<T> = (
  data: CommandExecutionData<T>
) => Promise<any> | any;
