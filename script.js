let characterData = null;
let hasAttackedThisTurn = false;

let turnNumber = 1;
let guessLimit = 0;
let moveUsed = false;
let actionUsed = false; // for either attack or perception in this turn

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

  // Console logs with requested info
  console.log("Class: " + characterData.class);
  console.log("Subclass: " + characterData.subclass);
  console.log("Str Score: " + characterData.abilities.str + ", Dex Score: " + characterData.abilities.dex);
  const featureNames = characterData.features_and_traits.map(f => f.name);
  console.log("Features and Traits: " + featureNames.join(", "));
  const hasExtraAttack = characterData.features_and_traits.some(f => f.name.toLowerCase() === "extra attack");
  console.log("Has extra attack feature: " + hasExtraAttack);

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

  // Event listeners for actions
  document.getElementById('moveBtn').addEventListener('click', handleMove);
  document.getElementById('perceptionBtn').addEventListener('click', handlePerception);
  document.getElementById('attackBtn').addEventListener('click', handleAttack);

  // Guess and End Turn events
  document.getElementById('guessBtn').addEventListener('click', handleGuess);
  document.getElementById('endTurnBtn').addEventListener('click', handleEndTurn);
});

async function fetchCharacterData() {
  const response = await fetch('create_character.php');
  return response.json();
}

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

// GUESSING LOGIC
function handleGuess() {
  if (guessLimit <= 0) {
    alert("No guesses available! End your turn to gain more guesses.");
    return;
  }

  const classGuess = document.getElementById('classGuess').value;
  const strModGuessInput = document.getElementById('strModGuess');
  const strModGuess = parseInt(strModGuessInput.value, 10);

  const actualClass = characterData.class; 
  const actualStrMod = abilityScoreModifier(characterData.abilities.str);

  let classCorrect = (classGuess === actualClass);
  let strModCorrect = (strModGuess === actualStrMod);

  // Use up one guess attempt
  guessLimit++;

  // If both correct, alert congratulations
  if (classCorrect && strModCorrect) {
    alert("Congratulations!");
  } else {
    // If incorrect, append a new line in guessResults
    const guessResultsDiv = document.getElementById('guessResults');
    if (guessResultsDiv.querySelector('em')) {
      guessResultsDiv.innerHTML = ''; // remove 'No guesses yet'
    }

    let classResultSpan = classCorrect ? 
      `<span class="correct">${classGuess}</span>` : 
      `<span class="incorrect">${classGuess}</span>`;

    let strModResultSpan = '';
    if (strModCorrect) {
      strModResultSpan = `<span class="correct">${strModGuess}</span>`;
    } else {
      // Incorrect guess. Show arrow
      let arrow = '';
      if (Number.isFinite(strModGuess)) {
        if (strModGuess < actualStrMod) {
          arrow = ' ↑';
        } else if (strModGuess > actualStrMod) {
          arrow = ' ↓';
        }
      }
      strModResultSpan = `<span class="incorrect">${isNaN(strModGuess) ? '?' : strModGuess}${arrow}</span>`;
    }

    const guessLine = `<p>Class Guess: ${classResultSpan} | Str Mod Guess: ${strModResultSpan}</p>`;
    guessResultsDiv.innerHTML += guessLine;
    document.getElementById('guessesCount').innerHTML = `<p><em>Number of guesses: ${guessLimit}</em></p>`;
  }

  // Clear the strength modifier input for next guess
  strModGuessInput.value = '';
}

function handleEndTurn() {
  // End current turn and start a new one
  turnNumber++;
  guessLimit++; // player earns one more guess
  hasAttackedThisTurn = false;
  moveUsed = false;
  actionUsed = false;

  const resultDiv = document.getElementById('actionResults');
  document.getElementById('guessesCount').innerHTML = `<p><em>Number of guesses: ${guessLimit}</em></p>`;
}

// Utility Functions
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function abilityScoreModifier(score) {
  return Math.floor((score - 10) / 2);
}
