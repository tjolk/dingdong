# Guerrilla Fashion Soundboard

## Description
This project is a web application that serves as a soundboard for Guerrilla Fashion. It allows users to play sounds and download them through an interactive interface.
The web application is intended for mobile use. It will work on desktop, but the layout isn't intended for it.
It can installed as a web app on Android/iPhone.

## Project Structure
- `index.html`: Contains the HTML structure of the web application.
- `style.css`: Contains the CSS styles for the web application.
- `script.js`: Contains the JavaScript code for handling sound playback and user interactions.
- `getSounds.php`: Contains the PHP script for reading the sound files the sounds folder.
- `README.md`: Documentation for the project.
- `/sounds`: Directory where the sound files are stored.
- `/logos`: Directory where the logo is stored.
- `/fonts`: Directory where the fonts are stored.

## Setup Instructions
1. Copy the files to your webserver.
2. Add/remove sound files in the sounds directory.
3. Rename the sound files.
    - Use the following naming convention for your sound files:  
        `GF_##_TITLE.mp3`  
        - `##`: Determines the order of the buttons (e.g., 01, 02, 03, ...)
        - `TITLE`: Determines the title of the buttons (e.g., TOXIC, DANGER, ABYSS, ...)

## Usage
- Click on the buttons to play sounds.
- Hold the buttons to download the sounds.
- Use the "Play All" button to play all sounds in sequence.

## Dependencies
- Ensure that the sound files are located in the `sounds` directory as specified in the JavaScript code.
- The project uses standard web technologies (HTML, CSS, JavaScript)
- The project needs at least PHP 8.0 to run this code.