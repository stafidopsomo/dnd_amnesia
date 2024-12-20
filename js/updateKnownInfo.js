// Track discovered info
let knownInfo = {
  speed: null,
  armor: null,
  armorProficiencies: null,
  armorStrengthRequirement: null,
  strengthLevel: null,
  weapons: null,
  weaponProficiencies: null
};

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
    infoDiv.innerHTML += `<p><strong>Armor:</strong> ${knownInfo.armor}: <br>${knownInfo.armorProficiencies}`;
    if (knownInfo.armorStrengthRequirement) {
      infoDiv.innerHTML += `<br>${knownInfo.armorStrengthRequirement}`
    }
    infoDiv.innerHTML += `</p>`
    hasInfo = true;
  }

  if (knownInfo.weapons) {
    infoDiv.innerHTML += `<p><strong>Weapons:</strong> ${knownInfo.weapons}: <br>${knownInfo.weaponProficiencies}</p>`;
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