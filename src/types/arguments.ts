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
  User = 'User',
  Channel = 'Channel',
  Role = 'Role',
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean'
}

export type GetExpectedType<T extends EntityType> = T extends EntityType.User
  ? UserExpectType
  : T extends EntityType.Channel
  ? ChannelExpectType
  : T extends EntityType.Role
  ? RoleExpectType
  : T extends EntityType.String  
  ? undefined 
  : T extends EntityType.Boolean
  ? undefined
  : T extends EntityType.Number
  ? undefined
  : never;

export type GetPrimitiveType<T extends EntityType> = T extends EntityType.User
  ? User
  : T extends EntityType.Channel
  ? Channel
  : T extends EntityType.Role
  ? Role
  : T extends EntityType.String  
  ? string 
  : T extends EntityType.Boolean
  ? boolean
  : T extends EntityType.Number
  ? number
  : never;

export type GetValidEntityOptions<T extends EntityType, U> = {
  [K in keyof U]: U[K] extends { name: string; type: infer V }
    ? V extends T
      ? U[K]["name"]
      : never
    : never;
};

export type ExpectType = UserExpectType | ChannelExpectType | RoleExpectType | undefined;

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
