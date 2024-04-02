import { User, Channel, Role, GuildMember } from "discord.js";

export enum UserExpectType {
  Username = "Username",
  Mention = "Mention",
  Id = "Id",
}

export enum MemberExpectType {
  Username = "Username",
  Mention = "Mention",
  Id = "Id",
}

export enum ChannelExpectType {
  Name = "Name",
  Mention = "Mention",
  Id = "Id",
}

export enum RoleExpectType {
  Name = "Name",
  Mention = "Mention",
  Id = "Id",
}

export enum EntityType {
  User = 'User',
  Member = 'Member',
  Channel = 'Channel',
  Role = 'Role',
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean'
}

export interface MappedExpectedType {
  [EntityType.User]: UserExpectType;
  [EntityType.Member]: MemberExpectType;
  [EntityType.Channel]: ChannelExpectType;
  [EntityType.Role]: RoleExpectType;
  [EntityType.String]: undefined;
  [EntityType.Number]: undefined;
  [EntityType.Boolean]: undefined;
}

export interface MappedPrimitiveType {
  [EntityType.User]: User;
  [EntityType.Member]: GuildMember;
  [EntityType.Channel]: Channel;
  [EntityType.Role]: Role;
  [EntityType.String]: string;
  [EntityType.Number]: number;
  [EntityType.Boolean]: boolean;
}

export type GetExpectedType<T extends EntityType> = MappedExpectedType[T];
export type GetPrimitiveType<T extends EntityType> =  MappedPrimitiveType[T];

export type GetValidEntityOptions<T extends EntityType, U> = {
  [K in keyof U]: U[K] extends { name: string; type: infer V }
    ? V extends T
      ? U[K]["name"]
      : never
    : never;
};

export type ExpectType = UserExpectType | ChannelExpectType | RoleExpectType | MemberExpectType | undefined;

export type ArgumentValidator<T extends EntityType> = (val: GetPrimitiveType<T>) => boolean;

export interface ArgumentFlags<T extends ExpectType, U, V extends EntityType> {
  expects?: T[] | "*";
  position: number | "*";
  validate?: ArgumentValidator<V>;
  option: GetValidEntityOptions<V, U> extends infer U
    ? U extends Array<unknown>
      ? U[number]
      : never
    : never;
}
