<?php
require 'phpLib/armorCalculations.php';
require 'phpLib/basic.php';
require 'phpLib/characterName.php';

header('Content-Type: application/json; charset=utf-8');

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Load JSONs
$barbarian_data = read_json("../all_classes/barbarian.json");
$paladin_data = read_json("../all_classes/paladin.json");
$rogue_data = read_json("../all_classes/rogue.json");

$classes = [
    "Barbarian" => $barbarian_data,
    "Paladin" => $paladin_data,
    "Rogue" => $rogue_data
];

$races = ["Human", "Elf", "Dwarf", "Halfling"];

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Generate class/subclass/race/background/scores
$classKeys = array_keys($classes);
$selectedClass = $classKeys[array_rand($classKeys)];
$classData = $classes[$selectedClass];

$selectedSubclass = $classData["subclasses"][array_rand($classData["subclasses"])] ?? "";
$level = rand(5, 6);
$selectedRace = $races[array_rand($races)];
$selectedBackground = 'Sage';
$selectedName = assignName($selectedRace, $selectedClass, $selectedSubclass, $selectedBackground);

$abilities = [
    "str" => random_ability_score(),
    "dex" => random_ability_score(),
    "con" => random_ability_score(),
    "int" => random_ability_score(),
    "wis" => random_ability_score(),
    "cha" => random_ability_score()
];

$proficiency_bonus = ($level < 5) ? 2 : 3;
$basic_score_map = [
    "Barbarian" => "str",
    "Bard" => (rand(0, 1) === 0) ? "cha" : "dex",
    "Cleric" => "wis",
    "Druid" => "wis",
    "Fighter" => (rand(0, 1) === 0) ? "str" : "dex",
    "Monk" => "dex",
    "Paladin" => "str",
    "Ranger" => "dex",
    "Rogue" => "dex",
    "Sorcerer" => "cha",
    "Warlock" => "cha",
    "Wizard" => "int"
];
$basic_score = $basic_score_map[$selectedClass] ?? "str";

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Weapons
$selectedWeapons = $classData["weapons"] ?? [];
if ($selectedClass == 'Wizard' || $selectedClass == 'Barbarian') {
    $nonProficientWeapons = [
        ["name" => "strapon", "die" => "d12"]
    ];
} else {
    $nonProficientWeapons = [];
}

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Features
try {
    $selectedFeatures = $classData["features"];
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()], JSON_PRETTY_PRINT);
    exit;
}

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Armor 
// TODO: other armors(?)
$armor = $classData["armor"] ?? [
    "name" => "Leather Armor",
    "description" => "AC = 11 + Dex modifier"
];
$armor_class = calculateArmorClass($armor, $abilities, $selectedClass, $selectedFeatures);

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Speed
// TODO: check features and apply bonuses
$speed = ($selectedRace === "Dwarf" || $selectedRace === "Halfling") ? 25 : 30;
$speed += $classData["speed_bonus"] ?? 0;

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Initiative+hp
$initiative = modifier($abilities['dex']);


$hit_die = $classData["hit_die"] ?? 8;
$hp = $hit_die + modifier($abilities['con'])*(int)$level + ($hit_die*($level-1));

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Finalize Character
$character = [
    "name" => $selectedName,
    "class" => $selectedClass,
    "subclass" => $selectedSubclass,
    "background" => $selectedBackground,
    "level" => $level,
    "race" => $selectedRace,
    "abilities" => $abilities,
    "proficiency_bonus" => $proficiency_bonus,
    "perception" => modifier($abilities['wis']),
    "investigation" => modifier($abilities['int']),
    "Basic_Score" => $basic_score,
    "saving_throws" => [
        "strength" => modifier($abilities['str']) + $proficiency_bonus,
        "constitution" => modifier($abilities['con']) + $proficiency_bonus
    ],
    "skills" => [
        "athletics" => modifier($abilities['str']) + $proficiency_bonus,
        "stealth" => modifier($abilities['dex']) + ($selectedClass === "Rogue" ? $proficiency_bonus : 0),
        "perception" => modifier($abilities['wis'])
    ],
    "armor_class" => $armor_class,
    "initiative" => $initiative,
    "speed" => $speed,
    "hit_points" => $hp,
    "weapons" => $selectedWeapons,
    "nonProficientWeapons" => $nonProficientWeapons,
    "armor" => $armor,
    "features_and_traits" => $selectedFeatures
];

echo json_encode($character, JSON_PRETTY_PRINT);
