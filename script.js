let characterData = null;
let hasAttackedThisTurn = false;

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch character data from PHP backend
  characterData = await fetchCharacterData();

  // Populate basic info
  document.getElementById('charName').innerText = characterData.name;
  document.getElementById('charRace').innerText = characterData.race;

  // Populate weapon dropdown
  const weaponSelect = document.getElementById('weaponSelect');
  characterData.weapons.forEach((weapon) => {
    const option = document.createElement('option');
    option.value = weapon.name;
    option.textContent = weapon.name;
    weaponSelect.appendChild(option);
  });

  // Event listeners
  document.getElementById('moveBtn').addEventListener('click', handleMove);
  document.getElementById('perceptionBtn').addEventListener('click', handlePerception);
  document.getElementById('attackBtn').addEventListener('click', handleAttack);
});

async function fetchCharacterData() {
  const response = await fetch('create_character.php');
  return response.json();
}

function handleMove() {
  const resultDiv = document.getElementById('actionResults');
  resultDiv.innerText = "";
  const speed = characterData.speed;
  const flavorText = `You stride forward with confident steps, covering ${speed} feet in a single move.`;
  resultDiv.innerText = flavorText;
}

function handlePerception() {
  const resultDiv = document.getElementById('actionResults');
  resultDiv.innerText = "";
  const roll = rollDie(20);
  const perceptionTotal = roll + characterData.perception;

  let output = `You roll a d20 for Perception: ${roll} + ${characterData.perception} = ${perceptionTotal}\n`;
  if (perceptionTotal > 15) {
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
  } else {
    output += "Fail! You don't notice anything special.\n";
  }

  resultDiv.innerText = output;
}

function handleAttack() {
  const resultDiv = document.getElementById('actionResults');
  resultDiv.innerText = "";

  if (hasAttackedThisTurn) {
    resultDiv.innerText = "You have already attacked this turn!";
    return;
  }

  const weaponSelect = document.getElementById('weaponSelect');
  const selectedWeaponName = weaponSelect.value;
  const chosenWeapon = characterData.weapons.find(w => w.name === selectedWeaponName);

  if (!chosenWeapon) {
    resultDiv.innerText = "Invalid weapon choice.";
    return;
  }

  const basicScoreName = characterData.Basic_Score;
  const basicAbilityScore = characterData.abilities[basicScoreName];
  const basicMod = abilityScoreModifier(basicAbilityScore);
  const profBonus = characterData.proficiency_bonus;

  // Check Extra Attack
  const hasExtraAttack = characterData.features_and_traits.some(f => f.name.toLowerCase() === "extra attack");
  let numberOfAttacks = hasExtraAttack ? 2 : 1;
  let output = "";

  for (let i = 1; i <= numberOfAttacks; i++) {
    output += `Attack ${i} with ${chosenWeapon.name}:\n`;
    const attackRoll = rollDie(20) + basicMod + profBonus;
    output += `To Hit: d20 + ${basicMod} (mod) + ${profBonus} (prof) = ${attackRoll}\n`;

    if (attackRoll > 14) {
      output += "Hit! Rolling damage...\n";
      const damageDie = chosenWeapon.die;
      const damageRoll = rollDie(parseInt(damageDie.replace('d', '')));
      const totalDamage = damageRoll + basicMod;
      output += `Damage roll: ${damageDie} = ${damageRoll} + ${basicMod} (mod) = ${totalDamage} damage.\n`;
    } else {
      output += "Miss!\n";
    }
    output += "\n";
  }

  resultDiv.innerText = output;
  hasAttackedThisTurn = true;
}

// Utility Functions
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function abilityScoreModifier(score) {
  return Math.floor((score - 10) / 2);
}
