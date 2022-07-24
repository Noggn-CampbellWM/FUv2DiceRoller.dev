async function runDiceRoller (interaction) {
    const modDiceAmmt = Number(interaction.fields.getTextInputValue("diceNumber").replace(/[^\d.-]/g, '')) || 1;
    const modDiceType = Number(interaction.fields.getField("diceType").value[0], 10)-1;
    const modDiceTypeBase = interaction.fields.getField("diceType").value[0];
    const modDiceMod = Number(interaction.fields.getTextInputValue("diceMod").replace(/[^\d.-]/g, '')) || 0;
    const modRollType = interaction.fields.getField("rollType").value[0];
    const modDiceRoller = interaction.member?.nickname || interaction.user.username;
    

    let diceSymbol = () => {
      if(modDiceTypeBase == '2') {
        return '❍';
      } else if (modDiceTypeBase == '4') {
        return '◁';
      } else if (modDiceTypeBase == '6') {
        return '▢';
      } else if (modDiceTypeBase == '8') {
        return '☒';
      } else if (modDiceTypeBase == '10') {
        return '⬙';
      } else if (modDiceTypeBase == '12') {
        return '⭔';
      } else if (modDiceTypeBase == '20') {
        return '⬡';
      } else if (modDiceTypeBase == '100') {
        return '⬘⬙';
      } else if (modDiceTypeBase == '3') {
        return '◨';
      } else { return ''};
    };
    
    

    const modRollArray = async ()  => {
      let modifier
      if (modRollType == 'total') {
        modifier = 1;
      } else {
        modifier = modDiceMod + 1;
      };
      let modRollArray = [];
      for (let i=0; i<modDiceAmmt; i++) {
        modRollArray.push(Math.max(Math.round((Math.random()*modDiceType) + modifier),1));
      };
      if (modDiceTypeBase === "3") {
        return modRollArray.map(function(element){return element - 2});
      } else {
        return modRollArray;
      };
    };

    const modFinalRoll = await modRollArray();
    let modRawRoll = [...modFinalRoll];
    let modTempRoll = [...modRawRoll];

    const rollReplaceResults = async () => {
      if (modDiceTypeBase == 2 && modRollType != 'individual') {
        return modTempRoll.forEach((value, index) => {
          modTempRoll[index] = value.toString().replace('1','Heads(1)').replace('2','Tails(2)');
        });
      } else if (modDiceTypeBase == 100) {
        return modTempRoll.forEach((value, index) => {
          modTempRoll[index] = value.toString().padStart(2, "0");
        });
      } else if (modDiceTypeBase == 3) {
        return modTempRoll.forEach((value, index) => {
          modTempRoll[index] = value.toString().replace('-1','-').replace('0','  ').replace('1','+');
        });
      } else {
        return modTempRoll.sort();
      };
    };

    const rollReplacedResult = await rollReplaceResults();
    
    let modResult
    if (modDiceMod === 0) {
      modResult = "";
    } else if (modRollType === 'total') {
      modResult = modDiceMod > 0? `+${modDiceMod}` : `${modDiceMod}`;
    } else if (modRollType === 'individual') {
      modResult = modDiceMod > 0? `+${modDiceMod} each` : `${modDiceMod} each`;
    } else {
      modResult = "";
      console.log("missing modResult")
    };

    let modTotal
    if (modRollType === 'total') {
      modTotal = modDiceMod;
    } else if (modRollType === 'individual') {
      modTotal = 0;
    } else {
      modTotal = 0;
      console.log("missing modTotal")
    };

    const arraySum = (runningTotal, current) => runningTotal + current;

    interaction.reply({
      content: `${diceSymbol().repeat(modDiceAmmt)}\n${modDiceRoller} rolled ${modDiceAmmt}D${modDiceTypeBase}${modResult}: ｢${modTempRoll.sort(function(a, b){return b - a}).toString().replaceAll(",","｣ ｢")}｣\nTotal: ${modFinalRoll.reduce(arraySum)+modTotal}`,
      ephemeral: false,
      
    })
    //console.log(interaction.fields.getTextInputValue("diceNumber") + " " + interaction.values[0]);
    console.log(interaction.guild?.name === undefined ? "Dice Modal submitted in: DM" : "Dice Modal submitted in: " + interaction.guild?.name);
    //console.log(interaction);
};

module.exports = { runDiceRoller };