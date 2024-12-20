let characterData = null;
let hasAttackedThisTurn = false;

// Track discovered info
let knownInfo = {
  speed: null,
  armor: null,
  strengthLevel: null,
  weapons: null,
};

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch character data
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

  // If already pressed once, do nothing
  const moveBtn = document.getElementById('moveBtn');
  if (moveBtn.disabled) return;

  const speed = characterData.speed;
  const flavorText = `You stride forward with confident steps, covering ${speed} feet in a single move.\n`;
  resultDiv.innerText += flavorText;

  // Record known info
  knownInfo.speed = speed;
  updateKnownInfoPanel();

  // Disable the button
  moveBtn.disabled = true;
}

function handlePerception() {
  const resultDiv = document.getElementById('actionResults');

  const perceptionBtn = document.getElementById('perceptionBtn');
  if (perceptionBtn.disabled) return;

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

    // Record known info
    knownInfo.armor = `${armorName} (${armorDesc})`;
    knownInfo.weapons = characterData.weapons.map(w => w.name).join(', ');
    knownInfo.strengthLevel = strLevel;
    updateKnownInfoPanel();

  } else {
    output += "Fail! You don't notice anything special.\n";
  }

  resultDiv.innerText += output;

  // Disable the button after one use
  perceptionBtn.disabled = true;
}

function handleAttack() {
  const resultDiv = document.getElementById('actionResults');

  if (hasAttackedThisTurn) {
    // Already attacked
    return;
  }

  const attackBtn = document.getElementById('attackBtn');
  if (attackBtn.disabled) return;

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
  let output = `You attack with ${chosenWeapon.name}:\n`;

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
  attackBtn.disabled = true; // Disable attack after use
}

function updateKnownInfoPanel() {
  const infoDiv = document.getElementById('infoContent');

  // Clear the panel first
  infoDiv.innerHTML = '';

  let hasInfo = false;

  if (knownInfo.speed) {
    infoDiv.innerHTML += `<p><strong>Speed:</strong> ${knownInfo.speed} ft</p>`;
    hasInfo = true;
  }

  if (knownInfo.armor) {
    infoDiv.innerHTML += `<p><strong>Armor:</strong> ${knownInfo.armor}</p>`;
    hasInfo = true;
  }

  if (knownInfo.weapons) {
    infoDiv.innerHTML += `<p><strong>Weapons:</strong> ${knownInfo.weapons}</p>`;
    hasInfo = true;
  }

  if (knownInfo.strengthLevel) {
    infoDiv.innerHTML += `<p><strong>Strength Level:</strong> ${knownInfo.strengthLevel}</p>`;
    hasInfo = true;
  }

  if (!hasInfo) {
    infoDiv.innerHTML = `<p><em>No information discovered yet.</em></p>`;
  }
}

// Utility Functions
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function abilityScoreModifier(score) {
  return Math.floor((score - 10) / 2);
}
