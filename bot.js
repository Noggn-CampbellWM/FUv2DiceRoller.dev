const Discord = require("discord.js")
const { Client ,Intents } = require('discord.js');
const fs = require('fs');
const fsPromises = require('fs').promises;
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
  try {
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
          type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
          minValue: 0,
          maxValue: 10,
        },
        {
          name: 'action_message',
          description: 'Action description to be returned with the Oracle result.',
          required: false,
          type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
          maxLength: 250,
        }
      ]
    }).then(commands => {
      const selected = (({type, name, description, id}) => ({type, name, description, id}))(commands);
      fs.promises.writeFile('commands.log', JSON.stringify(selected));
    });
  } catch(err) {
    console.log(err.stack);
  }
  try {
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
          type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
          minValue: -10,
          maxValue: 10,
        },
        {
          name: 'action_message',
          description: 'Action description to be returned with the Oracle result.',
          required: false,
          type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
          maxLength: 250,
        }
      ]
  }).then(commands => {
    const selected = (({type, name, description, id}) => ({type, name, description, id}))(commands);
    fs.promises.appendFile('commands.log',"\n" + JSON.stringify(selected));
  });
  } catch(err) {
  console.log(err.stack);
  }
  try {
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
          type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
          minValue: 1,
          maxValue: 10,
        },
        {
          name: 'danger_dice',
          description: 'Amount of Danger Dice.',
          required: true,
          type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
          minValue: 1,
          maxValue: 10,
        },
        {
          name: 'action_message',
          description: 'Action description to be returned with the Oracle result.',
          required: false,
          type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
          maxLength: 250,
        }
      ]
  }).then(commands => {
    const selected = (({type, name, description, id}) => ({type, name, description, id}))(commands);
    fs.promises.appendFile('commands.log',"\n" + JSON.stringify(selected));
  });
  } catch(err) {
  console.log(err.stack);
  }

  try {
    commands?.create({
      id: 'fuV2Help',
      name: 'fu-help',
      description: 'FUv2 Help.',
      application_id: (clientinfo.clientid),
  }).then(commands => {
    const selected = (({type, name, description, id}) => ({type, name, description, id}))(commands);
    fs.promises.appendFile('commands.log',"\n" + JSON.stringify(selected));
  });
  } catch(err) {
  console.log(err.stack);
  }
});

// Listen for commands.
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  };

  // FU2 Oracle
  const { commandName, options } = interaction;
  if (commandName === 'fu') {
    // Log usage by source. (do not include in production!)
    console.log(interaction.guild?.name === undefined ? "fu cmd used in: DM" : "fu cmd used in: " + interaction.guild?.name);

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
  }

  // FU Classic Oracle
  else if (commandName === 'fu-classic') {
    // Log usage by source. (do not include in production!)
    console.log(interaction.guild?.name === undefined ? "fu-classic cmd used in: DM" : "fu-classic cmd used in: " + interaction.guild?.name);

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
  }

  //FU-Alternate Oracle
  else if (commandName === 'fu-alt') {
    // Log usage by source. (do not include in production!)
    console.log(interaction.guild?.name === undefined ? "fu-alt cmd used in: DM" : "fu-alt cmd used in: " + interaction.guild?.name);

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
  }

  // FU Help
  else if (commandName === 'fu-help') {
    // Log usage by source (do not include in production!)
    console.log(interaction.guild?.name === undefined ? "fu-help cmd used in: DM" : "fu-help cmd used in: " + interaction.guild?.name);

    // Reply with private buttons for specific help.
    interaction.reply({
      content: "The FUv2 Dice Roller supports multiple FU dice systems.\n/fu will invoke the FU2 Oracle.\n/fu-alt will invoke the FU Alternate Oracle.\n/fu-classic will invoke the FU Classic Oracle.",
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
  }
});

// Reply to Help buttons with info contained in helpinfo.json.
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
    console.log(interaction.guild?.name === undefined ? "fu2Help button used in: DM" : "fu2Help button used in: " + interaction.guild?.name);
  }
  else if (buttonId === 'fuAltHelp') {
    interaction.reply({
      content: helpinfo.fuAlt,
      ephemeral: true,
    })
    console.log(interaction.guild?.name === undefined ? "fuAltHelp button used in: DM" : "fuAltHelp button used in: " + interaction.guild?.name);
  }
  else if (buttonId === 'fuClassicHelp') {
    interaction.reply({
      content: helpinfo.fuClassic,
      ephemeral: true,
    })
    console.log(interaction.guild?.name === undefined ? "fuClassicHelp button used in: DM" : "fuClassicHelp button used in: " + interaction.guild?.name);
  }
  else if (buttonId === 'fuAbout') {
    interaction.reply({
      content: helpinfo.fuAbout,
      ephemeral: true,
    })
    console.log(interaction.guild?.name === undefined ? "fuAbout button used in: DM" : "fuAbout button used in: " + interaction.guild?.name);
  };
});

// Bot Token - Leave at end
client.login(auth.botToken)