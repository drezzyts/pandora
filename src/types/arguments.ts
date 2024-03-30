import { User, Channel, Role } from "discord.js";

export enum UserExpectType {
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
  User,
  Channel,
  Role,
}

export type GetExpectedType<T extends EntityType> = T extends EntityType.User
  ? UserExpectType
  : T extends EntityType.Channel
  ? ChannelExpectType
  : T extends EntityType.Role
  ? RoleExpectType
  : never;

export type GetDiscordEntity<T extends EntityType> = T extends EntityType.User
  ? User
  : T extends EntityType.Channel
  ? Channel
  : T extends EntityType.Role
  ? Role
  : never;

export type GetValidEntityOptions<T extends EntityType, U> = {
  [K in keyof U]: U[K] extends { name: string; type: infer V }
    ? V extends T
      ? U[K]["name"]
      : never
    : never;
};

export type ExpectType = UserExpectType | ChannelExpectType | RoleExpectType;

export type ArgumentValidator<T extends EntityType> = (val: GetDiscordEntity<T>) => boolean;

export interface ArgumentFlags<T extends ExpectType, U, V extends EntityType> {
  expects: T[] | "*";
  position: number | "*";
  validate?: ArgumentValidator<V>;
  option: GetValidEntityOptions<V, U> extends infer U
    ? U extends Array<unknown>
      ? U[number]
      : never
    : never;
}
