const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../assets/data/screens.json');
let content = fs.readFileSync(file, 'utf8');

// Regex to remove `"hideNavigationButtons": true` and any trailing comma
content = content.replace(/\s*"hideNavigationButtons":\s*(true|false),?/g, '');
// Cleanup any trailing commas before closing braces if the property was the last one
content = content.replace(/,(\s*})/g, '$1');

fs.writeFileSync(file, content, 'utf8');
console.log('Removed hideNavigationButtons from screens.json');
