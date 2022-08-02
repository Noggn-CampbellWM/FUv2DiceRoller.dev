const Discord = require("discord.js")
const { Client , Intents } = require('discord.js');
// Bot Info
const auth = require('./auth.json');
const clientinfo = require('./clientinfo.json');
// Help Info
const helpinfo = require('./helpinfo.json');
// DB Info
const {Pool} = require('pg');
const dbConnection = require('./dbConfig.json');
// Command Registration Info
const commandList = require('./create-commands');
// Bot Interactions
const oracleFuAlt = require('./interactions-fu/oracle-fu-alt.js');
const oracleFuClassic = require('./interactions-fu/oracle-fu-classic.js');
const oracleFu2 = require('./interactions-fu/oracle-fu2.js');
const oracleRoller = require('./interactions-fu/oracle-fu-roll.js');
const actionFuHelp = require('./interactions-fu/action-fu-help.js');
const buttonFu = require('./interactions-fu/button-fu.js');
const genDiceModal = require('./interactions-fu/modal-diceroller.js');
const oracleFuDice = require('./interactions-fu/oracle-fu-dice.js');
const genDiceDefaultModal = require('./interactions-fu/modal-user-defaults.js');
const setDiceDefault = require('./interactions-fu/set-fu-dice.js');
const oracleCustomDice = require('./interactions-fu/oracle-fu-custom.js');

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// "oakleaf" connection
const pool = new Pool({
  user: dbConnection.user,
  host: dbConnection.host,
  database: dbConnection.database,
  password: dbConnection.password,
  port: dbConnection.port
});

// On startup...
client.on("ready", () => {
  console.log(`${client.user.tag} came online!`);
  commandList.createCommands(Discord,client,clientinfo,pool);
});

// Listen for commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  };

  const { commandName, options } = interaction;

  if (commandName === 'fu') { // FU2 Oracle
    oracleFu2.runOracleFu2(options,interaction);
    console.log(interaction.guild?.name === undefined ? "fu cmd used in: DM" : "fu cmd used in: " + interaction.guild?.name); // remove before live
  } else if (commandName === 'fu-classic') { // FU Classic Oracle
    oracleFuClassic.runOracleFuClassic(options,interaction);
    console.log(interaction.guild?.name === undefined ? "fu-classic cmd used in: DM" : "fu-classic cmd used in: " + interaction.guild?.name); // remove before live
  } else if (commandName === 'fu-alt') { //FU-Alternate Oracle
    oracleFuAlt.runOracleFuAlt(options,interaction);
    console.log(interaction.guild?.name === undefined ? "fu-alt cmd used in: DM" : "fu-alt cmd used in: " + interaction.guild?.name); // remove before live
  } else if (commandName === 'fu-help') { // FU Help
    actionFuHelp.runActionFuHelp(interaction);
    console.log(interaction.guild?.name === undefined ? "fu-help cmd used in: DM" : "fu-help cmd used in: " + interaction.guild?.name); // remove before live
  } else if (commandName === 'fu-dice') { // Reply with modal to fu-dice
    genDiceModal.runGenDiceModal(interaction,pool);
  } else if (commandName === 'fu-roll') { // Reply with modal to fu-dice
    oracleRoller.runSlashRoller(options,interaction);
  } else if (commandName === 'fu-custom') { // Custom Oracle
    oracleCustomDice.runCustomRoller(options,interaction);
  };
});

// Listen for buttons
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) {
    return
  };
  buttonFu.runButtonFu(interaction,helpinfo);
});

// Reply with modal to context menu command.
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isContextMenu()) {
    return
  };

  const contextId = interaction.commandName;
  if (contextId === 'Roll Dice') {
    genDiceModal.runGenDiceModal(interaction,pool);
  } else if (contextId === 'Set Defaults') {
    genDiceDefaultModal.runGenDiceDefaultModal(interaction);
  };
});

// Reply to modal.
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) {
    return
  };

  const modalId = interaction.customId;

  if (modalId === 'diceModal') {
    oracleFuDice.runDiceRoller(interaction);
  } else if (modalId === 'diceDefaultModal') {
    setDiceDefault.runDiceDefaults(interaction,pool);
  };
});



// Bot Token - Leave at end
client.login(auth.botToken)