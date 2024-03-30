import { Channel, Client, Role, User } from "discord.js";
import {
  CommandContext,
  CommandOption,
  PrefixedCommandContext,
} from "../types/command";
import {
  ArgumentFlags,
  ChannelExpectType,
  EntityType,
  ExpectType,
  GetDiscordEntity,
  GetExpectedType,
  RoleExpectType,
  UserExpectType,
} from "../types/arguments";
import { CommandUtils } from "./Utils";

export interface CommandArguments<Options extends CommandOption[]> {
  getUser(
    flags: ArgumentFlags<UserExpectType, Options, EntityType.User>
  ): User | null;
  getChannel(
    flags: ArgumentFlags<ChannelExpectType, Options, EntityType.Channel>
  ): Channel | null;
  getRole(
    flags: ArgumentFlags<RoleExpectType, Options, EntityType.Role>
  ): Role | null;
}

export class Arguments<Options extends CommandOption[]> implements CommandArguments<Options> {
  public constructor(
    private context: CommandContext<Options>,
    private utils: CommandUtils<Options>,
    private client: Client,
    public options: Options
  ) {}

  private parseArguments(context: PrefixedCommandContext<Options>) {
    return context.message.content
      .slice(context.prefix.length + context.command.name.length)
      .trim()
      .split(/ +/g);
  }

  private isExpectedType<T extends ExpectType>(
    type: T,
    flags: ArgumentFlags<T, Options, any>
  ) {
    return flags.expects.includes(type);
  }

  public getUser(
    flags: ArgumentFlags<UserExpectType, Options, EntityType.User>
  ): User | null {
    if (this.utils.isInteractionContext(this.context))
      return this.context.interaction.options.getUser(flags.option as string);

    if (flags.expects == "*")
      flags.expects = [
        UserExpectType.Id,
        UserExpectType.Mention,
        UserExpectType.Username,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(UserExpectType.Mention, flags)) {
      const user = this.getEntityByMention(EntityType.User, flags);
      if (user) return user;
    }

    if (this.isExpectedType(UserExpectType.Id, flags)) {
      const user = this.getEntityById(EntityType.User, args, flags);
      if (user) return user;
    }

    if (this.isExpectedType(UserExpectType.Username, flags)) {
      const user = this.getEntityByName(EntityType.User, args, flags);
      if (user) return user;
    }

    return null;
  }

  public getChannel(
    flags: ArgumentFlags<ChannelExpectType, Options, EntityType.Channel>
  ): Channel | null {
    if (this.utils.isInteractionContext(this.context))
      return this.context.interaction.options.getChannel(
        flags.option as string
      ) as Channel;

    if (flags.expects == "*")
      flags.expects = [
        ChannelExpectType.Id,
        ChannelExpectType.Mention,
        ChannelExpectType.Name,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(ChannelExpectType.Mention, flags)) {
      const channel = this.getEntityByMention(EntityType.Channel, flags);
      if (channel) return channel;
    }

    if (this.isExpectedType(ChannelExpectType.Id, flags)) {
      const channel = this.getEntityById(EntityType.Channel, args, flags);
      if (channel) return channel;
    }

    if (this.isExpectedType(ChannelExpectType.Name, flags)) {
      const channel = this.getEntityByName(EntityType.Channel, args, flags);
      if (channel) return channel;
    }

    return null;
  }

  public getRole(
    flags: ArgumentFlags<RoleExpectType, Options, EntityType.Role>
  ): Role | null {
    if (this.utils.isInteractionContext(this.context))
      return this.context.interaction.options.getRole(
        flags.option as string
      ) as Role;

    if (flags.expects == "*")
      flags.expects = [
        RoleExpectType.Id,
        RoleExpectType.Mention,
        RoleExpectType.Name,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(RoleExpectType.Mention, flags)) {
      const role = this.getEntityByMention(EntityType.Role, flags);
      if (role) return role;
    }

    if (this.isExpectedType(RoleExpectType.Id, flags)) {
      const role = this.getEntityById(EntityType.Role, args, flags);
      if (role) return role;
    }

    if (this.isExpectedType(RoleExpectType.Name, flags)) {
      const role = this.getEntityByName(EntityType.Role, args, flags);
      if (role) return role;
    }

    return null;
  }

  private getEntityCachePropertyName(entity: EntityType) {
    return entity == EntityType.User
      ? "users"
      : entity == EntityType.Role
      ? "roles"
      : entity == EntityType.Channel
      ? "channels"
      : null;
  }

  private getEntityByMention<
    T extends EntityType,
    U extends GetDiscordEntity<T>
  >(
    entity: T,
    flags: ArgumentFlags<GetExpectedType<T>, Options, T>
  ): U | undefined {
    if (this.utils.isInteractionContext(this.context)) return;

    const entityName = this.getEntityCachePropertyName(entity);
    if (!entityName) return;

    const collection = this.context.message.mentions[entityName];

    if (typeof flags.position == "number")
      return collection.at(flags.position) as U;

    return collection.first() as U;
  }

  private getEntityByName<T extends EntityType, U extends GetDiscordEntity<T>>(
    entity: T,
    args: string[],
    flags: ArgumentFlags<GetExpectedType<T>, Options, T>
  ): U | undefined {
    if (this.utils.isInteractionContext(this.context)) return;

    const entityName = this.getEntityCachePropertyName(entity);
    if (!entityName) return;

    const collection =
      entityName == "users"
        ? this.client.users.cache
        : this.context.message.guild[entityName].cache;
    const values = [...collection.values()];
    const propertyName = entityName == "users" ? "username" : "name";

    if (typeof flags.position == "number")
      return values.find(
        (e) =>
          e[propertyName as keyof typeof e] == args[flags.position as number]
      ) as U;

    const validName = args.find((arg) =>
      values.some((e) => e[propertyName as keyof typeof e] == arg)
    );
    if (!validName) return;

    return values.find(
      (e) => e[propertyName as keyof typeof e] == validName
    ) as U;
  }

  private getEntityById<T extends EntityType, U extends GetDiscordEntity<T>>(
    entity: T,
    args: string[],
    flags: ArgumentFlags<GetExpectedType<T>, Options, T>
  ): U | undefined {
    if (this.utils.isInteractionContext(this.context)) return;

    const entityName = this.getEntityCachePropertyName(entity);
    if (!entityName) return;

    const collection =
      entityName == "users"
        ? this.client.users.cache
        : this.context.message.guild[entityName].cache;
    const values = [...collection.values()];

    if (typeof flags.position == "number")
      return collection.get(args[flags.position]) as U;

    const validId = args.find((arg) => values.find((e) => e.id == arg));
    if (!validId) return;

    return values.find((e) => e.id == validId) as U;
  }
}
