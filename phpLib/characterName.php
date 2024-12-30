<?php
function assignName($selectedRace, $selectedClass, $selectedSubclass, $selectedBackground) {

    // Define pools of first and last names for each class + subclass
    $classNames = [
        "Barbarian" => [
            "Zealot" => [
                "first" => ["Thrag", "Karn", "Volkan", "Ragna"],
                "last" => ["Stormbringer", "Warcry", "Bloodfang", "Ravenshield"]
            ],
            "Berserker" => [
                "first" => ["Ulf", "Skara", "Bjorn", "Astrid"],
                "last" => ["Ironclad", "Frostaxe", "Wolfborn", "Thundertusk"]
            ]
        ],
        "Paladin" => [
            "Oath of Devotion" => [
                "first" => ["Aedan", "Liora", "Cedric", "Isolde"],
                "last" => ["Lightbringer", "Dawnsword", "Holyshield", "Silverhand"]
            ],
            "Oath of Ancients" => [
                "first" => ["Eryndor", "Faelar", "Sylwen", "Loriel"],
                "last" => ["Oakenshield", "Forestkeeper", "Greenshadow", "Leafwhisper"]
            ]
        ],
        "Rogue" => [
            "Thief" => [
                "first" => ["Shade", "Kyra", "Felix", "Tess"],
                "last" => ["Shadowcloak", "Quickblade", "Silentstep", "Nightstalker"]
            ],
            "Assassin" => [
                "first" => ["Ven", "Lyric", "Rin", "Calder"],
                "last" => ["Deathsblade", "Ghosthand", "Vipershadow", "Darkfang"]
            ]
        ]
    ];

    // Define pools of first and last names for each background
    $backgroundNames = [
        "Sage" => [
            "first" => ["Alaric", "Celeste", "Orin", "Lyra"],
            "last" => ["Scrollkeeper", "Archivist", "Seeker", "Wiseward"]
        ],
        "Urchin" => [
            "first" => ["Scraps", "Mira", "Finn", "Jax"],
            "last" => ["Guttersnipe", "Ratsbane", "Streetwise", "Shadowrunner"]
        ]
    ];

    // Randomly select names from each pool
    $classFirst = $classNames[$selectedClass][$selectedSubclass]["first"][array_rand($classNames[$selectedClass][$selectedSubclass]["first"])];
    $classLast = $classNames[$selectedClass][$selectedSubclass]["last"][array_rand($classNames[$selectedClass][$selectedSubclass]["last"])];

    $backgroundFirst = $backgroundNames[$selectedBackground]["first"][array_rand($backgroundNames[$selectedBackground]["first"])];
    $backgroundLast = $backgroundNames[$selectedBackground]["last"][array_rand($backgroundNames[$selectedBackground]["last"])];

    // Combine all options and select the final name
    $finalFirstNames = [$classFirst, $backgroundFirst];
    $finalLastNames = [$classLast, $backgroundLast];

    $finalFirstName = $finalFirstNames[array_rand($finalFirstNames)];
    $finalLastName = $finalLastNames[array_rand($finalLastNames)];

    // Return the final full name
    return "$finalFirstName $finalLastName";
}
?>
