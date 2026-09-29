<?php
header('Content-Type: application/json');

$soundDir = __DIR__ . '/sounds/';
$sounds = [];

$files = is_dir($soundDir) ? scandir($soundDir) : [];

foreach ($files as $file) {
    if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) !== 'mp3') {
        continue;
    }
    // Titel: zonder extensie, zonder 'GF_' prefix en zonder volgnummer ('01_')
    $title = pathinfo($file, PATHINFO_FILENAME);
    $title = preg_replace('/^GF_/', '', $title);
    $title = preg_replace('/^\d+_/', '', $title);
    $sounds[] = ['file' => $file, 'title' => $title];
}

echo json_encode($sounds);
