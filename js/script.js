let characterData = null;
let hasAttackedThisTurn = false;

let turnNumber = 1;
let guessLimit = 0;
let moveUsed = false;
let actionUsed = false; // for either attack or perception in this turn

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
  document.getElementById('investigationBtn').addEventListener('click', handleInvestigation);
  document.getElementById('attackBtn').addEventListener('click', handleAttack);

  // Guess and End Turn events
  document.getElementById('guessBtn').addEventListener('click', handleGuess);
  document.getElementById('endTurnBtn').addEventListener('click', handleEndTurn);
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



// GUESSING LOGIC
function handleGuess() {

  const classGuess = document.getElementById('classGuess').value;
  const subclassGuess = document.getElementById('subclass').value;
  const strScoreGuess = document.getElementById('str-score');
  const dexScoreGuess = document.getElementById('dex-score');
  const conScoreGuess = document.getElementById('con-score');
  const intScoreGuess = document.getElementById('int-score');
  const wisScoreGuess = document.getElementById('wis-score');
  const chaScoreGuess = document.getElementById('cha-score');
  const initiativeGuess = document.getElementById('initiative');

  const strModGuess = parseInt(abilityScoreModifier(parseInt(strScoreGuess.value) || 0), 10);
  const dexModGuess = parseInt(abilityScoreModifier(parseInt(dexScoreGuess.value) || 0), 10);
  const conModGuess = parseInt(abilityScoreModifier(parseInt(conScoreGuess.value) || 0), 10);
  const intModGuess = parseInt(abilityScoreModifier(parseInt(intScoreGuess.value) || 0), 10);
  const wisModGuess = parseInt(abilityScoreModifier(parseInt(wisScoreGuess.value) || 0), 10);
  const chaModGuess = parseInt(abilityScoreModifier(parseInt(chaScoreGuess.value) || 0), 10);


  const actualClass = characterData.class; 
  const actualSubclass = characterData.subclass.name; 
  const actualStrMod = abilityScoreModifier(characterData.abilities.str);
  const actualDexMod = abilityScoreModifier(characterData.abilities.dex);
  const actualConMod = abilityScoreModifier(characterData.abilities.con);
  const actualIntMod = abilityScoreModifier(characterData.abilities.int);
  const actualWisMod = abilityScoreModifier(characterData.abilities.wis);
  const actualChaMod = abilityScoreModifier(characterData.abilities.cha);
  const actualInitiative = characterData.initiative; 

  console.log('Handle guess:');
  console.log('           Actual\t\t\t| Guess');
  console.log('Class:     '+classGuess+'\t\t\t| '+characterData.class);
  console.log('Subclass:  '+subclassGuess+'\t| '+characterData.subclass.name);
  console.log('Str:       '+strModGuess+'\t\t\t| '+actualStrMod);
  console.log('Init:      '+actualInitiative+'\t\t\t| '+initiativeGuess);

  let classCorrect = (classGuess === actualClass);
  let subclassCorrect = (subclassGuess === actualSubclass);
  let strModCorrect = (strModGuess === actualStrMod);
  let dexModCorrect = (dexModGuess === actualDexMod);
  let conModCorrect = (conModGuess === actualConMod);
  let intModCorrect = (intModGuess === actualIntMod);
  let wisModCorrect = (wisModGuess === actualWisMod);
  let chaModCorrect = (chaModGuess === actualChaMod);

  // Use up one guess attempt
  guessLimit++;

  // If both correct, alert congratulations
  if (classCorrect && subclassCorrect && strModCorrect) {
    showSiteStyledPopup("Congratulations!", "You recovered your memory!");
  } else {
    // If incorrect, append a new line in guessResults
    const guessResultsDiv = document.getElementById('guessResults');
    if (guessResultsDiv.querySelector('em')) {
      guessResultsDiv.innerHTML = ''; // remove 'No guesses yet'
    }

    let classResultSpan = classCorrect ? 
      `<span class="correct">${classGuess}</span>` : 
      `<span class="incorrect">${classGuess}</span>`;

    let strModResultSpan = scoreCheckSpanCreate(strModGuess, actualStrMod);
    //if (strModCorrect) {
    //  strModResultSpan = `<span class="correct">${strModGuess}</span>`;
    //} else {
    //  // Incorrect guess. Show arrow
    //  let arrow = '';
    //  if (Number.isFinite(strModGuess)) {
    //    if (strModGuess < actualStrMod) {
    //      arrow = ' ↑';
    //    } else if (strModGuess > actualStrMod) {
    //      arrow = ' ↓';
    //    }
    //  }
    //  strModResultSpan = `<span class="incorrect">${isNaN(strModGuess) ? '?' : strModGuess}${arrow}</span>`;
    //}

    const guessLine = `<p>Class Guess: ${classResultSpan} | Str Mod Guess: ${strModResultSpan}</p>`;
    guessResultsDiv.innerHTML += guessLine;
    document.getElementById('guessesCount').innerHTML = `<p><em>Number of guesses: ${guessLimit}</em></p>`;
  }

}

function showSiteStyledPopup(titleText, bodyText) {
  // Create the outer container
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = '#4b2e2e';
  popup.style.color = '#f5f5f5';
  popup.style.border = '2px solid #d4af37';
  popup.style.padding = '20px';
  popup.style.borderRadius = '12px';
  popup.style.zIndex = '9999';
  popup.style.textAlign = 'center';
  popup.style.minWidth = '250px';

  // Inner HTML: Title, message, and close button
  popup.innerHTML = `
    <h2 style="font-size: 1.8rem; margin-bottom: 0.5em; color: #d4af37;">${titleText}</h2>
    <p style="margin-bottom: 1em;">${bodyText}</p>
    <button id="popupCloseBtn" style="
      background-color: #d4af37;
      color: #4b2e2e;
      font-family: 'Cinzel', serif;
      padding: 10px 20px;
      border: 2px solid #4b2e2e;
      border-radius: 6px;
      cursor: pointer;
    ">
      Close
    </button>
  `;

  // Append to body
  document.body.appendChild(popup);

  // When Close is clicked, remove popup
  const closeBtn = document.getElementById('popupCloseBtn');
  closeBtn.addEventListener('click', () => {
    popup.remove();
  });
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

function scoreCheckSpanCreate(ModGuess, actualMod) {
  let tmpSpan = ``;
  if (ModGuess == actualMod) {
    tmpSpan = `<span class="correct">${ModGuess}</span>`;
  } else {
    // Incorrect guess. Show arrow
    let arrow = '';
    if (Number.isFinite(ModGuess)) {
      if (ModGuess < actualMod) {
        arrow = ' ↑';
      } else if (ModGuess > actualMod) {
        arrow = ' ↓';
      }
    }
    tmpSpan = `<span class="incorrect">${isNaN(ModGuess) ? '?' : ModGuess}${arrow}</span>`;
  }
  return tmpSpan;
}