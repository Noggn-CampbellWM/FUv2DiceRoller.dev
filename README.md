# FUv2DiceRoller.dev
FUv2DiceRoller.dev is the working build of a discord bot, designed to emulate dice resolution from the FreeformUniversal RPG from Perilplanet.com

If you want to try out the bot (and it's currently online) you can message FU Dice Bot#9180 on Discord.
You can also try out the bot at https://discord.gg/Tx6Qehr3ud as well as use the live version of the bot.  As of this time, the live version is, in the words of the caretaker, "A nameless abomination, a testament to my failures - it must be destroyed!"


Souce node_modules/discord.js/src/structures/ModalSubmitInteraction.js has been altered, original commented out and new added below.
Recieving values from select menus within modals is not yet supported but it is really cool.

   * Transforms component data to discord.js-compatible data
   * @param {*} rawComponent The data to transform
   * @returns {PartialTextInputData[]}
   *//*
  static transformComponent(rawComponent) {
    return rawComponent.components.map(c => ({
      value: c.value,
      type: MessageComponentTypes[c.type],
      customId: c.custom_id,
    }));
  }
  */
  // !!!This is custom from https://github.com/discordjs/discord.js/issues/8035. Original is above.
  static transformComponent(rawComponent) {
    return rawComponent.components.map(c => ({
      value: c.value ?? c.values,
      type: MessageComponentTypes[c.type],
      customId: c.custom_id,
    }));
  }
