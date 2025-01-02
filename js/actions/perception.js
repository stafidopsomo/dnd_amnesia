/* ************************************************************
* Success Shows:
*     Armor
*     Weapon
*     Strength Level
*     Holy Symbol (TODO)
* 
* 
* 
*************************************************************** */
function handlePerception() {
  const resultDiv = document.getElementById('actionResults');

  // Check turn-based restrictions
  if (actionUsed) {
    resultDiv.innerText += "You have already taken your action this turn!\n";
    return;
  }

  const roll = rollDie(20);
  const perceptionTotal = roll + characterData.perception;

  let output = `Turn ${turnNumber}: You roll a d20 for Perception: ${roll} + ??? = ???\n`;
  if (perceptionTotal > 10) {
    output += "Success! You spot some details:\n";
    const armorName = characterData.armor.name;
    const armorDesc = characterData.armor.description;
    output += `Armor: ${armorName} (${armorDesc})\n`;

    output += "Weapons:\n";
    characterData.weapons.forEach(wpn => {
      output += `- ${wpn.name} (${wpn.die} damage die)\n`;
    });
    const strScore = characterData.abilities.str;
    let strLevel = (strScore < 10) ? "low" : (strScore <= 14) ? "mid" : "high";
    output += `Your Strength score seems ${strLevel}.\n`;

    // Record known info
    if (!knownInfo.armor) {
      knownInfo.armor = `${armorName} (${armorDesc})`;
    }
    if (!knownInfo.weapons) {
      knownInfo.weapons = characterData.weapons.map(w => w.name).join(', ');
    }
    if (!knownInfo.strengthLevel) {
      knownInfo.strengthLevel = strLevel;
    }
    updateKnownInfoPanel();

  } 
  else {
    output += "Fail! You don't notice anything special.\n";
  }

  resultDiv.innerText += output;
  actionUsed = true;
}