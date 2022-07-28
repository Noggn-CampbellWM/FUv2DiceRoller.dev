async function runDiceRoller (interaction) {
    const modDiceAmmt = Number(interaction.fields.getTextInputValue("diceNumber").replace(/[^\d.-]/g, '')) || 1;
    const modDiceType = Number(interaction.fields.getField("diceType").value[0], 10)-1 || 19;
    const modDiceTypeBase = interaction.fields.getField("diceType").value[0] || "20";
    const modDiceMod = Number(interaction.fields.getTextInputValue("diceMod").replace(/[^\d.-]/g, '')) || 0;
    const modRollType = interaction.fields.getField("rollType").value[0] || "total";
    const modExplodeType = interaction.fields.getField("explodingDice").value[0] || "0";
    //const modSortResults = interaction.fields.getField("sortResults").value[0] || "true";
    const modDiceRoller = interaction.member?.nickname || interaction.user.username;


    let diceSymbol = () => {
      if(modDiceTypeBase == '2') {
        let baseSymbol = "❍",
            altSymbol = "✪";
        return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '4') {
        let baseSymbol = "△",
            altSymbol = "▲";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '6') {
        let baseSymbol = "▢",
            altSymbol = "▩";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '8') {
        let baseSymbol = "⟠",
            altSymbol = "⧫";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '10') {
        let baseSymbol = "⬙",
            altSymbol = "◆";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '12') {
        let baseSymbol = "⭔",
            altSymbol = "⬟";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '20') {
        let baseSymbol = "⬡",
            altSymbol = "⬣";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '100') {
        let baseSymbol = "⬘⬙",
            altSymbol = "✦✧";
            return {baseSymbol , altSymbol};
      } else if (modDiceTypeBase == '3') {
        let baseSymbol = "◪",
            altSymbol = "◩";
            return {baseSymbol , altSymbol};
      } else {
        let baseSymbol = "🕱",
            altSymbol = "⦕🕱⦖";
            return {baseSymbol , altSymbol};
    }};

    let diceLabel = () => {
      if(modDiceTypeBase == '2') {
        return modDiceAmmt > 1 ? `flipped ${modDiceAmmt} Coins` : `flipped ${modDiceAmmt} Coin`;
      } else if (modDiceTypeBase == '4') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D4s` : `rolled ${modDiceAmmt}D4`;
      } else if (modDiceTypeBase == '6') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D6s` : `rolled ${modDiceAmmt}D6`;
      } else if (modDiceTypeBase == '8') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D8s` : `rolled ${modDiceAmmt}D8`;
      } else if (modDiceTypeBase == '10') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D10s` : `rolled ${modDiceAmmt}D10`;
      } else if (modDiceTypeBase == '12') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D12s` : `rolled ${modDiceAmmt}D12`;
      } else if (modDiceTypeBase == '20') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D20s` : `rolled ${modDiceAmmt}D20`;
      } else if (modDiceTypeBase == '100') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt}D100s` : `rolled ${modDiceAmmt}D100`;
      } else if (modDiceTypeBase == '3') {
        return modDiceAmmt > 1 ? `rolled ${modDiceAmmt} Fate Dice` : `rolled ${modDiceAmmt} Fate Die`;
      } else { return '*Behold, the abyss is made manifest!*'};
    };
    
    const modifier = () => {
      if (modDiceTypeBase == '3') {
        return 1
      }else if (modRollType == 'total') {
        return 1;
      } else if (modRollType == 'individual') {
        return modDiceMod + 1;
      } else {
        return 1
      };
    }
    

    const modRollArray = async ()  => {
      let modRollArray = [];
      for (let i=0; i<modDiceAmmt; i++) {
        modRollArray.push(Math.max(Math.round((Math.random()*modDiceType) + modifier()),1));
      };
      if (modDiceTypeBase == "3") {
        return modRollArray.map(function(element){return element - 2});
      } else {
        return modRollArray;
      };
    };

    const modFinalRoll = await modRollArray();
    let modRawRoll = [...modFinalRoll];
    let modTempRoll = [...modRawRoll];

    const primedQty = modRawRoll.filter(bomb => bomb > modDiceType + modifier() - modExplodeType).length;

    const ignition = async () => {
        if (modDiceTypeBase == "3") {
        return modTempRoll;
      } else {
        for (let i=0; i<primedQty; i++) {
          modTempRoll.push(Math.max(Math.round((Math.random()*modDiceType) + modifier()),1));
        };
        return modTempRoll;
      };
    };

    const modExRoll = await ignition();
    const modEndRoll = [...modExRoll];
 
    const rollReplaceResults = async () => {
      if (modDiceTypeBase == 2 && modRollType != 'individual') {
        return modEndRoll.forEach((value, index) => {
          modEndRoll[index] = value.toString().replace('1','⌽:1').replace('2','⍟:2');
        });
      } else if (modDiceTypeBase == 100) {
        return modEndRoll.forEach((value, index) => {
          modEndRoll[index] = value.toString().padStart(2, "0");
        });
      } else if (modDiceTypeBase == "3") {
        return modEndRoll.forEach((value, index) => {
          modEndRoll[index] = value.toString().replace('-1','-').replace('0','  ').replace('1','+');
        });
      } else {
        return modEndRoll;
      };
    };

    await rollReplaceResults();
    
    let modResult
    if (modDiceMod === 0) {
      modResult = "";
    } else if (modRollType === 'total') {
      modResult = modDiceMod > 0? `+${modDiceMod}` : `${modDiceMod}`;
    } else if (modRollType === 'individual' && modDiceTypeBase != '3') {
      modResult = modDiceMod > 0? `+${modDiceMod} each` : `${modDiceMod} each`;
    } else if (modRollType === 'individual' && modDiceTypeBase == '3') {
      modResult = " (unmodified)";
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

    /*const modSortRoll = () => {
      if (modSortResults == "true") {
        return modEndRoll.sort(function(a,b){
          var a1=typeof a, b1=typeof b;
          return a1<b1 ? -1 : a1>b1 ? 1 : a<b ? -1 : a>b ? 1 : 0;
        });
      } else if (modSortResults == "false") {
        return modEndRoll;
      } else {
        return modEndRoll;
      }
    };*/
    
    let isExploding
    if (modExplodeType == 2) {
      isExploding = "★"
    } else if (modExplodeType == 1) {
      isExploding = "✫"
    } else if (modExplodeType == 0) {
      isExploding = ""
    } else {
      isExploding = ""
    };

    let symbolBase = diceSymbol().baseSymbol,
        symbolExplode = diceSymbol().altSymbol;

    const arraySum = (runningTotal, current) => runningTotal + current;

    interaction.reply({
      content: `${symbolBase.repeat(modDiceAmmt-primedQty)}${symbolExplode.repeat(primedQty)}${isExploding.repeat(primedQty)}\n${modDiceRoller} ${diceLabel()}${modResult}: ｢${modEndRoll.toString().replaceAll(",","｣ ｢")}｣\nTotal: ${modExRoll.reduce(arraySum)+modTotal}`,
      ephemeral: false,
      
    })
    console.log(interaction.guild?.name === undefined ? "Dice Modal submitted in: DM" : "Dice Modal submitted in: " + interaction.guild?.name);
};

module.exports = { runDiceRoller };