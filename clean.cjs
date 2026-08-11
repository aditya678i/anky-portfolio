const fs = require('fs');
let content = fs.readFileSync('src/CombinedSection.tsx', 'utf8');

content = content.replace(/\/\/ Mock framer imports.*?\n/g, '');
content = content.replace(/const addPropertyControls = \(component: any, controls: any\) => \{\};\n/g, '');
content = content.replace(/const ControlType = \{[\s\S]*?\};\n/g, '');
content = content.replace(/const useIsStaticRenderer = \(\) => false;\n/g, '');

fs.writeFileSync('src/CombinedSection.tsx', content);
