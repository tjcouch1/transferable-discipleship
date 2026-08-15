const fs = require('fs');
const path = require('path');

const screensPath = path.join(__dirname, '../assets/data/screens.json');
const data = JSON.parse(fs.readFileSync(screensPath, 'utf8'));

const flaggedScreens = [];

function getHeaderText(screen) {
  if (screen.contents) {
    for (const content of screen.contents) {
      if (content.type === 'Header') {
        if (content.headerText) {
          return typeof content.headerText === 'string' ? content.headerText : content.headerText.text;
        }
      }
    }
  }
  return null;
}

function processScreens(screens, parentId) {
  if (!screens || screens.length === 0) return;

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    
    const title = screen.title;
    const id = screen.id;
    
    if (title && title !== id && title === parentId) {
      const headerText = getHeaderText(screen);
      flaggedScreens.push({
        id,
        title,
        parentId,
        headerText,
      });
      // apply the fix:
      if (headerText) {
        screen.title = headerText;
      } else {
        console.log(`Warning: ${id} has no headerText to use as title.`);
      }
    }

    if (screen.subscreens) {
      processScreens(screen.subscreens, id);
    }
  }
}

processScreens(data.screens, null);

fs.writeFileSync(screensPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated ${flaggedScreens.length} screens.`);
