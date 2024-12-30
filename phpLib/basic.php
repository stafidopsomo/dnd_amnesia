<?php
function modifier($score) {
    return floor(($score - 10) / 2);
}

function read_json($file) {
    $path = __DIR__ . "/$file";
    if (file_exists($path)) {
        return json_decode(file_get_contents($path), true);
    }
    return [];
}

function random_ability_score() {
    return rand(8, 18);
}
?>