const fs = require('fs');
const path = require('path');

const screensPath = path.join(__dirname, '../assets/data/screens.json');
const data = JSON.parse(fs.readFileSync(screensPath, 'utf8'));

interface Screen {
  id: string;
  subscreens?: Screen[];
}

const showButtonsList: string[] = [];
const hideButtonsList: string[] = [];
let totalScreens = 0;

function processScreens(screens: Screen[], parentPath: string) {
  if (!screens || screens.length === 0) return;

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const currentPath = parentPath ? `${parentPath}/${screen.id}` : screen.id;
    totalScreens++;
    
    // Check if it has siblings
    const hasPrev = i > 0;
    const hasNext = i < screens.length - 1;
    const hasSiblings = hasPrev || hasNext;

    // A screen is a leaf if it doesn't have child screens
    const isLeaf = !screen.subscreens || screen.subscreens.length === 0;

    // The proposed new logic: ONLY leaf screens WITH siblings show the button.
    // The new logic: ONLY leaf screens WITH siblings show the button.
    const shouldShow = isLeaf && hasSiblings;

    if (shouldShow) {
      showButtonsList.push(currentPath);
    } else {
      hideButtonsList.push(currentPath);
    }

    if (screen.subscreens) {
      processScreens(screen.subscreens, currentPath);
    }
  }
}

// Start processing from root screens
processScreens(data.screens, 'app:');

console.log(`--- TOTAL SCREENS: ${totalScreens} ---`);

console.log('\n--- WOULD SHOW BUTTONS (Leaf AND Has Siblings) ---');
showButtonsList.forEach(p => console.log(p));
console.log('\nTotal:', showButtonsList.length);

console.log('\n\n--- WOULD HIDE BUTTONS (Non-Leaf OR No Siblings) ---');
hideButtonsList.forEach(p => console.log(p));
console.log('\nTotal:', hideButtonsList.length);
