function handleInvestigation() {
  const resultDiv = document.getElementById('actionResults');

  // Check turn-based restrictions
  
  if (actionUsed) {
    resultDiv.innerText += "You have already taken your action this turn!\n";
    return;
  }

  const roll = rollDie(20);
  const investigationTotal = roll + characterData.investigation;

  let output = `Turn ${turnNumber}: You roll a d20 for Investigation: ${roll} + ??? = ???\n`;
  if (investigationTotal > 10) {
    output += "Success! You deduce that:\n";

    // ========================================================================================================
    // ========================================================================================================
    // ========================================================================================================
    // ARMOR

    const armor = characterData.armor.name;
    const armorDesc = characterData.armor.description;
    const armorData = armors.find(a => a.name === armor);
    console.log(armor);
    if (armorData) {
      console.log(armorData);
      knownInfo.armor = `${armor} (${armorData.type}): ${armorDesc}`;
      if (armorData.type === "Heavy" || armorData.type === "Medium" || armorData.type === "Light") {
        knownInfo.armorProficiencies = `Proficient classes for ${armorData.type} armor: ${armorData.proficientClasses.join(', ')}`;
      }
      if (armorData.strengthRequirement) {
        knownInfo.armorStrengthRequirement = `Strength requirement: ${armorData.strengthRequirement}`;
      }
    }

    output += `Armor: ${armor} (${armorDesc})\n`;

    // ========================================================================================================
    // ========================================================================================================
    // ========================================================================================================
    // WEAPONS
    output += "Weapons:\n";
    const weaponNames = characterData.weapons.map(w => w.name);
    knownInfo.weapons = weaponNames.join(', ');

    const weaponProficiencies = characterData.weapons.map(weapon => {
      const weaponData = weapons.find(w => w.name === weapon.name);
      if (weaponData) {
        return `Proficient classes for ${weaponData.type} weapons (${weapon.name}): ${weaponData.proficientClasses.join(', ')}`;
      }
      return null;
    }).filter(Boolean);

    knownInfo.weaponProficiencies = weaponProficiencies.join('\n');
    // ========================================================================================================
    // ========================================================================================================
    // ========================================================================================================
    // STRENGTH SCORE

    const strScore = characterData.abilities.str;
    let strLevel = (strScore < 10) ? "low" : (strScore <= 14) ? "mid" : "high";
    output += `Your Strength score seems ${strLevel}.\n`;
    if (!knownInfo.strengthLevel) {
      knownInfo.strengthLevel = strLevel;
    }

    


    
    updateKnownInfoPanel();

  } else {
    output += "Fail! You don't notice anything special.\n";
  }

  resultDiv.innerText += output;
  actionUsed = true;
}