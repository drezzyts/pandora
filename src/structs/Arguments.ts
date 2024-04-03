import { Channel, Client, GuildMember, Role, User } from "discord.js";
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
  GetPrimitiveType,
  GetExpectedType,
  RoleExpectType,
  UserExpectType,
  MemberExpectType,
} from "../types/arguments";
import { CommandUtils } from "./Utils";

export interface CommandArguments<Options extends CommandOption[]> {
  getUser(
    flags: ArgumentFlags<UserExpectType, Options, EntityType.User> & {
      expects: UserExpectType[] | "*";
    }
  ): User | null;
  getMember(
    flags: ArgumentFlags<MemberExpectType, Options, EntityType.Member> & {
      expects: MemberExpectType[] | "*";
    }
  ): GuildMember | null;
  getChannel(
    flags: ArgumentFlags<ChannelExpectType, Options, EntityType.Channel> & {
      expects: ChannelExpectType[] | "*";
    }
  ): Channel | null;
  getRole(
    flags: ArgumentFlags<RoleExpectType, Options, EntityType.Role> & {
      expects: RoleExpectType[] | "*";
    }
  ): Role | null;
  getString(
    flags: ArgumentFlags<undefined, Options, EntityType.String>
  ): string | null;
  getNumber(
    flags: ArgumentFlags<undefined, Options, EntityType.Number>
  ): number | null;
  getBoolean(
    flags: ArgumentFlags<undefined, Options, EntityType.Boolean>
  ): boolean | null;
}

export class Arguments<Options extends CommandOption[]>
  implements CommandArguments<Options>
{
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

  private validateEntity<T extends ExpectType, U extends EntityType>(
    value: GetPrimitiveType<U>,
    flags: ArgumentFlags<T, Options, U>
  ): GetPrimitiveType<U> | null {
    if (!flags.validate) return value;
    if (!value) return null;

    const isValidValue = flags.validate(value);
    return !!isValidValue ? value : null;
  }

  private isExpectedType<T extends ExpectType>(
    type: T,
    flags: ArgumentFlags<T, Options, any>
  ) {
    if (type && "expects" in flags) return flags.expects!.includes(type);
    return false;
  }

  public getMember(
    flags: ArgumentFlags<MemberExpectType, Options, EntityType.Member>
  ): GuildMember | null {
    if (this.utils.isInteractionContext(this.context)) {
      const member = this.context.interaction.options.getMember(flags.option as string) as GuildMember;
      return this.validateEntity(member, flags) || null;
    }
      
    if (flags.expects == "*")
      flags.expects = [
        MemberExpectType.Id,
        MemberExpectType.Mention,
        MemberExpectType.Username,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(MemberExpectType.Mention, flags)) {
      const member = this.getEntityByMention(EntityType.Member, flags);
      if (member) return this.validateEntity(member, flags) || null;
    }

    if (this.isExpectedType(MemberExpectType.Id, flags)) {
      const member = this.getEntityById(EntityType.Member, args, flags);
      if (member) return this.validateEntity(member, flags) || null;
    }

    if (this.isExpectedType(MemberExpectType.Username, flags)) {
      const member = this.getEntityByName(EntityType.Member, args, flags);
      if (member) return this.validateEntity(member, flags) || null;
    }

    return null;
  }

  public getUser(
    flags: ArgumentFlags<UserExpectType, Options, EntityType.User>
  ): User | null {
    if (this.utils.isInteractionContext(this.context)) {
      const user = this.context.interaction.options.getUser(flags.option as string) as User;
      return this.validateEntity(user, flags) || null;
    }
      
    if (flags.expects == "*")
      flags.expects = [
        UserExpectType.Id,
        UserExpectType.Mention,
        UserExpectType.Username,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(UserExpectType.Mention, flags)) {
      const user = this.getEntityByMention(EntityType.User, flags);
      if (user) return this.validateEntity(user, flags) || null;
    }

    if (this.isExpectedType(UserExpectType.Id, flags)) {
      const user = this.getEntityById(EntityType.User, args, flags);
      if (user) return this.validateEntity(user, flags) || null;
    }

    if (this.isExpectedType(UserExpectType.Username, flags)) {
      const user = this.getEntityByName(EntityType.User, args, flags);
      if (user) return this.validateEntity(user, flags) || null;
    }

    return null;
  }

  public getChannel(
    flags: ArgumentFlags<ChannelExpectType, Options, EntityType.Channel>
  ): Channel | null {
    if (this.utils.isInteractionContext(this.context)) {
      const channel = this.context.interaction.options.getChannel(
        flags.option as string
      ) as Channel;
      return this.validateEntity(channel, flags) || null;
    }

    if (flags.expects == "*")
      flags.expects = [
        ChannelExpectType.Id,
        ChannelExpectType.Mention,
        ChannelExpectType.Name,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(ChannelExpectType.Mention, flags)) {
      const channel = this.getEntityByMention(EntityType.Channel, flags);
      if (channel) return this.validateEntity(channel, flags) || null;
    }

    if (this.isExpectedType(ChannelExpectType.Id, flags)) {
      const channel = this.getEntityById(EntityType.Channel, args, flags);
      if (channel) return this.validateEntity(channel, flags) || null;
    }

    if (this.isExpectedType(ChannelExpectType.Name, flags)) {
      const channel = this.getEntityByName(EntityType.Channel, args, flags);
      if (channel) return this.validateEntity(channel, flags) || null;
    }

    return null;
  }

  public getRole(
    flags: ArgumentFlags<RoleExpectType, Options, EntityType.Role>
  ): Role | null {
    if (this.utils.isInteractionContext(this.context)) {
      const role = this.context.interaction.options.getRole(
        flags.option as string
      ) as Role;
      return this.validateEntity(role, flags) || null;
    }
      

    if (flags.expects == "*")
      flags.expects = [
        RoleExpectType.Id,
        RoleExpectType.Mention,
        RoleExpectType.Name,
      ];

    const args = this.parseArguments(this.context);

    if (this.isExpectedType(RoleExpectType.Mention, flags)) {
      const role = this.getEntityByMention(EntityType.Role, flags);
      if (role) return this.validateEntity(role, flags) || null;
    }

    if (this.isExpectedType(RoleExpectType.Id, flags)) {
      const role = this.getEntityById(EntityType.Role, args, flags);
      if (role) return this.validateEntity(role, flags) || null;
    }

    if (this.isExpectedType(RoleExpectType.Name, flags)) {
      const role = this.getEntityByName(EntityType.Role, args, flags);
      if (role) return this.validateEntity(role, flags) || null;
    }

    return null;
  }

  public getString(
    flags: ArgumentFlags<undefined, Options, EntityType.String>
  ): string | null {
    const string = this.getLiteral(EntityType.String, flags) as string;
    return this.validateEntity(string, flags) || null;
  }

  public getNumber(
    flags: ArgumentFlags<undefined, Options, EntityType.Number>
  ): number | null {
    const number = this.getLiteral(EntityType.Number, flags) as number;
    return this.validateEntity(number, flags) || null;
  }

  public getBoolean(
    flags: ArgumentFlags<undefined, Options, EntityType.Boolean>
  ): boolean | null {
    const boolean = this.getLiteral(EntityType.Boolean, flags) as boolean;
    return this.validateEntity(boolean, flags) || null;
  }

  private getLiteral<T extends EntityType, U extends GetPrimitiveType<T>>(
    entity: T,
    flags: ArgumentFlags<undefined, Options, T>
  ): U | null {
    const literals = [EntityType.String, EntityType.Number, EntityType.Boolean];

    if (!literals.includes(entity)) return null;

    if (this.utils.isInteractionContext(this.context)) {
      switch (entity) {
        case EntityType.String:
          return this.context.interaction.options.getString(
            flags.option
          ) as U | null;
        case EntityType.Number:
          return this.context.interaction.options.getNumber(
            flags.option
          ) as U | null;
        case EntityType.Boolean:
          return this.context.interaction.options.getBoolean(
            flags.option
          ) as U | null;
      }

      return null;
    }

    const parser =
      entity == EntityType.Number
        ? Number
        : entity == EntityType.Boolean
        ? Boolean
        : String;

    const args = this.parseArguments(this.context);

    if (typeof flags.position == "number") {
      const parsedEntity = parser(args[flags.position]);
      if (flags.validate)
        return flags.validate(parsedEntity as U) ? (parsedEntity as U) : null;
      return (parsedEntity as U) || null;
    }

    const validValue = args.find((arg) => parser(arg).toString() == arg);
    if (!validValue) return null;

    const value = parser(validValue);
    if (flags.validate) return flags.validate(value as U) ? (value as U) : null;
    return value as U;
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
    U extends GetPrimitiveType<T>
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

  private getEntityByName<T extends EntityType, U extends GetPrimitiveType<T>>(
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

  private getEntityById<T extends EntityType, U extends GetPrimitiveType<T>>(
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
