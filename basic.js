// Utility Functions
function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }
  
  function abilityScoreModifier(score) {
    return Math.floor((score - 10) / 2);
  }
  