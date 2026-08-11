const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\adity\\.gemini\\antigravity\\brain\\87ab7282-008c-4f74-bbb5-2bfbf53e9695';
const componentsDir = path.join(__dirname, 'src', 'components');

if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

const filesToExtract = {
    'framer_hero_alex.md': 'HeroAlex.tsx',
    'framer_recent_edits_carousel.md': 'RecentEditsCarousel.tsx',
    'framer_shorts_carousel.md': 'ShortsCarousel.tsx',
    'framer_long_form_carousel.md': 'LongFormCarousel.tsx',
    'framer_services_scroll.md': 'ServicesScroll.tsx',
    'framer_pricing_section.md': 'PricingSection.tsx'
};

for (const [mdName, tsxName] of Object.entries(filesToExtract)) {
    const mdPath = path.join(brainDir, mdName);
    if (!fs.existsSync(mdPath)) {
        console.warn(`File not found: ${mdPath}`);
        continue;
    }
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    
    let match = mdContent.match(/```(?:tsx|jsx)\n([\s\S]*?)\n```/);
    let tsxContent = match ? match[1] : mdContent; // fallback to raw content
    
    if (tsxContent) {
        // Strip mock framer imports which might conflict
        tsxContent = tsxContent.replace(/\/\/ Mock framer imports[\s\S]*?(?=import|\n\n)/g, '');
        tsxContent = tsxContent.replace(/const addPropertyControls = \(component: any, controls: any\) => \{\};\n/g, '');
        tsxContent = tsxContent.replace(/const ControlType = \{[\s\S]*?\};\n/g, '');
        tsxContent = tsxContent.replace(/const useIsStaticRenderer = \(\) => false;\n/g, '');
        
        fs.writeFileSync(path.join(componentsDir, tsxName), tsxContent);
        console.log(`Extracted ${tsxName}`);
    } else {
        console.warn(`No tsx block found in ${mdName}`);
    }
}
