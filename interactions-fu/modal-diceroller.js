async function runGenDiceModal(interaction,pool) {

  const modDefaultDiceUser = interaction.user.id;
  
  let checkUserExists = async (uID) => {
  try {
    const res = await pool.query(`select bu.id, bu.dice_type, bu.roll_type, bu.dice_number, bu.exploding_dice, bu.dice_sort from oakleaf.public.bot_user_defaults bu where bu.id = ${uID} fetch first 1 rows only`);
    if (res.rows.length === 0) {
      let dDice = "20",
          dRoll = "total",
          dNumber = "1",
          dExplode = "0",
          dSort = "true";
      return { dDice , dRoll , dNumber , dExplode , dSort };
    } else {
      let dDice = res.rows[0].dice_type,
          dRoll = res.rows[0].roll_type,
          dNumber = res.rows[0].dice_number,
          dExplode = res.rows[0].exploding_dice,
          dSort = res.rows[0].dice_sort;
      return { dDice , dRoll , dNumber , dExplode , dSort};
    };
    } catch(err) {
      console.log(err.stack);
    };
  };

  const { dDice , dRoll , dNumber , dExplode , dSort} = await checkUserExists(modDefaultDiceUser);

  //console.log(interaction.user.id);
  //console.log(dDice);
  //console.log(dRoll);


  interaction.showModal({
    title: "Traditional Dice Roller",
    customId: "diceModal",
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "diceNumber",
            label: "How many dice?",
            style: 1,
            min_length: 1,
            max_length: 2,
            value: dNumber,
            placeholder: "1",
            required: false
          }
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: "diceType",
            options: [
              {
                label: "Coin",
                value: "2",
                description: "A two-sided die",
                default: Boolean(dDice == "2")
              },
              {
                label: "D4",
                value: "4",
                description: "A four-sided die",
                default: Boolean(dDice == "4")
              },
              {
                label: "D6",
                value: "6",
                description: "A six-sided die",
                default: Boolean(dDice == "6")
              },
              {
                label: "D8",
                value: "8",
                description: "An eight-sided die",
                default: Boolean(dDice == "8")
              },
              {
                label: "D10",
                value: "10",
                description: "A ten-sided die",
                default: Boolean(dDice == "10")
              },
              {
                label: "D12",
                value: "12",
                description: "A twelve-sided die",
                default: Boolean(dDice == "12")
              },
              {
                label: "D20",
                value: "20",
                description: "A twenty-sided die",
                default: Boolean(dDice == "20")
              },
              {
                label: "D100",
                value: "100",
                description: "A hundred-sided die",
                default: Boolean(dDice == "100")
              },
              {
                label: "Fate",
                value: "3",
                description: "Fate dice",
                default: Boolean(dDice == "3")
              }
            ],
            placeholder: "Choose your dice type",
            min_values: 1,
            max_values: 1
          }
        ]
      },
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "diceMod",
            label: "Modifier to the roll",
            style: 1,
            min_length: 1,
            max_length: 3,
            placeholder: "0",
            required: false
          }
        ]
      },
      {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: "rollType",
            options: [
              {
                label: "Modify total",
                value: "total",
                description: "Add modifier to grand total.",
                default: Boolean(dRoll == "total")
              },
              {
                label: "Modify each die",
                value: "individual",
                description: "Add modifier to each die individually.",
                default: Boolean(dRoll == "individual")
              }
            ],
            placeholder: "Choose your roll type",
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
            custom_id: "explodingDice",
            options: [
              {
                label: "Exploding Dice: Top 1",
                value: "1",
                description: "Explode dice on a max result.",
                default: Boolean(dExplode == "1")
              },
              {
                label: "Exploding Dice: Top 2",
                value: "2",
                description: "Explode dice on the top two results.",
                default: Boolean(dExplode == "2")
              },
              {
                label: "Standard Roll",
                value: "0",
                description: "Do not explode dice.",
                default: Boolean(dExplode == "0")
              }
            ],
            placeholder: "Choose your roll type",
            min_values: 1,
            max_values: 1
          }
        ]
      }
    ]
  })
  console.log(interaction.guild?.name === undefined ? "Context Dice Roll used in: DM" : "Context Dice Roll used in: " + interaction.guild?.name);
};

  module.exports = { runGenDiceModal };