# 💫 Pandora: Hybrid Command Framework for Discord.js

Pandora empowers you to create hybrid commands that seamlessly function as both slash commands and prefixed commands within your Discord bot, leveraging the power of discord.js.

## [🚀 Installation](https://npmjs.com/pandora.ts)

```bash
npm install pandora.ts
```

## 🗺️ Summary

* [Arguments: Extracting Information](#arguments-extracting-information)
  * [User](#user)
  * [Member](#member)
  * [Channel](#channel)
  * [Role](#role)
  * [Literals](#literals)
    * [String](#string)
    * [Number](#number)
    * [Boolean](#boolean)
* [Utils: Context-Aware Utilities](#utils-context-aware-utilities)
  * [isInteractionContext](#isinteractioncontext)
  * [isPrefixedContext](#isprefixedcontext)
* [Hybrid Command: Bridging the Gap](#hybrid-command-bridging-the-gap)
  * [Execution](#execution)
* [Normalizing Slash Commands](#normalizing-slash-commands)
* [Examples: Creating Hybrid Commands](#examples-creating-hybrid-commands)

## Arguments: Extracting Information

Pandora's `args` functionality allows you to retrieve data from options in slash commands or by parsing message content for prefixed commands. The `'*'` wildcard indicates that any value of the specified type is accepted.

### User

```typescript
_.getUser({
expects: UserExpectType[] | '*', // Expected format (ID, mention, username)
position: number | '*', // Position in message content
option: string, // Option name (for slash commands)
validate?: (user: User) => boolean // Optional validation function
}): User | null
```

* **UserExpectType:**
* `UserExpectType.Id`
* `UserExpectType.Mention`
* `UserExpectType.Username`

### Member

```typescript
_.getMember({
expects: MemberExpectType[] | '*',
position: number | '*',
option: string,
validate?: (member: GuildMember) => boolean
}): GuildMember | null
```

* **MemberExpectType:**
* `MemberExpectType.Id`
* `MemberExpectType.Mention`
* `MemberExpectType.Username`

### Channel

```typescript
_.getChannel({
expects: ChannelExpectType[] | '*',
position: number | '*',
option: string,
validate?: (channel: Channel) => boolean
}): Channel | null
```

* **ChannelExpectType:**
* `ChannelExpectType.Id`
* `ChannelExpectType.Mention`
* `ChannelExpectType.Name`

### Role

```typescript
_.getRole({
expects: RoleExpectType[] | '*',
position: number | '*',
option: string,
validate?: (role: Role) => boolean
}): Role | null
```

* **RoleExpectType:**
* `RoleExpectType.Id`
* `RoleExpectType.Mention`
* `RoleExpectType.Name`

### Literals

#### String

```typescript
_.getString({
position: number | '*',
option: string,
validate?: (value: string) => boolean
}): string | null
```

#### Number

```typescript
_.getNumber({
position: number | '*',
option: string,
validate?: (value: number) => boolean
}): number | null
```

#### Boolean

```typescript
_.getBoolean({
position: number | '*',
option: string,
validate?: (value: boolean) => boolean
}): boolean | null
```

## Utils: Context-Aware Utilities

Pandora provides utility functions that adapt to both slash and prefixed command contexts.

### isInteractionContext

```typescript
_.isInteractionContext(__context__): __context__ is InteractionContext;
```

* **Example:**

```typescript
if (_.isInteractionContext(context)) {
// Slash command specific code
}
```

### isPrefixedContext

```typescript
_.isPrefixedContext(__context__): __context__ is PrefixedContext;
```

* **Example:**

```typescript
if (_.isPrefixedContext(context)) {
// Prefixed command specific code
}
```

### Author

```typescript
_.author: User
```

* **Example:**

```typescript
const { username } = _.author // The command author username
```

## Hybrid Command: Bridging the Gap

The `HybridCommand` class is the core of building hybrid commands.

### Execution

* **Slash Commands:**

```typescript
<Client>.on('interactionCreate', (interaction) => {
if (!interaction.isChatInputCommand()) return;
// ... Interaction logic
<HybridCommand>.executeSlashCommand(interaction, <Client>);
});
```

* **Prefixed Commands:**

```typescript
<Client>.on('messageCreate', (message) => {
if (!message.inGuild()) return;
// ... Message logic
<HybridCommand>.executePrefixCommand(message, <prefix>, <Client>);
});
```

### Normalizing Slash Commands

Pandora's hybrid commands use a structure that requires normalization for Discord's API.

```typescript
<HybridCommand>.toJSON() // Returns a Discord-compatible slash command object
```

## Examples: Creating Hybrid Commands

* Simple example:

```ts
import { HybridCommand } from 'pandora.ts';

export default new HybridCommand({
  name: 'ping',
  aliases: ['pong'],
  description: 'Ping command!',
  options: [],
  runner: ({ utils }) => utils.reply('Pong!')
});
```

* Example with options:

```ts
import { HybridCommand, EntityType, UserExpectType } from 'pandora.ts';

export default new HybridCommand({
  name: 'avatar',
  aliases: ['av'],
  description: 'Avatar command!',
  options: <const> [
    { name: 'user', type: EntityType.User }
  ],
  runner: ({ args, utils }) => {
    const user = args.getUser({ 
      expects: [
        UserExpectType.Id,
        UserExpectType.Mention
      ],
      option: 'user',
      position: 0
    }) || utils.author;

    const avatar = user.displayAvatarURL();

    return utils.reply(avatar);
  }
});
```

* Example with command context exceptions:

```ts
import { HybridCommand } from 'pandora.ts';

export default new HybridCommand({
  name: 'ping',
  aliases: ['pong'],
  description: 'Ping command!',
  options: [],
  runner: async ({ ctx, utils }) => {
    await utils.reply('Pong!');
    
    if (utils.isInteractionContext(ctx)) 
      ctx.interaction.followUp('Runned with slash');

    if (utils.isPrefixedContext(ctx))
      ctx.message.channel.send('Runned with prefix');
  }
});

```
