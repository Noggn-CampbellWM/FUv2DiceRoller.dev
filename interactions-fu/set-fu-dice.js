async function runDiceDefaults (interaction,pool) {
    const modDefaultDiceType = interaction.fields.getField("diceTypeDefault").value[0];
    const modDefaultRollType = interaction.fields.getField("rollTypeDefault").value[0];
    const modDefaultDiceUser = interaction.user.id;

    try {
      pool.query(
        `INSERT INTO bot_user_defaults(id, dice_type, roll_type) 
        VALUES(${modDefaultDiceUser}, '${modDefaultDiceType}', '${modDefaultRollType}') 
        ON CONFLICT (id) DO UPDATE 
        SET dice_type = excluded.dice_type,
            roll_type = excluded.roll_type;`,
      );
    } catch(err) {
      console.log(err.stack);
    };
    
    interaction.reply({
      content: `You(ID:${modDefaultDiceUser}) set your default dice type to "D${modDefaultDiceType}" and your default roll type to "${modDefaultRollType}".`,
      ephemeral: true,
      
    })
    console.log(interaction.guild?.name === undefined ? "Default Modal submitted in: DM" : "Default Modal submitted in: " + interaction.guild?.name);
};

module.exports = { runDiceDefaults };