const Discord = require("discord.js")
const { Client, Intents } = require('discord.js');
const auth = require('./auth.json');
const clientinfo = require('./clientinfo.json');

var actionDice = 0;
var dangerDice = 0;

var userNote = '';

var actionArray = [];
var dangerArray = [];

function rmArrMatches(arr1, arr2, matchValue) {
  while(arr1.indexOf(matchValue) > -1 && arr2.indexOf(matchValue) > -1) {
    arr1.splice(arr1.indexOf(matchValue),1);
    arr2.splice(arr2.indexOf(matchValue),1);
  }
};
function rollD6s(arr0, diceType) {
  for (var i=0; i<diceType; i++) {
    arr0.push(Math.round((Math.random()*5)+1))
  };
}

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });

// On startup...
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log("Bot came online!")
});
// On mention...
client.on("messageCreate", msg => {
  if (msg.mentions.has(clientinfo.clientid) && msg.author.id !== (clientinfo.clientid)) {
    msg.reply("Hey! I can ping you too, friend.")
  }
});
// On DM...
//client.on("messageCreate", msg => {
//  if (msg.type == "DM" && msg.author.id !== (clientinfo.clientid)) {
//    msg.author.send("Hey! I can reply to DMS!")
//  }
//});
// On message...
client.on("messageCreate", msg => {
  // check if the message is !fu
  if (msg.content.substring(0,3) === "!fu") {
    // If the message is !fu and there are plus and minus characters...
    if (msg.content.slice(3).trim().includes("+")) {
      // Determine actionDice and dangerDice by the amount of + and - characters
      for(var ia=counta=0; ia<msg.content.length; counta+=+("+"===msg.content[ia++]));
      let actionDice = counta;
      for(var ib=countb=0; ib<msg.content.length; countb+=+("-"===msg.content[ib++]));
      let dangerDice = countb;
      //console.log("actionDice:" + actionDice.toString());
      //console.log("dangerDice:" + dangerDice.toString());

      // BROKEN AF
      //let actionDice = (msg.content.match(/\+/gm)||[]).length;
      //let dangerDice = (msg.content.match(/\-/gm)||[]).length;

      // Store any text after "!fu" that is not a + or -
      let userNote = msg.content.slice(3).replaceAll('+','').replaceAll('-','').trim().length > 0 ? "*" + msg.content.slice(3).replaceAll('+','').replaceAll('-','').replaceAll('*','').trim() + "*\n" : "";
      //console.log(userNote);

      // Fill dicepools with values from 1 to 6
      rollD6s(actionArray, actionDice);
      rollD6s(dangerArray, dangerDice);
      var actionResults = actionArray.toString();
      var dangerResults = dangerArray.toString();

      // Comment out the next two lines, as these log the initial dice pool resultes. Uncomment for or troubleshooting only.
      //console.log("actionArray: " + actionArray.toString());
      //console.log("dangerArray: " + dangerArray.toString());

      // Hopefully remove matching numbers from the danger and action pool, one at a time till none remain. This should really be a function.
      actionArray.sort();
      dangerArray.sort();

      for (let i = 1; i <= 6; i++) {
        rmArrMatches(actionArray, dangerArray, i);
      };
      
      actionArray.sort();
      dangerArray.sort();

      // Comment out the next two lines, as these log the final dice pool resultes. Uncomment for or troubleshooting only.
      //console.log(actionArray);
      //console.log(dangerArray);

      // Now for the Results! REPLACE NESTED IFs!!! Ugh, really replace them, the pain, my eyes, the confusion...
      function classicRollResult (oracleMsg) {
        msg.reply(userNote + oracleMsg + "\nAction Dice[" + actionResults.toString() + "] Danger Dice[" + dangerResults.toString() + "]");
      };

      // When the action pool is empty (NO AND)...
      if (actionArray.length == 0) {
        classicRollResult("**No and...**  You fail and things get much worse.");
      }
      else if (Math.max(...actionArray) == 1) {
        classicRollResult("**No and...**  You fail and things get much worse.");
      }
      else if(Math.max(...actionArray) == 2) {
        classicRollResult("**No...**  You fail.");
      }
      else if(Math.max(...actionArray) == 3) {
        classicRollResult("**No but...**  You fail, just.");
      }
      else if(Math.max(...actionArray) == 4) {
        classicRollResult("**Yes but...**  You succeed, but at a cost.");
      }
      else if(Math.max(...actionArray) == 5) {
        classicRollResult("**Yes...**  You succeed.");
      }
      else if(Math.max(...actionArray) == 6) {
        classicRollResult("**Yes and...**  You succeed and gain some other advantage");
      };

      actionArray = [];
      dangerArray = [];
      actionDice = 0;
      dangerDice = 0;
    }
    if (!msg.content.slice(3).trim().includes('+',0)) {
      msg.reply('Please add at least one + after !fu to make a roll. Type !helpfu for a full explanation.')
    }
  }
  else if (msg.content.substring(0,7) === "!helpfu") {
    msg.reply("**How to use FUv2 Dice Roller:**\nFirst, make sure to start your message with !fu, then type anything you want, along with at least one +.\nThe bot will search your text for + and - symbols and convert them into Action and Danger Dice. You can put the + and - symbols wherever you want, for example: '!fu I swing my freshly sharpened+ sword at the towering- ogre as I try and recover my balance-.\n The bot will then roll one Action die, and two Danger dice for you, and display the result. It will also return your initial message, sans the + and - symbols. You can leave it simple and just send + and - if you prefer, ie.'!fu ++-'.\n If you are interested in using the dice system from <http://freeformuniversal.com/fu-dice-pool/> then type !!fu instead.")
  }
  else if (msg.content.substring(0,4) === "!!fu") {
    if (msg.content.slice(4).trim().includes('+'&&'-',0)) {
      // Determine actionDice and dangerDice by the amount of + and - characters
      for(var ia=counta=0; ia<msg.content.length; counta+=+("+"===msg.content[ia++]));
      let actionDice = counta;
      for(var ib=countb=0; ib<msg.content.length; countb+=+("-"===msg.content[ib++]));
      let dangerDice = countb;

      // Store any text after "!fu" that is not a + or -
      let userNote = msg.content.slice(4).replaceAll('+','').replaceAll('-','').trim().length > 0 ? "*" + msg.content.slice(4).replaceAll('+','').replaceAll('-','').replaceAll('*','').trim() + "*\n" : "";
      //console.log(userNote);

      // Fill dicepools with values from 1 to 6
      rollD6s(actionArray, actionDice);
      rollD6s(dangerArray, dangerDice);

      // Comment out the next two lines, as these log the initial dice pool resultes. Uncomment for or troubleshooting only.
      //console.log(actionArray);
      //console.log(dangerArray);

      // Hopefully remove matching numbers from the danger and action pool, one at a time till none remain. This should really be a function.
      //actionArray.sort();
      //dangerArray.sort();

      for (let i = 1; i <= 6; i++) {
        rmArrMatches(actionArray, dangerArray, i);
      };
      
      actionArray.sort();
      dangerArray.sort();
      // Comment out the next two lines, as these log the final dice pool resultes. Uncomment for or troubleshooting only.
      //console.log(actionArray);
      //console.log(dangerArray);

      // Now for the Results! REPLACE NESTED IFs!!! Ugh, really replace them, the pain, my eyes, the confusion...

      // If one or more of the dice pools is empty...
      if (actionArray.length == 0 || dangerArray.length == 0) {
        // When both are empty (NA)...
        if (actionArray.length == 0 && dangerArray.length == 0) {
          msg.reply(userNote + '**Escalation!** The action is not yet resolved and the unexpected happens...')
        }
        // When only the danger pool is empty (YES)...
        else if (actionArray.length > 0 && dangerArray.length == 0) {
          msg.reply(Math.max(...actionArray) > 3 ? userNote + '**Yes.** The action was very successful.' + '\n+[' + Math.max(...actionArray).toString() + ']' : userNote + '**Yes.** The action was mildly successful.' + '\n+[' + Math.max(...actionArray).toString() + ']')
        }
        // When only the action pool is empty (NO)...
        else if (actionArray.length == 0 && dangerArray.length > 0) {
          msg.reply(Math.max(...dangerArray) > 3 ? userNote + '**No.** The action was a complete failure.' + '\n-[' + Math.max(...dangerArray).toString() + ']' : userNote + '**No.** The action was unsuccessful.' + '\n-[' + Math.max(...actionArray).toString() + ']')
        }
      }
      // When the action pool has the highest roll...
      else if ((actionArray.length != 0 || dangerArray.length != 0) && Math.max(...actionArray) > Math.max(...dangerArray)) {
        var temp_actionArray = [...new Set(actionArray)].slice(0) //Clone actionArray to nondestructivly get the second highest value.
        var secondLargest_actionArray = temp_actionArray.sort()[temp_actionArray.length - 2]; //Get the second largest value.
        // When the action pool has highest roll and the danger pool has the second highest (YES BUT)...
        if (actionArray.length == 1 || (actionArray.length > 1 && secondLargest_actionArray < Math.max(...dangerArray))) {
          msg.reply(Math.max(...dangerArray) > 3 ? userNote + '**Yes but...** The action was successful, but the consequences were significant.' + '\n+[' + Math.max(...actionArray).toString() + ']-[' + Math.max(...dangerArray).toString() + ']' : userNote + '**Yes but...** The action was successful, but something went wrong.' + '\n+[' + Math.max(...actionArray).toString() + ']-[' + Math.max(...dangerArray).toString() + ']')
        }
        // When the action pool has both highest rolls (YES AND)...
        else if (secondLargest_actionArray > Math.max(...dangerArray)) {
          msg.reply(secondLargest_actionArray > 3 ? userNote + '**Yes and...** The action was successful, and something great happend.' + '\n+[' + Math.max(...actionArray).toString() + ']+[' + secondLargest_actionArray.toString() + ']' : userNote + '**Yes and...** The action was successful, and there was a pleasant surprise.' + '\n+[' + Math.max(...actionArray).toString() + ']+[' + secondLargest_actionArray.toString() + ']')
        }
      }
      // When the danger pool has the highest roll...
      else if ((actionArray.length != 0 || dangerArray.length != 0) && Math.max(...actionArray) < Math.max(...dangerArray)) {
        var temp_dangerArray = [...new Set(dangerArray)].slice(0) //Clone dangerArray to nondestructivly get the second highest value.
        var secondLargest_dangerArray = temp_dangerArray.sort()[temp_dangerArray.length - 2]; //Get the second largest value.
        // When the danger pool has highest roll and the action pool has the second highest (NO BUT)...
        if (dangerArray.length == 1 || (dangerArray.length > 1 && secondLargest_dangerArray < Math.max(...actionArray))) {
          msg.reply(Math.max(...actionArray) > 3 ? userNote + '**No but...** The action was unsuccessful, but there was an unexpected benefit.' + '\n-[' + Math.max(...dangerArray).toString() + ']+[' + Math.max(...actionArray).toString() + ']' : userNote + '**No but...** The action was unsuccessful, but it was not a complete failure.' + '\n-[' + Math.max(...dangerArray).toString() + ']+[' + Math.max(...actionArray).toString() + ']')
        }
        // When the danger pool has both highest rolls (NO AND)...
        else if (secondLargest_dangerArray > Math.max(...actionArray)) {
          msg.reply(secondLargest_dangerArray > 3 ? userNote + '**No and...** The action was unsuccessful, and there were serious consequences.' + '\n-[' + Math.max(...dangerArray).toString() + ']-[' + secondLargest_dangerArray.toString() + ']' : userNote + '**No and...** The action was unsuccessful, and there were additional repercussions.' + '\n-[' + Math.max(...dangerArray).toString() + ']-[' + secondLargest_dangerArray.toString() + ']')
        }
      };

      actionArray = [];
      dangerArray = [];
      actionDice = 0;
      dangerDice = 0;
    }
    if (!msg.content.slice(3).trim().includes('+'&&'-',0)) {
      msg.reply('Rolls with only Action Die automatically pass, and rolls with only Danger Die automatically fail. Please add at least one + and one - to make a roll using this alternate method.')
    }
  };
})

// Bot Token - Leave at end
client.login(auth.token)