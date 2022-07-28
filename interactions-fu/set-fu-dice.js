async function runDiceDefaults (interaction,pool) {
    const modDefaultDiceType = interaction.fields.getField("diceTypeDefault").value[0];
    const modDefaultRollType = interaction.fields.getField("rollTypeDefault").value[0];
    const modDefaultExploding = interaction.fields.getField("explodingDiceDefault").value[0];
    const modDefaultDiceNumber = interaction.fields.getTextInputValue("diceNumberDefault").replace(/[^\d.-]/g, '');
    const modDefaultDiceUser = interaction.user.id;

    try {
      pool.query(
        `INSERT INTO bot_user_defaults(id, dice_type, roll_type, dice_number, exploding_dice) 
        VALUES(${modDefaultDiceUser}, '${modDefaultDiceType}', '${modDefaultRollType}', '${modDefaultDiceNumber}', '${modDefaultExploding}') 
        ON CONFLICT (id) DO UPDATE 
        SET dice_type = excluded.dice_type,
            roll_type = excluded.roll_type,
            dice_number = excluded.dice_number,
            exploding_dice = excluded.exploding_dice;`,
      );
    } catch(err) {
      console.log(err.stack);
    };
    
    interaction.reply({
      content: `You(ID:${modDefaultDiceUser}) set your defaults to;\nDice Number: ${modDefaultDiceNumber}\nDice type: D${modDefaultDiceType}\nModifier type: ${modDefaultRollType}\nExplode type: ${modDefaultExploding}`,
      ephemeral: true,
      
    })
    console.log(interaction.guild?.name === undefined ? "Default Modal submitted in: DM" : "Default Modal submitted in: " + interaction.guild?.name);
};

module.exports = { runDiceDefaults };