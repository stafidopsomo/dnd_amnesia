/* ************************************************************
*  Shows Speed
* 
* 
* 
* 
* 
* 
*************************************************************** */
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
