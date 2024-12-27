/* ************************************************************
* 
* 
* 
* 
* 
* 
* 
*************************************************************** */
function handleAttack() {
  const resultDiv = document.getElementById('actionResults');

  // Check turn-based restrictions

  if (hasAttackedThisTurn) {
    resultDiv.innerText += "You have already attacked this turn!\n";
    return;
  }

  const weaponSelect = document.getElementById('weaponSelect');
  const selectedWeaponName = weaponSelect.value;
  const proficientWeapon = characterData.weapons.find(w => w.name === selectedWeaponName);
  const nonProficientWeapon = characterData.nonProficientWeapons.find(w => w.name === selectedWeaponName);
  if (!proficientWeapon && !nonProficientWeapon){
    resultDiv.innerText += "Invalid weapon choice.\n";
    return;
  }
  let extraModifier = 0;
  const chosenWeapon = (proficientWeapon) ? proficientWeapon : nonProficientWeapon;
  let hasAdvantage = false;
  let hasDisdvantage = false;
  if (nonProficientWeapon) {
    extraModifier += -characterData.profBonus
  }

  const basicScoreName = characterData.Basic_Score; 
  const basicAbilityScore = characterData.abilities[basicScoreName];
  const basicMod = abilityScoreModifier(basicAbilityScore);
  const profBonus = characterData.proficiency_bonus;

  // Check if Extra Attack feature is present
  const hasExtraAttack = characterData.features_and_traits.some(feature => feature.name.toLowerCase() === "extra attack");  
  console.log(`Has extra attack feature: ${hasExtraAttack}`);

  let numberOfAttacks = hasExtraAttack ? 2 : 1;
  let output = `Turn ${turnNumber}: You attack with ${chosenWeapon.name}:\n`;

  let finalRoll = 0;
  for (let i = 1; i <= numberOfAttacks; i++) {
    if (i === 2 && hasExtraAttack) {
      output += "\nYou have the Extra Attack feature, so you immediately attack a second time with the same weapon!\n";
    }
    if (hasDisdvantage && !hasAdvantage){
      let attackRoll1 = rollDie(20) + basicMod + profBonus + extraModifier;
      let attackRoll2 = rollDie(20) + basicMod + profBonus + extraModifier;
      finalRoll = ( attackRoll1 < attackRoll2) ? attackRoll1 : attackRoll2;
    }
    else if (hasAdvantage && !hasDisdvantage){
      let attackRoll1 = rollDie(20) + basicMod + profBonus+ extraModifier;
      let attackRoll2 = rollDie(20) + basicMod + profBonus+ extraModifier;
      finalRoll = ( attackRoll1 > attackRoll2) ? attackRoll1 : attackRoll2;
    }
    else {
      finalRoll = rollDie(20) + basicMod + profBonus + extraModifier;
    }
    const attackRoll = finalRoll;
    

    if (attackRoll > 14) {
      output += `${i}: ${attackRoll-basicMod-profBonus-extraModifier} + ...Hit! Rolling damage...\n`;
      const damageDie = chosenWeapon.die;
      const damageRoll = rollDie(parseInt(damageDie.replace('d','')));
      const totalDamage = damageRoll + basicMod;
      output += `Damage: ${damageRoll}+... = ${totalDamage} damage.\n`;
    } else {
      output += `${i}: ${attackRoll-basicMod-profBonus} + ...Miss!\n`;
    }
  }

  resultDiv.innerText += output;
  hasAttackedThisTurn = true;
  actionUsed = true;
}
