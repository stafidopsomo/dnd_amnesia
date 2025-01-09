
function colorSelection(selection, guessValue) {
  if ( guessValue == 1){
    selection.classList.remove('red-highlight');
    selection.classList.remove('no-highlight');
    selection.classList.add('green-highlight');
  }
  else if ( guessValue == -1){
    selection.classList.remove('green-highlight');
    selection.classList.remove('no-highlight');
    selection.classList.add('red-highlight');
  }
  else {
    selection.classList.remove('green-highlight');
    selection.classList.remove('red-highlight');
  }
}
