<?php
header('Content-Type: application/json');

$soundDir = 'sounds/';
$sounds = [];

foreach (scandir($soundDir) as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'mp3') {
        $filename = pathinfo($file, PATHINFO_FILENAME);
        // Verwijder 'GF_' prefix als je dat wilt
        if (str_starts_with($filename, 'GF_')) {
            $filename = substr($filename, 3);
        }
        $sounds[] = $filename;
    }
}

echo json_encode($sounds);
