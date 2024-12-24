function updateModifiers(name) {
  const the_value = document.getElementById(name);
  const tmp = parseInt(the_value.value) || 0;
  let the_mod = abilityScoreModifier(tmp);
  document.getElementById(name.split("-")[0] + "-mod").innerText = `Mod: ${the_mod}`;
  let prof = 0;
  switch (name.split("-")[0]) {
      case 'str':
          prof = (document.getElementById("athletics-proficiency").checked) ? 3 : 0
          document.getElementById('athletics-score').innerText = the_mod + prof;
          break;
      case 'dex':
          prof = (document.getElementById("stealth-proficiency").checked) ? 3 : 0
          document.getElementById('stealth-score').innerText = the_mod + prof;
          break;
      case 'int':
          prof = (document.getElementById("arcana-proficiency").checked) ? 3 : 0
          document.getElementById('arcana-score').innerText = the_mod + prof;
          break;
      case 'wis':
          prof = (document.getElementById("insight-proficiency").checked) ? 3 : 0
          document.getElementById('insight-score').innerText = the_mod + prof;
          break;
      case 'cha':
          prof = (document.getElementById("persuasion-proficiency").checked) ? 3 : 0
          document.getElementById('persuasion-score').innerText = the_mod + prof;
          break;
      default:
          console.log('kanena case');
  }
}

function updateSkillCheck(skillName) {
  const skillInput = document.querySelector(`#${skillName}-score`);
  const modDisplay = document.querySelector(`#${skillName}-check`);
  const proficiencyCheckbox = document.querySelector(`#${skillName}-proficiency`);

  let baseValue = parseInt(skillInput.value) || 0;
  let proficiencyBonus = proficiencyCheckbox.checked ? 2 : 0;
  let skillCheckValue = baseValue + abilityScoreModifier(baseValue) + proficiencyBonus;

  modDisplay.textContent = `Check: ${skillCheckValue}`;
}

function updateSubclassOptions() {
  const classSubclassMap = {
      Barbarian: ["Berserker", "Zealot"],
      Paladin: ["Oath of Devotion", "Oath of Ancients"],
      Rogue: ["Assassin", "Thief"],
      Cleric: ["Life", "Light", "War"]
  };

  const classSelect = document.getElementById("classGuess");
  const subclassSelect = document.getElementById("subclass");
  const selectedClass = classSelect.value;

  // Clear existing options
  subclassSelect.innerHTML = "";

  // Populate new options
  if (classSubclassMap[selectedClass]) {
      classSubclassMap[selectedClass].forEach(subclass => {
          const option = document.createElement("option");
          option.value = subclass;
          option.textContent = subclass;
          subclassSelect.appendChild(option);
      });
  }
}