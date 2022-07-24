function runOracleFuClassic (options,interaction) {
    // Retrieve dice pools and message.
    const modifier = options.getNumber('modifier') || 0;
    let action_message
      if (options.getString('action_message')?.length > 240) {
        action_message = options.getString('action_message')?.substring(0,240).trim() + "..."
      } else {
        action_message = options.getString('action_message')?.trim() || ''
      };
    
    // Create the dice pool.
    const rollArray = [];

    // Roll the dice.
    for (let i=0; i<Math.abs(modifier > -1? modifier + 1: modifier); i++) {
      rollArray.push(Math.round((Math.random()*5)+1))
    };

    // Save the raw dice pool for inclusion in the reply.
    const actionResults = rollArray.toString();

    // Sort the dice in the order required for the Oracle.
    const sortOrder = modifier > -1 ? [6,4,2,5,3,1] : [1,3,5,2,4,6];

    const applyCustomOrder = (arr, desiredOrder) => {
      const orderForIndexVals = desiredOrder.slice(0).reverse();
      arr.sort((a, b) => {
        const aIndex = -orderForIndexVals.indexOf(a);
        const bIndex = -orderForIndexVals.indexOf(b);
        return aIndex - bIndex;
      });
    };

    applyCustomOrder(rollArray, sortOrder);

    // The format of the reply.
    function oracleInteraction(oracleText) {
      const rollType = (() => {
        if (modifier < 0) {return "Worst of "} else
        if (modifier == 0) {return "Result "} else
        if (modifier > 0) {return "Best of "};
      })();
      
      const actionString = action_message.trim().toString() == '' ? '' : '*' + action_message.trim().toString() + '*\n';
      interaction.reply({
        content: actionString + oracleText + "\n" + rollType +"[" + actionResults.toString() + "]",
        ephemeral: false,
      })
    };

    // Reply based on dice results, the actual reply itself is above.
    if (rollArray.at(0) == 1) {
      oracleInteraction("**No and...**  You fail and things get much worse.");
    }
    else if(rollArray.at(0) == 3) {
      oracleInteraction("**No...**  You fail.");
    }
    else if(rollArray.at(0) == 5) {
      oracleInteraction("**No but...**  You fail, just.");
    }
    else if(rollArray.at(0) == 2) {
      oracleInteraction("**Yes but...**  You succeed, but at a cost.");
    }
    else if(rollArray.at(0) == 4) {
      oracleInteraction("**Yes...**  You succeed.");
    }
    else if(rollArray.at(0) == 6) {
      oracleInteraction("**Yes and...**  You succeed and gain some other advantage.");
    };
};

module.exports = { runOracleFuClassic };