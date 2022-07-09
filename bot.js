const Discord = require("discord.js")
const { Client ,Intents } = require('discord.js');
const auth = require('./auth.json');
const clientinfo = require('./clientinfo.json');

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

  commands?.create({
    id: 'fuV2Oracle',
    name: 'fu',
    description: 'Invokes the FU Oracle.',
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
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName, options } = interaction;
  if (commandName === 'fu') {
    const action_dice = options.getNumber('action_dice') || 0;
    const danger_dice = options.getNumber('danger_dice') || 0;
    const action_message = options.getString('action_message') || '';
    const actionArray = [];
    const dangerArray = [];
    
    for (let i=0; i<action_dice; i++) {
      actionArray.push(Math.round((Math.random()*5)+1))
    };
    for (let i=0; i<danger_dice; i++) {
      dangerArray.push(Math.round((Math.random()*5)+1))
    };

    const actionResults = actionArray.toString();
    const dangerResults = dangerArray.toString();

    for (let i = 1; i <= 6; i++) {
      while(actionArray.sort().indexOf(i) > -1 && dangerArray.sort().indexOf(i) > -1) {
        actionArray.sort().splice(actionArray.sort().indexOf(i),1);
        dangerArray.sort().splice(dangerArray.sort().indexOf(i),1);
      };
    };
    
    /*
    console.log(actionResults);
    console.log(dangerResults);
    console.log(actionArray);
    console.log(dangerArray);
    console.log(action_message.trim().toString());
    */

    function oracleInteraction(oracleText) {
      interaction.reply({
        content: oracleText + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]",
        ephemeral: false,
      })
    };

    if (actionArray.length == 0) {
      oracleInteraction("**No and...**  You fail and things get much worse.\nAction Dice[");
    }
    else if (Math.max(...actionArray.sort()) == 1) {
      oracleInteraction("**No and...**  You fail and things get much worse.\nAction Dice[");
    }
    else if(Math.max(...actionArray.sort()) == 2) {
      oracleInteraction("**No...**  You fail.\nAction Dice[");
    }
    else if(Math.max(...actionArray.sort()) == 3) {
      oracleInteraction("**No but...**  You fail, just.\nAction Dice[");
    }
    else if(Math.max(...actionArray.sort()) == 4) {
      oracleInteraction("**Yes but...**  You succeed, but at a cost.\nAction Dice[");
    }
    else if(Math.max(...actionArray.sort()) == 5) {
      oracleInteraction("**Yes...**  You succeed.\nAction Dice[");
    }
    else if(Math.max(...actionArray.sort()) == 6) {
      oracleInteraction("**Yes and...**  You succeed and gain some other advantage\nAction Dice[");
    };
  }
});

// Bot Token - Leave at end
client.login(auth.token)