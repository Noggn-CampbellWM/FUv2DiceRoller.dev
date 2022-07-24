function runActionFuHelp(interaction) {
    // Reply with private buttons for specific help.
    interaction.reply({
        content: "The FU Dice Bot supports multiple dice systems for, FU: the Freeform Universal RPG by Nathan Russell.\n\n/fu will invoke the FU2 Oracle.\n/fu-alt will invoke an Alternate FU Oracle.\n/fu-classic will invoke the Classic FU Oracle.\n\nPlease choose an option below to learn more about it.",
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