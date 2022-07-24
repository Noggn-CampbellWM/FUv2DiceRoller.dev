function runButtonFu(interaction,helpinfo) {
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
  };
  
  module.exports = { runButtonFu };