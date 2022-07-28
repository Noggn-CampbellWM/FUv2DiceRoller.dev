function createCommands (Discord,client,clientinfo,pool) {
  // check to see if there is already an entry in oakleaf.public.bot_commands.name, for use when registering a new command with Discord.
  let checkCommandExists = async (cName) => {
    const res = await pool.query(`select bc.name from oakleaf.public.bot_commands bc where bc.name = '${cName}' fetch first 1 rows only`);
    if (res.rows.length === 0) {
      return null;
    } else {
      //console.log(res.rows[0].name)
      return res.rows[0].name
    };
  };

  module.exports = { checkCommandExists };

  //client.user.setUsername(clientinfo.botName); //Uncomment to update Bot Username.

  // Allow my server to get instant command updates.
  const guildId = '992088891429503087'
  const guild = client.guilds.cache.get(guildId)

  let commands
  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application?.commands
  }

  //commands.delete('1000188532733780170'); // Uncomment to delete specific command, accepts command "id". Do not include in production.

  // Register fu command with Discord.
  try {
    checkCommandExists('fu').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
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
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };

  // Register fu-alt command with Discord.
  try {
    checkCommandExists('fu-alt').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
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
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };

  // Register fu-classic command with Discord.
  try {
    checkCommandExists('fu-classic').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
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
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };

  // Register fu-help command with Discord.
  try {
    checkCommandExists('fu-help').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
          commands?.create({
            id: 'fuV2Help',
            name: 'fu-help',
            description: 'FUv2 Help.',
            application_id: (clientinfo.clientid)
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };

  // Register Roll Dice USER command with Discord.
  try {
    checkCommandExists('Roll Dice').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
          commands?.create({
            id: 'fuRollDice',
            name: 'Roll Dice',
            type: Discord.Constants.ApplicationCommandTypes.USER,
            application_id: (clientinfo.clientid)
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };

  // Register fu-dice command with Discord.
  try {
    checkCommandExists('fu-roll').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
          commands?.create({
            id: 'fuDiceRoll1',
            name: 'fu-roll',
            description: 'Invokes the dice roller.',
            application_id: (clientinfo.clientid),
            options: [
              {
                name: 'dice_number',
                description: 'Amount of Dice.',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
                minValue: 1,
                maxValue: 99,
              },
              {
                name: 'dice_type',
                description: 'Type of dice.',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
                choices: [
                  {
                    name: "coin",
                    value: 2
                  },
                  {
                    name: "d4",
                    value: 4
                  },
                  {
                    name: "d6",
                    value: 6
                  },
                  {
                    name: "d8",
                    value: 8
                  },
                  {
                    name: "d10",
                    value: 10
                  },
                  {
                    name: "d12",
                    value: 12
                  },
                  {
                    name: "d20",
                    value: 20
                  },
                  {
                    name: "d100",
                    value: 100
                  },
                  {
                    name: "fate_dice",
                    value: 3
                  }
                ]
              },
              {
                name: 'dice_mod',
                description: 'Modifier to roll.',
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
                minValue: -99,
                maxValue: 99
              },
              {
                name: 'roll_type',
                description: 'How the modifier is applied.',
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
                choices: [
                  {
                    name: "modify_total",
                    value: "total"
                  },
                  {
                    name: "modify_each",
                    value: "individual"
                  }
                ]
              },
              {
                name: 'exploding_dice',
                description: 'Do the dice explode?.',
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
                choices: [
                  {
                    name: "explode_top_2",
                    value: 2
                  },
                  {
                    name: "explode_top_1",
                    value: 1
                  },
                  {
                    name: "standard_roll",
                    value: 0
                  }
                ]
              }
            ]
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };


  // Register Defaults USER command with Discord.
  try {
    checkCommandExists('Set Defaults').then(results => { //This should really be in a seperate js (Change to current application:name or 'UPDATE' if any of the options change.)
      if (results === null) {
        try {
          // BEGIN unique
          commands?.create({
            id: 'setDefaults',
            name: 'Set Defaults',
            type: Discord.Constants.ApplicationCommandTypes.USER,
            application_id: (clientinfo.clientid)
          // END unique
          }).then(commands => {
            pool.query(
              `INSERT INTO bot_commands(id, name, description, type, application_id) 
              VALUES(${commands.id}, '${commands.name}', '${commands.description}', '${commands.type}', ${clientinfo.clientid}) 
              ON CONFLICT (id) DO UPDATE 
              SET name = excluded.name,
                  description = excluded.description,
                  type = excluded.type,
                  application_id = excluded.application_id;`,
              (err,res) => {
                console.log(err,res);
              }
            );
          })
          .then();
        } catch(err) {
          console.log(err.stack);
        }
      } else {
        return;
      }
    })
  } catch(err) {
    console.log(err.stack);
  };
};
module.exports = { createCommands };