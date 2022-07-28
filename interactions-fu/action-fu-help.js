function runActionFuHelp(interaction) {
    // Reply with private buttons for specific help.
    interaction.reply({
        content: "The FU Dice Bot supports multiple dice systems for, FU: the Freeform Universal RPG by Nathan Russell.\n\n/fu will invoke the FU2 Oracle.\n/fu-alt will invoke an Alternate FU Oracle.\n/fu-classic will invoke the Classic FU Oracle.\n\n/fu-roll will bring up a full service dice roller with options for all standard D# dice, as well as coin-flips, fate dice, and exploding dice.\nWhile using Discord on a PC, you can also call the dice roller in the Apps menu by right clicking on the bot, choosing Apps, and selecting 'Roll Dice'. In the Apps menu you can set your defaults for the Apps version of the dice roller. This will not set defaults for the /fu-roll command. \n\nPlease choose an option below to learn more about it.",
        ephemeral: true,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "FU2 Oracle Help",
                style: 1,
                custom_id: "fu2Help",
              },
              {
                type: 2,
                label: "FU Alternate Help",
                style: 1,
                custom_id: "fuAltHelp",
              },
              {
                type: 2,
                label: "FU Classic Help",
                style: 1,
                custom_id: "fuClassicHelp",
              },
              {
                type: 2,
                label: "About FU: the Freeform Universal RPG",
                style: 1,
                custom_id: "fuAbout",
              }
            ]
          }
        ]
      })
  };
  
  module.exports = { runActionFuHelp };