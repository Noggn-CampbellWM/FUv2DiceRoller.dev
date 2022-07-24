runGenDiceDefaultModal = (interaction) => {
    interaction.showModal({
      title: `Dice Roller Defaults`,
      customId: "diceDefaultModal",
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: "diceTypeDefault",
              options: [
                {
                  label: "Coin",
                  value: "2",
                  description: "A two-sided die"
                },
                {
                  label: "D4",
                  value: "4",
                  description: "A four-sided die"
                },
                {
                  label: "D6",
                  value: "6",
                  description: "A six-sided die"
                },
                {
                  label: "D8",
                  value: "8",
                  description: "An eight-sided die"
                },
                {
                  label: "D10",
                  value: "10",
                  description: "A ten-sided die"
                },
                {
                  label: "D12",
                  value: "12",
                  description: "A twelve-sided die"
                },
                {
                  label: "D20",
                  value: "20",
                  description: "A twenty-sided die",
                },
                {
                  label: "D100",
                  value: "100",
                  description: "A hundred-sided die"
                }
              ],
              placeholder: "Choose your default dice type",
              min_values: 1,
              max_values: 1
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: "rollTypeDefault",
              options: [
                {
                  label: "Modify total",
                  value: "total",
                  description: "Add modifier to grand total.",
                },
                {
                  label: "Modify each die",
                  value: "individual",
                  description: "Add modifier to each die individually."
                }
              ],
              placeholder: "Choose your default roll type",
              min_values: 1,
              max_values: 1
            }
          ]
        },
      ]
    })
    console.log(interaction.guild?.name === undefined ? "Context Dice Roll Default used in: DM" : "Context Dice Roll Default used in: " + interaction.guild?.name);
  };

  module.exports = { runGenDiceDefaultModal };