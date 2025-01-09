let characterData = null;
let hasAttackedThisTurn = false;

let turnNumber = 1;
let guessLimit = 0;
let moveUsed = false;
let actionUsed = false; // for either attack or perception in this turn

const classGuessHighlight = {
  Barbarian: 0,
  Paladin: 0,
  Rogue: 0,
  Cleric: 0
};
const subclassGuessHighlight = {
  Berserker: 0,
  Zealot: 0,
  'Oath of Devotion': 0,
  'Oath of Ancients': 0,
  Assassin: 0,
  Thief: 0
};

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch character data
  //await new Promise(r => setTimeout(r, 5000));
  characterData = await fetchCharacterData();
  console.log("Character data:", characterData);
  //await new Promise(r => setTimeout(r, 5000));

  console.log(characterData);
  // Console logs with requested info
  console.log("Class: " + characterData.class);
  console.log("Subclass: " + characterData.subclass);
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
  characterData.nonProficientWeapons.forEach((weapon) => {
    const option = document.createElement('option');
    option.value = weapon.name;
    option.textContent = weapon.name;
    weaponSelect.appendChild(option);
  });

  // Event listeners for actions
  document.getElementById('moveBtn').addEventListener('click', handleMove);
  document.getElementById('perceptionBtn').addEventListener('click', handlePerception);
  document.getElementById('investigationBtn').addEventListener('click', handleInvestigation);
  document.getElementById('attackBtn').addEventListener('click', handleAttack);

  // Guess and End Turn events
  document.getElementById('guessBtn').addEventListener('click', handleGuess);
  document.getElementById('endTurnBtn').addEventListener('click', handleEndTurn);

  const tmpClassSubclassMap = {
    Barbarian: ["Berserker", "Zealot"],
    Paladin: ["Oath of Devotion", "Oath of Ancients"],
    Rogue: ["Assassin", "Thief"]
  };

  // Create class/subclass selection
  const selectElement = document.getElementById('classSubclassGuess');
  // Populate the select element
  for (const [className, subclasses] of Object.entries(tmpClassSubclassMap)) {
      // Add the class name as a disabled option
      const classOption = document.createElement('option');
      classOption.textContent = className;
      classOption.disabled = true;
      classOption.classList.add('no-highlight');
      classOption.classList.add('disabled-option');
      selectElement.appendChild(classOption);

      // Add the subclasses as selectable options
      for (const subclass of subclasses) {
        const subclassOption = document.createElement('option');
        subclassOption.textContent = `${className} ${subclass}`;
        subclassOption.value = `${className} ${subclass}`; // Include class name in the value
        subclassOption.classList.add('no-highlight');
        subclassOption.dataset.className = className; // Store class name separately for easier access
        subclassOption.dataset.subclassName = subclass; // Store subclass name separately
        selectElement.appendChild(subclassOption);
      }
    }

    // Event listener to update the displayed value
    selectElement.addEventListener('change', () => {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      if (!selectedOption.disabled) {
        // Update the display text to show both class and subclass
        selectElement.options[selectElement.selectedIndex].textContent = selectedOption.value;
      }
    });
});

async function fetchCharacterData() {
  try {
    console.log("Fetching character data...");
    const response = await fetch('create_character.php');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching character data:", error);
  }
}

