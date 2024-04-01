import { ChatInputCommandInteraction, Message } from "discord.js";
import { Command } from "../structs/Command";
import { CommandUtils } from "../structs/Utils";
import { CommandArguments } from "../structs/Arguments";
import { EntityType } from "./arguments";

export interface CommandOption {
  name: string,
  type: EntityType
}

export interface CommandConfig<T extends CommandOption[]> {
  name: string;
  runner: CommandRunner<CommandConfig<T>["options"]>;
  options: T;
}

export interface InteractionCommandContext<T extends CommandOption[]> {
  interaction: ChatInputCommandInteraction;
  command: Command<T>;
}

export interface PrefixedCommandContext<T extends CommandOption[]> {
  message: Message<true>;
  prefix: string;
  command: Command<T>;
}

export type CommandContext<T extends CommandOption[]> = InteractionCommandContext<T> | PrefixedCommandContext<T>;

export interface CommandExecutionData<T extends CommandOption[]> {
  ctx: CommandContext<T>;
  args: CommandArguments<T>;
  utils: CommandUtils<T>;
}

export type CommandRunner<T extends CommandOption[]> = (
  data: CommandExecutionData<T>
) => unknown;
