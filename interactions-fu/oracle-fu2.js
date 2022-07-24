function runOracleFu2 (options,interaction) {
    // Retrieve dice pools and message.
    const action_dice = options.getNumber('action_dice') || 0;
    const danger_dice = options.getNumber('danger_dice') || 0;
    let action_message
      if (options.getString('action_message')?.length > 240) {
        action_message = options.getString('action_message')?.substring(0,240).trim() + "..."
      } else {
        action_message = options.getString('action_message')?.trim() || ''
      };

    // Create the dice pools.
    const actionArray = [];
    const dangerArray = [];

    // Roll the dice.
    for (let i=0; i<action_dice; i++) {
      actionArray.push(Math.round((Math.random()*5)+1))
    };
    for (let i=0; i<danger_dice; i++) {
      dangerArray.push(Math.round((Math.random()*5)+1))
    };

    // Save the raw dice pools for inclusion in the reply.
    const actionResults = actionArray.toString();
    const dangerResults = dangerArray.toString();

    // Remove matching dice matches between the pools.
    for (let i = 1; i <= 6; i++) {
      while(actionArray.sort().indexOf(i) > -1 && dangerArray.sort().indexOf(i) > -1) {
        actionArray.sort().splice(actionArray.sort().indexOf(i),1);
        dangerArray.sort().splice(dangerArray.sort().indexOf(i),1);
      };
    };

    // The format of the reply.
    function oracleInteraction(oracleText) {
      const actionString = action_message.trim().toString() == '' ? '' : '*' + action_message.trim().toString() + '*\n';
      interaction.reply({
        content: actionString + oracleText + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]",
        ephemeral: false,
      })
    };

    // Reply based on dice results, the actual reply itself is above.
    if (actionArray.length == 0) {
      oracleInteraction("**Botch!\nNo and...**  You fail and things get much worse.");
    }
    else if (Math.max(...actionArray.sort()) == 1) {
      oracleInteraction("**No and...**  You fail and things get much worse.");
    }
    else if(Math.max(...actionArray.sort()) == 2) {
      oracleInteraction("**No...**  You fail.");
    }
    else if(Math.max(...actionArray.sort()) == 3) {
      oracleInteraction("**No but...**  You fail, just.");
    }
    else if(Math.max(...actionArray.sort()) == 4) {
      oracleInteraction("**Yes but...**  You succeed, but at a cost.");
    }
    else if(Math.max(...actionArray.sort()) == 5) {
      oracleInteraction("**Yes...**  You succeed.");
    }
    else if(Math.max(...actionArray.sort()) == 6) {
      oracleInteraction("**Yes and...**  You succeed and gain some other advantage.");
    };
};

module.exports = { runOracleFu2 };