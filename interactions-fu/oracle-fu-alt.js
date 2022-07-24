function runOracleFuAlt(options,interaction) {
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

  // Retrieve the max value and second highest value from each of the dice pools.
  const actionMax = actionArray.sort()[actionArray.length - 1] || -1;
  const dangerMax = dangerArray.sort()[dangerArray.length - 1] || -1; 
  const action2nd = actionArray.sort()[actionArray.length - 2] || -1;
  const danger2nd = dangerArray.sort()[dangerArray.length - 2] || -1;    

  // Translate dice arrays to oracle response
  function altMagic () {
    if (actionMax === -1 && dangerMax === -1) {
      return "escalation";
    }
    else if (actionMax === -1 || dangerMax === -1) {
      const magicResult = actionMax !== -1 ? "yes" : "no";
      return magicResult;
    }
    else if (actionMax > dangerMax) {
      const magicResult = action2nd > dangerMax ? "yesand" : "yesbut";
      return magicResult;
    }
    else if (actionMax < dangerMax) {
      const magicResult = danger2nd > actionMax ? "noand" : "nobut";
      return magicResult;
    } else {
      return "darkestError"
    }
  };

  // The format of the reply.
  function oracleInteraction(oracleText) {
    const actionString = action_message.trim().toString() == '' ? '' : '*' + action_message.trim().toString() + '*\n';
    return interaction.reply({
      content: actionString + oracleText + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]",
      ephemeral: false,
    })
  };

  // Reply based on dice results, the actual reply itself is above.
  if (altMagic() == "escalation") {
    oracleInteraction("**Escalation...** The unexpected happens.");
  }
  else if (altMagic() == "noand") {
    oracleInteraction("**No and...**  You fail and things get much worse.");
  }
  else if (altMagic() == "no") {
    oracleInteraction("**No...**  You fail.");
  }
  else if (altMagic() == "nobut") {
    oracleInteraction("**No but...**  You fail, just.");
  }
  else if (altMagic() == "yesbut") {
    oracleInteraction("**Yes but...**  You succeed, but at a cost.");
  }
  else if (altMagic() == "yes") {
    oracleInteraction("**Yes...**  You succeed.");
  }
  else if (altMagic() == "yesand") {
    oracleInteraction("**Yes and...**  You succeed and gain some other advantage.");
  }
  else if (altMagic() == "darkestError") {
    interaction.reply({
      content: "***Oracle Logic Error\nIn time, you will know the tragic extent of my failings.***" + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]",
      ephemeral: true,
    });
  } else {
    interaction.reply({
      content: "***Oracle Unknown Error\nRemind Yourself That Overconfidence Is A Slow And Insidious Killer.***" + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]",
      ephemeral: true,
    });
  }
};

module.exports = { runOracleFuAlt };