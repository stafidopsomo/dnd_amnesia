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

  //tmp color change on select
  colorSelection(classSelect);
  colorSelection(subclassSelect);

  //if (classSelect.options[classSelect.selectedIndex].classList.contains('red-highlight')){
  //  classSelect.classList.remove('green-highlight');
  //  classSelect.classList.remove('no-highlight');
  //  classSelect.classList.add('red-highlight');
  //}
  //else if (classSelect.options[classSelect.selectedIndex].classList.contains('green-highlight')){
  //  classSelect.classList.remove('red-highlight');
  //  classSelect.classList.remove('no-highlight');
  //  classSelect.classList.add('green-highlight');
  //}
  //else {
  //  classSelect.classList.remove('green-highlight');
  //  classSelect.classList.remove('red-highlight');
  //  //classSelect.classList.add('no-highlight');
  //}
  // Clear existing options
  subclassSelect.innerHTML = "";

  // Populate new options
  if (classSubclassMap[selectedClass]) {
      classSubclassMap[selectedClass].forEach(subclass => {
          const option = document.createElement("option");
          option.value = subclass;
          option.textContent = subclass;
          option.classList.add('no-highlight');
          subclassSelect.appendChild(option);
      });
  }
}


function colorSelection(selection) {
  if (selection.options[selection.selectedIndex].classList.contains('red-highlight')){
    selection.classList.remove('green-highlight');
    selection.classList.remove('no-highlight');
    selection.classList.add('red-highlight');
  }
  else if (selection.options[selection.selectedIndex].classList.contains('green-highlight')){
    selection.classList.remove('red-highlight');
    selection.classList.remove('no-highlight');
    selection.classList.add('green-highlight');
  }
  else {
    selection.classList.remove('green-highlight');
    selection.classList.remove('red-highlight');
    //classSelect.classList.add('no-highlight');
  }
}
