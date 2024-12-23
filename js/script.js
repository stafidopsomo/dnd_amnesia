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