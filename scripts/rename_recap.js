const fs = require('fs');

const screensPath = 'assets/data/screens.json';
const data = JSON.parse(fs.readFileSync(screensPath, 'utf8'));

let count = 0;

function processScreens(screens) {
  if (!screens || screens.length === 0) return;

  for (const screen of screens) {
    if (screen.title && screen.title === screen.id) {
      delete screen.title;
      count++;
    }
    
    if (screen.subscreens) {
      processScreens(screen.subscreens);
    }
  }
}

processScreens(data.screens);

let text = JSON.stringify(data, null, 2);
text = text.replace(/"HalfwayRecap"/g, '"GospelHalfwayRecap"');

fs.writeFileSync(screensPath, text + '\n');
console.log(`Removed title from ${count} screens where title === id.`);
console.log('Replaced HalfwayRecap with GospelHalfwayRecap');
