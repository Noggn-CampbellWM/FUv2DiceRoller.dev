const Discord = require("discord.js")
const { Client ,Intents } = require('discord.js');
const auth = require('./auth.json');
const clientinfo = require('./clientinfo.json');
const helpinfo = require('./helpinfo.json');

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// On startup...
client.on("ready", () => {
  console.log(`${client.user.tag} came online!`)

  const guildId = '992088891429503087'
  const guild = client.guilds.cache.get(guildId)
  let commands

  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application?.commands
  }

  // Register slash commands on Discord.
  commands?.create({
    id: 'fuV2Oracle',
    name: 'fu',
    description: 'Invokes the FU2 Oracle.',
    application_id: (clientinfo.clientid),
    options: [
      {
        name: 'action_dice',
        description: 'Amount of Action Dice.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
        minValue: 1,
        maxValue: 10,
      },
      {
        name: 'danger_dice',
        description: 'Amount of Danger Dice.',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
      },
      {
        name: 'action_message',
        description: 'Action description to be returned with the Oracle result.',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  })
  .then(console.log)
  .catch(console.error);

  commands?.create({
    id: 'fuClassicOracle',
    name: 'fu-classic',
    description: 'Invokes the FU Classic Oracle.',
    application_id: (clientinfo.clientid),
    options: [
      {
        name: 'modifier',
        description: 'Sum of positive and negative modifiers.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
      },
      {
        name: 'action_message',
        description: 'Action description to be returned with the Oracle result.',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  })
  .then(console.log)
  .catch(console.error);

  commands?.create({
    id: 'fuAltOracle',
    name: 'fu-alt',
    description: 'Invokes the FU Alternate Oracle.',
    application_id: (clientinfo.clientid),
    options: [
      {
        name: 'action_dice',
        description: 'Amount of Action Dice.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
      },
      {
        name: 'danger_dice',
        description: 'Amount of Danger Dice.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
      },
      {
        name: 'action_message',
        description: 'Action description to be returned with the Oracle result.',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  })
  .then(console.log)
  .catch(console.error);

  commands?.create({
    id: 'fuV2Help',
    name: 'fu-help',
    description: 'FUv2 Help.',
    application_id: (clientinfo.clientid),
  })
  .then(console.log)
  .catch(console.error);
});

// Listen for commands.
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  };

// FU2 Oracle
  const { commandName, options } = interaction;
  if (commandName === 'fu') {
    // Limit dice pool input to 10 per pool. I can't imagine this being an issue for anyone.
    const action_dice = Math.max(Math.min(options.getNumber('action_dice'),10),0) || 0;
    const danger_dice = Math.max(Math.min(options.getNumber('danger_dice'),10),0) || 0;
    
    const outOfRangeMsg =
    Math.max(Math.min(options.getNumber('action_dice'),10),-10) === options.getNumber('action_dice')
    ||
    Math.max(Math.min(options.getNumber('danger_dice'),10),-10) === options.getNumber('danger_dice')
    ? "" : "\n*Your dice pool has been capped at 10 for each type.*";
    

    // Shrink Action Messages in excess of 255 characters.
    const optActionMessage = options.getString('action_message') || '';
    const action_message = '' || (
      optActionMessage.substring(0,255).trim().length === optActionMessage.length ?
      optActionMessage.trim()
      :
      optActionMessage.substring(0,255).trim() + "...");

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
        content: actionString + oracleText + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]"+ outOfRangeMsg,
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
  }

  else if (commandName === 'fu-classic') {
    const modifier = Math.max(Math.min(options.getNumber('modifier'),10),-10) || 0;
    const optActionMessage = options.getString('action_message') || '';

    const action_message = '' || (
      optActionMessage.substring(0,255).trim().length === optActionMessage.length ?
      optActionMessage.trim()
      :
      optActionMessage.substring(0,255).trim() + "...");

    const rollArray = [];
    const rollType = (() => {
      if (modifier < 0) {return "Worst of "} else
      if (modifier == 0) {return "Result "} else
      if (modifier > 0) {return "Best of "};
    })();
    

    const outOfRangeMsg =
    Math.max(Math.min(options.getNumber('modifier'),10),-10) === options.getNumber('modifier') ? "" : "\n*Your dice pool has been capped at 10.*";

    console.log('someone used fuClassic Oracle.');

    //rollArray.push([1]);
    
    for (let i=0; i<Math.abs(modifier > -1? modifier + 1: modifier); i++) {
      rollArray.push(Math.round((Math.random()*5)+1))
    };

    const actionResults = rollArray.toString();

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

    /*
    console.log(rollArray);
    console.log(modifier);
    console.log(action_message.trim().toString());
    */

    function oracleInteraction(oracleText) {
      const actionString = action_message.trim().toString() == '' ? '' : '*' + action_message.trim().toString() + '*\n';
      interaction.reply({
        content: actionString + oracleText + "\n" + rollType +"[" + actionResults.toString() + "]" + outOfRangeMsg,
        ephemeral: false,
      })
    };

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
  }

  else if (commandName === 'fu-alt') {
    const action_dice = Math.max(Math.min(options.getNumber('action_dice'),10),0) || 0;
    const danger_dice = Math.max(Math.min(options.getNumber('danger_dice'),10),0) || 0;
    const optActionMessage = options.getString('action_message') || '';

    const action_message = '' || (
      optActionMessage.substring(0,255).trim().length === optActionMessage.length ?
      optActionMessage.replaceAll('*','').trim()
      :
      optActionMessage.replaceAll('*','').substring(0,255).trim() + "...");

    const actionArray = [];
    const dangerArray = [];

    const outOfRangeMsg =
    Math.max(Math.min(options.getNumber('action_dice'),10),-10) === options.getNumber('action_dice')
    ||
    Math.max(Math.min(options.getNumber('danger_dice'),10),-10) === options.getNumber('danger_dice')
    ? "" : "\n*Your dice pool has been capped at 10 for each type.*";

    console.log('someone used fu Alternate Oracle.');

    //actionArray.push([1]);
    
    for (let i=0; i<action_dice; i++) {
      actionArray.push(Math.round((Math.random()*5)+1))
    };
    for (let i=0; i<danger_dice; i++) {
      dangerArray.push(Math.round((Math.random()*5)+1))
    };

    const actionResults = actionArray.toString();
    const dangerResults = dangerArray.toString();
    console.log("base action array:" + actionArray.sort());
    console.log("base danger array:" + dangerArray.sort());

    for (let i = 1; i <= 6; i++) {
      while(actionArray.sort().indexOf(i) > -1 && dangerArray.sort().indexOf(i) > -1) {
        actionArray.sort().splice(actionArray.sort().indexOf(i),1);
        dangerArray.sort().splice(dangerArray.sort().indexOf(i),1);
      };
    };

    
    console.log("action results:" + actionResults);
    console.log("danger results:" + dangerResults);
    console.log("action array:" + actionArray.sort());
    console.log("danger array:" + dangerArray.sort());
    console.log("action message:" + action_message.trim().toString());
    

    function oracleInteraction(oracleText) {
      const actionString = action_message.trim().toString() == '' ? '' : '*' + action_message.trim().toString() + '*\n';
      return interaction.reply({
        content: actionString + oracleText + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]"+ outOfRangeMsg,
        ephemeral: false,
      })
    };

    const actionMax = actionArray.sort()[actionArray.length - 1] || -1;
    const dangerMax = dangerArray.sort()[dangerArray.length - 1] || -1; 
    const action2nd = actionArray.sort()[actionArray.length - 2] || -1;
    const danger2nd = dangerArray.sort()[dangerArray.length - 2] || -1;    

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

    console.log("altmagic:" + altMagic(actionArray,dangerArray));

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
        content: "***In time, you will know the tragic extent of my failings.***" + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]"+ outOfRangeMsg,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "***Remind Yourself That Overconfidence Is A Slow And Insidious Killer.***" + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]"+ outOfRangeMsg,
        ephemeral: true,
      });
    }
  }

  else if (commandName === 'fu-help') {
    interaction.reply({
      content: 'The FUv2 Dice Roller supports multiple FU dice systems.\n/fu will invoke the FU2 Oracle.\n/fu-alt will invoke the FU Alternate Oracle.\n/fu-classic will invoke the FU Classic Oracle.\nPlease choose one of the following options to learn more about it, including where to find the FU rules.',
      ephemeral: true,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "FU2 Oracle Help",
              style: 1,
              custom_id: "fu2Help"
            },
            {
              type: 2,
              label: "FU Alternate Help",
              style: 1,
              custom_id: "fuAltHelp"
            },
            {
              type: 2,
              label: "FU Classic Help",
              style: 1,
              custom_id: "fuClassicHelp"
            }
          ]
        }
      ]
    })
  }
});



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) {
    return
  };

  const buttonId = interaction.customId;
  if (buttonId === 'fu2Help') {
    interaction.reply({
      content: helpinfo.fu2,
      ephemeral: true,
    })
    console.log('someone used the help button.');
  }
  else if (buttonId === 'fuAltHelp') {
    interaction.reply({
      content: helpinfo.fuAlt,
      ephemeral: true,
    })
    console.log('someone used the alt help button.');
  }
  else if (buttonId === 'fuClassicHelp') {
    interaction.reply({
      content: helpinfo.fuClassic,
      ephemeral: true,
    })
    console.log('someone used the classic help button.');
  };
});

// Bot Token - Leave at end
client.login(auth.token)