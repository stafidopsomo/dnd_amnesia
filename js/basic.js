// Utility Functions
function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }
  
  function abilityScoreModifier(score) {
    return Math.floor((score - 10) / 2);
  }

// Define armor data
const armors = [
  { name: "Plate", type: "Heavy", strengthRequirement: 15, proficientClasses: ["Fighter", "Paladin"] },
  { name: "Chain Mail", type: "Heavy", strengthRequirement: 13, proficientClasses: ["Fighter", "Paladin"] },
  { name: "Half Plate", type: "Medium", proficientClasses: ["Fighter", "Paladin", "Ranger"] },
  { name: "Hide", type: "Medium", proficientClasses: ["Barbarian", "Druid", "Ranger"] },
  { name: "Leather Armor", type: "Light", proficientClasses: ["Bard", "Rogue", "Warlock"] },
  { name: "Padded Armor", type: "Light", proficientClasses: ["Bard", "Rogue", "Warlock"] },
];

// Define weapon data
const weapons = [
  { name: "Longsword", type: "Martial", proficientClasses: ["Fighter", "Paladin", "Barbarian"] },
  { name: "Greatsword", type: "Martial", proficientClasses: ["Fighter", "Paladin", "Barbarian"] },
  { name: "Shortsword", type: "Martial", proficientClasses: ["Fighter", "Paladin", "Rogue"] },
  { name: "Dagger", type: "Simple", proficientClasses: ["Bard", "Rogue", "Warlock", "Wizard"] },
  { name: "Quarterstaff", type: "Simple", proficientClasses: ["Druid", "Cleric", "Monk", "Wizard"] },
  { name: "Light Crossbow", type: "Simple", proficientClasses: ["Bard", "Cleric", "Wizard"] },
];