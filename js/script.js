// GUESSING LOGIC
function handleGuess() {

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // Retrieve Guesses
  const classSubclassGuessSelectElement = document.getElementById('classSubclassGuess');
  const selectedOption = classSubclassGuessSelectElement.options[classSubclassGuessSelectElement.selectedIndex];

  const classGuess = selectedOption.dataset.className;
  const subclassGuess = selectedOption.dataset.subclassName;
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

  const abilityChecks = [ "athletics", "stealth", "arcana", "insight", "persuasion" ]
  const cntCorrects = 0;
  const cntProfs = 0;
  const cntFails = 0;
  for (let aa of abilityChecks) {
    let abilityGuess = document.getElementById(aa + "-proficiency").checked; // todo expertise and half-prof
    let abilityActual = characterData.skills[aa] == "prof";
    if (abilityActual){
      cntProfs++;
    }
    if (abilityGuess && abilityActual){
      cntCorrects++;
    }
    else if (abilityGuess && !abilityActual){
      cntFails++;
    }
}

  const aaa = (document.getElementById("stealth-proficiency").checked) ? true : false;
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // Retrieve Actual Values
  const actualClass = characterData.class; 
  const actualSubclass = characterData.subclass; 
  const actualStrMod = abilityScoreModifier(characterData.abilities.str);
  const actualDexMod = abilityScoreModifier(characterData.abilities.dex);
  const actualConMod = abilityScoreModifier(characterData.abilities.con);
  const actualIntMod = abilityScoreModifier(characterData.abilities.int);
  const actualWisMod = abilityScoreModifier(characterData.abilities.wis);
  const actualChaMod = abilityScoreModifier(characterData.abilities.cha);
  const actualInitiative = characterData.initiative; 

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // Comparing Guess with Actual
  console.log('Handle guess:');
  console.log('           Guess\t\t\t| Actual');
  console.log('Class:     '+classGuess+'\t\t\t| '+characterData.class);
  console.log('Subclass:  '+subclassGuess+'\t| '+characterData.subclass);
  console.log('Str:       '+strModGuess+'\t\t\t| '+actualStrMod);
  console.log('Init:      '+initiativeGuess+'\t\t\t| '+actualInitiative);

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

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // Coloring
  // Color Class and Subclass
  let classColorValue = (classCorrect) ? 1 : -1;
  let subclassColorValue = (subclassCorrect) ? 1 : -1;

  let classElement;
  Array.from(classSubclassGuessSelectElement.options).forEach(option => {
    if (option.disabled && option.textContent === classGuess) {
      classElement = option;
    }
  });

  const daaaaa = document.getElementById("classSubclassGuess");
  daaaaa.classList.remove('red-highlight');
  daaaaa.classList.remove('no-highlight');
  (subclassCorrect) ? daaaaa.classList.add("green-highlight") : daaaaa.classList.add("red-highlight");
  classGuessHighlight[classGuess] = classColorValue;
  colorSelection(classElement, classColorValue);
  
  subclassGuessHighlight[subclassGuess] = subclassColorValue;
  colorSelection(selectedOption, subclassColorValue);  

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // Create new Guess-Line
  const guessResultsDiv = document.getElementById('guessResults');
  if (guessResultsDiv.querySelector('em')) {
    guessResultsDiv.innerHTML = ''; // remove 'No guesses yet'
  }
  let classResultSpan = classCorrect ? 
    `<span class="correct">${classGuess}</span>` : 
    `<span class="incorrect">${classGuess}</span>`;
  let subclassResultSpan = subclassCorrect ? 
    `<span class="correct">${subclassGuess}</span>` : 
    `<span class="incorrect">${subclassGuess}</span>`;
  let strModResultSpan = scoreCheckSpanCreate(strModGuess, actualStrMod);
  let dexModResultSpan = scoreCheckSpanCreate(dexModGuess, actualDexMod);
  let conModResultSpan = scoreCheckSpanCreate(conModGuess, actualConMod);
  let intModResultSpan = scoreCheckSpanCreate(intModGuess, actualIntMod);
  let wisModResultSpan = scoreCheckSpanCreate(wisModGuess, actualWisMod);
  let chaModResultSpan = scoreCheckSpanCreate(chaModGuess, actualChaMod);
  const testLine = `<p>${classResultSpan} | ${subclassResultSpan} | 
      Str: ${strModResultSpan} </p>`;
      //Dex: ${dexModResultSpan} 
      //Con: ${conModResultSpan} 
      //Int: ${intModResultSpan} 
      //Wis: ${wisModResultSpan} 
      //Cha: ${chaModResultSpan} </p>`;
  //const guessLine = `<p>Class Guess: ${classResultSpan} | Str Mod Guess: ${strModResultSpan}</p>`;
  guessResultsDiv.innerHTML += testLine;
  document.getElementById('guessesCount').innerHTML = `<p><em>Number of guesses: ${guessLimit}</em></p>`;



  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // Alert if everything is correct
  if (classCorrect && subclassCorrect && strModCorrect) {
    showSiteStyledPopup("Congratulations!", "You recovered your memory!");
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