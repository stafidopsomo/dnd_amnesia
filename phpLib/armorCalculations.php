<?php

function calculateArmorClass($armor, $abilities, $selectedClass, $selectedFeatures) {
    $dexMod = modifier($abilities['dex']);
    $conMod = modifier($abilities['con']);
    $wisMod = modifier($abilities['wis']);

    // Base armor class
    $armor_class = 10 + $dexMod;

    // Adjust for armor type
    if ($armor['name'] === "Leather Armor") {
        $armor_class = 11 + $dexMod;
    } elseif ($armor['name'] === "Chain Mail") {
        $armor_class = 16;
        if ($abilities['str'] < 13) {
            $armor_class -= 2; // Strength requirement penalty
        }
    } elseif ($armor['name'] === "Plate") {
        $armor_class = 18;
        if ($abilities['str'] < 15) {
            $armor_class -= 2; // Strength requirement penalty
        }
    } elseif ($armor['name'] === "Half Plate") {
        $armor_class = 15 + min($dexMod, 2); // Medium armor cap
    } elseif ($armor['name'] === "Hide") {
        $armor_class = 12 + min($dexMod, 2); // Medium armor cap
    }

    $features = array_column($selectedFeatures, "name");

    // Class features affecting armor class
    if ($selectedClass === "Barbarian" && in_array("Unarmored Defense", $features)) {
        $armor_class = max($armor_class, 10 + $dexMod + $conMod);
    } elseif ($selectedClass === "Monk" && in_array("Unarmored Defense", $features)) {
        $armor_class = max($armor_class, 10 + $dexMod + $wisMod);
    } elseif ($selectedClass === "Sorcerer" && in_array("Draconic Resilience", $features)) {
        $armor_class = max($armor_class, 13 + $dexMod);
    }

    return $armor_class;
}
?>
