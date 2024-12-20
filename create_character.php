<?php
header('Content-Type: application/json; charset=utf-8');

// Define class and subclass options
$classes = [
    "Barbarian" => ["Berserker", "Zealot"],
    "Paladin" => ["Devotion", "Ancient"],
    "Rogue" => ["Thief", "Assassin"]
];

$races = ["Human", "Elf", "Dwarf", "Halfling"];
$names = ["Thrag Ironfist", "Elandra Moonblade", "Durnan Oakenshield", "Seraphina Swiftfoot"];

function random_ability_score() {
    return rand(8, 18);
}

function modifier($score) {
    return floor(($score - 10) / 2);
}

// Randomly pick class & subclass
$classKeys = array_keys($classes);
$selectedClass = $classKeys[array_rand($classKeys)];
$selectedSubclass = $classes[$selectedClass][array_rand($classes[$selectedClass])];

// Random level between 1 and 5
$level = rand(1, 5);

// Random race and name
$selectedRace = $races[array_rand($races)];
$selectedName = $names[array_rand($names)];

// Generate abilities
$abilities = [
    "str" => random_ability_score(),
    "dex" => random_ability_score(),
    "con" => random_ability_score(),
    "int" => random_ability_score(),
    "wis" => random_ability_score(),
    "cha" => random_ability_score()
];

$proficiency_bonus = ($level < 5) ? 2 : 3;

// Basic score
$basic_score = ($selectedClass === "Rogue") ? "dex" : "str";

// Weapons by class
$weaponsByClass = [
    "Barbarian" => [
        ["name" => "Greataxe", "die" => "d12"],
        ["name" => "Handaxe", "die" => "d6"]
    ],
    "Paladin" => [
        ["name" => "Longsword", "die" => "d8"],
        ["name" => "Javelin", "die" => "d6"]
    ],
    "Rogue" => [
        ["name" => "Shortsword", "die" => "d6"],
        ["name" => "Dagger", "die" => "d4"]
    ]
];

$selectedWeapons = $weaponsByClass[$selectedClass] ?? [];

$armor = [
    "name" => "Leather Armor",
    "description" => "AC = 11 + Dex modifier"
];

$features_by_class = [
    "Barbarian" => [
        ["name" => "Rage", "description" => "Advantage on STR checks, +2 damage, resistance to physical dmg."],
        ["name" => "Reckless Attack", "description" => "Advantage on STR melee attacks, enemies have adv on you."]
    ],
    "Paladin" => [
        ["name" => "Divine Smite", "description" => "Extra radiant damage on a hit by expending spell slots."],
        ["name" => "Lay on Hands", "description" => "Heal a target by using your pool of healing power."]
    ],
    "Rogue" => [
        ["name" => "Sneak Attack", "description" => "Extra damage when you have advantage or ally near target."],
        ["name" => "Cunning Action", "description" => "Bonus action to Dash, Disengage, or Hide."]
    ]
];

$selectedFeatures = $features_by_class[$selectedClass] ?? [];

if ($selectedClass === "Barbarian" && $level >= 5) {
    $selectedFeatures[] = ["name" => "Extra Attack", "description" => "You can attack twice with Attack action."];
}

// Calculate derived stats
$armor_class = 10 + modifier($abilities['dex']);  
if ($armor['name'] === "Leather Armor") {
    $armor_class = 11 + modifier($abilities['dex']);
}

$initiative = modifier($abilities['dex']);
$speed = ($selectedRace === "Dwarf" || $selectedRace === "Halfling") ? 25 : 30;
if ($selectedClass === "Barbarian") {
    $speed += 10;
}

// Hit points: Using class-based hit die
$hit_die = [
    "Barbarian" => 12,
    "Paladin"   => 10,
    "Rogue"     => 8
];
$hd = $hit_die[$selectedClass] ?? 8;
$hp = $hd + modifier($abilities['con'])*(int)$level + ($hd*($level-1));

// Final character array
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
