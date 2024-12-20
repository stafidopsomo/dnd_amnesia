<?php
header('Content-Type: application/json; charset=utf-8');

function read_json($file) {
    $path = __DIR__ . "/$file";
    if (file_exists($path)) {
        return json_decode(file_get_contents($path), true);
    }
    return [];
}

$barbarian_data = read_json("barbarian.json");
$paladin_data = read_json("paladin.json");
$rogue_data = read_json("rogue.json");

$classes = [
    "Barbarian" => $barbarian_data,
    "Paladin" => $paladin_data,
    "Rogue" => $rogue_data
];

$races = ["Human", "Elf", "Dwarf", "Halfling"];
$names = ["Thrag Ironfist", "Elandra Moonblade", "Durnan Oakenshield", "Seraphina Swiftfoot"];

function random_ability_score() {
    return rand(8, 18);
}

function modifier($score) {
    return floor(($score - 10) / 2);
}

$classKeys = array_keys($classes);
$selectedClass = $classKeys[array_rand($classKeys)];
$classData = $classes[$selectedClass];

$selectedSubclass = $classData["subclasses"][array_rand($classData["subclasses"])] ?? "";
$level = rand(5, 6);
$selectedRace = $races[array_rand($races)];
$selectedName = $names[array_rand($names)];

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

$selectedWeapons = $classData["weapons"] ?? [];
$armor = $classData["armor"] ?? [
    "name" => "Leather Armor",
    "description" => "AC = 11 + Dex modifier"
];

$selectedFeatures = $classData["features"] ?? [];
if ($selectedClass === "Barbarian" && $level >= 5) {
    $selectedFeatures[] = ["name" => "Extra Attack", "description" => "You can attack twice with Attack action."];
}

$armor_class = 10 + modifier($abilities['dex']);
if ($armor['name'] === "Leather Armor") {
    $armor_class = 11 + modifier($abilities['dex']);
}

$initiative = modifier($abilities['dex']);
$speed = ($selectedRace === "Dwarf" || $selectedRace === "Halfling") ? 25 : 30;
$speed += $classData["speed_bonus"] ?? 0;

$hit_die = $classData["hit_die"] ?? 8;
$hp = $hit_die + modifier($abilities['con'])*(int)$level + ($hit_die*($level-1));

$character = [
    "name" => $selectedName,
    "class" => $selectedClass,
    "subclass" => $selectedSubclass,
    "level" => $level,
    "race" => $selectedRace,
    "abilities" => $abilities,
    "proficiency_bonus" => $proficiency_bonus,
    "perception" => modifier($abilities['wis']),
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
    "armor" => $armor,
    "features_and_traits" => $selectedFeatures
];

echo json_encode($character, JSON_PRETTY_PRINT);
