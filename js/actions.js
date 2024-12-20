function handleMove() {
  const resultDiv = document.getElementById('actionResults');

  // Check turn-based restrictions
  if (moveUsed) {
    resultDiv.innerText += "You have already moved this turn!\n";
    return;
  }

  const speed = characterData.speed;
  const flavorText = `Turn ${turnNumber}: You stride forward with confident steps, covering ${speed} feet in a single move.\n`;
  resultDiv.innerText += flavorText;

  // Record known info if not already recorded
  if (!knownInfo.speed) {
    knownInfo.speed = speed;
    updateKnownInfoPanel();
  }

  moveUsed = true;
}

function handlePerception() {
  const resultDiv = document.getElementById('actionResults');

  // Check turn-based restrictions
  if (!moveUsed) {
    resultDiv.innerText += "You must move before using Perception this turn!\n";
    return;
  }

  if (actionUsed) {
    resultDiv.innerText += "You have already taken your action (Attack or Perception) this turn!\n";
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

  } else {
    output += "Fail! You don't notice anything special.\n";
  }

  resultDiv.innerText += output;
  actionUsed = true;
}

function handleAttack() {
  const resultDiv = document.getElementById('actionResults');

  // Check turn-based restrictions
  if (!moveUsed) {
    resultDiv.innerText += "You must move before attacking this turn!\n";
    return;
  }

  if (actionUsed) {
    resultDiv.innerText += "You have already taken your action (Attack or Perception) this turn!\n";
    return;
  }

  if (hasAttackedThisTurn) {
    resultDiv.innerText += "You have already attacked this turn!\n";
    return;
  }

  const weaponSelect = document.getElementById('weaponSelect');
  const selectedWeaponName = weaponSelect.value;
  const chosenWeapon = characterData.weapons.find(w => w.name === selectedWeaponName);

  if (!chosenWeapon) {
    resultDiv.innerText += "Invalid weapon choice.\n";
    return;
  }

  const basicScoreName = characterData.Basic_Score; 
  const basicAbilityScore = characterData.abilities[basicScoreName];
  const basicMod = abilityScoreModifier(basicAbilityScore);
  const profBonus = characterData.proficiency_bonus;

  // Check if Extra Attack feature is present
  const hasExtraAttack = characterData.features_and_traits.some(f => f.name.toLowerCase() === "extra attack");
  console.log(`Has extra attack feature: ${hasExtraAttack}`);

  let numberOfAttacks = hasExtraAttack ? 2 : 1;
  let output = `Turn ${turnNumber}: You attack with ${chosenWeapon.name}:\n`;

  for (let i = 1; i <= numberOfAttacks; i++) {
    if (i === 2 && hasExtraAttack) {
      output += "\nYou have the Extra Attack feature, so you immediately attack a second time with the same weapon!\n";
    }

    const attackRoll = rollDie(20) + basicMod + profBonus;
    output += `Attack ${i}: d20 + ${basicMod}(mod) + ${profBonus}(prof) = ${attackRoll}\n`;

    if (attackRoll > 14) {
      output += "Hit! Rolling damage...\n";
      const damageDie = chosenWeapon.die;
      const damageRoll = rollDie(parseInt(damageDie.replace('d','')));
      const totalDamage = damageRoll + basicMod;
      output += `Damage: ${damageDie} = ${damageRoll} + ${basicMod}(mod) = ${totalDamage} damage.\n`;
    } else {
      output += "Miss!\n";
    }
  }

  resultDiv.innerText += output;
  hasAttackedThisTurn = true;
  actionUsed = true;
}