async function runCustomRoller (options,interaction) {
  const custDiceAmmt = options.getNumber('dice_number') || 1;
  const custDiceType = options.getNumber('dice_type')-1 || 6;
  const custDiceTypeBase = options.getNumber('dice_type') || 7;
  const custDiceSort = options.getNumber('dice_sort') || 0;
  const custDiceRoller = interaction.member?.nickname || interaction.user.username;


  const replyPayload = async () => {

    const arraySum = (runningTotal, current) => runningTotal + current;

    let diceLabel = custDiceAmmt > 1 ? `rolled ${custDiceAmmt}D${custDiceTypeBase}s` : `rolled ${custDiceAmmt}D${custDiceTypeBase}`;

    const custRollArray = async ()  => {
      let custRollArray = [];
      for (let i=0; i<custDiceAmmt; i++) {
        custRollArray.push(Math.max(Math.round((Math.random()*custDiceType) + 1),1));
      };
      return custRollArray;
    };

    let custFinalRoll = await custRollArray();

    const modSortRoll = async () => {
      if (custDiceSort == 1) {
        return custFinalRoll.sort(function(a,b){
          var a1=typeof a, b1=typeof b;
          return b1<a1 ? -1 : b1>a1 ? 1 : b<a ? -1 : b>a ? 1 : 0;
        });
      } else if (custDiceSort == 0) {
        return custFinalRoll;
      } else {
        return custFinalRoll;
      }
    };

    let rollResult = await modSortRoll();

    return {
      'diceLabel': diceLabel,
      'rollTotal': custDiceAmmt > 1 ? `\nTotal: ${rollResult.reduce(arraySum)}` : "",
      'rollAvg': custDiceAmmt > 1 ? `\nAverage: ${Math.round(rollResult.reduce((a,b) => (a+b)) / rollResult.length)}` : "",
      'rollDisplay': custDiceAmmt < 35 ? `:　｢${rollResult.toString().replaceAll(",","｣ ｢")}｣` : `:　max:｢${Math.max(...rollResult).toString()}｣ ... min:｢${Math.min(...rollResult).toString()}｣`
    };
  };

  let payload = await replyPayload();

  

  interaction.reply({
    content: `${custDiceRoller} ${payload.diceLabel}${payload.rollDisplay}${payload.rollTotal}${payload.rollAvg}`,
    ephemeral: false,
    
  })
  console.log(interaction.guild?.name === undefined ? "Custom submitted in: DM" : "Custom submitted in: " + interaction.guild?.name);
};

module.exports = { runCustomRoller };