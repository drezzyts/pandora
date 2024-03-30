import { Command } from "./structs/Command";
import { EntityType } from "./types/arguments";

new Command({
  name: 'avatar',
  options: <const> [
    { name: 'user', type: EntityType.User },
  ],
  runner: ({ args, utils, ctx }) => {
    const user = args.getUser({ 
      expects: '*', 
      option: 'user', 
      filter: (user) => !user.bot, 
      position: 0 
    });

    if (!user) return utils.reply('Usuário inválido!');

    const avatar = user.displayAvatarURL({ extension: 'gif', size: 2048 });
    return utils.reply(avatar);
  }
})