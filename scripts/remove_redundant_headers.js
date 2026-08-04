const fs = require('fs');
const path = require('path');

const screensPath = path.join(__dirname, '../assets/data/screens.json');
const data = JSON.parse(fs.readFileSync(screensPath, 'utf8'));

let count = 0;

function processScreens(screens) {
  if (!screens || screens.length === 0) return;

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const fallbackText = screen.title || screen.id;

    if (screen.contents) {
      for (const content of screen.contents) {
        if (content.type === 'Header' && content.headerText) {
          // headerText could be a string or an object {text: '...'}
          const text = typeof content.headerText === 'string' ? content.headerText : content.headerText.text;
          if (text === fallbackText) {
            delete content.headerText;
            count++;
          }
        }
      }
    }

    if (screen.subscreens) {
      processScreens(screen.subscreens);
    }
  }
}

processScreens(data.screens);

fs.writeFileSync(screensPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Removed headerText from ${count} headers in screens.json.`);
