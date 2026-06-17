const fs = require('fs');

let content = fs.readFileSync('./prisma/seed.ts', 'utf8');

const newCategoryData = `const categoryData = [
    { name: "Accessories", slug: "accessories", description: "Handbags, hats, sunglasses, and personal accessories.", level: 0, sortOrder: 1, isFeatured: true },
    { name: "Art & Collectibles", slug: "art-collectibles", description: "Fine art, prints, and rare collectibles.", level: 0, sortOrder: 2, isFeatured: true },
    { name: "Bags & Purses", slug: "bags-purses", description: "Totes, backpacks, and stylish purses.", level: 0, sortOrder: 3, isFeatured: false },
    { name: "Bath & Beauty", slug: "bath-beauty", description: "Skincare, soaps, and beauty essentials.", level: 0, sortOrder: 4, isFeatured: false },
    { name: "Books, Movies & Music", slug: "books-movies-music", description: "Media, literature, and entertainment.", level: 0, sortOrder: 5, isFeatured: false },
    { name: "Clothing", slug: "clothing", description: "Fashion, apparel, and wearables.", level: 0, sortOrder: 6, isFeatured: true },
    { name: "Craft Supplies & Tools", slug: "craft-supplies-tools", description: "Materials and tools for makers.", level: 0, sortOrder: 7, isFeatured: false },
    { name: "Electronics & Accessories", slug: "electronics-accessories", description: "Gadgets, tech, and digital accessories.", level: 0, sortOrder: 8, isFeatured: true },
    { name: "Gifts", slug: "gifts", description: "Perfect gifts for any occasion.", level: 0, sortOrder: 9, isFeatured: true },
    { name: "Home & Living", slug: "home-living", description: "Decor, furniture, and home essentials.", level: 0, sortOrder: 10, isFeatured: true },
    { name: "Jewelry", slug: "jewelry", description: "Necklaces, rings, and fine jewelry.", level: 0, sortOrder: 11, isFeatured: true },
    { name: "Kids & Baby", slug: "kids-baby", description: "Clothing, toys, and essentials for children.", level: 0, sortOrder: 12, isFeatured: false },
    { name: "Paper & Party Supplies", slug: "paper-party-supplies", description: "Stationery, cards, and party decor.", level: 0, sortOrder: 13, isFeatured: false },
    { name: "Pet Supplies", slug: "pet-supplies", description: "Accessories and essentials for pets.", level: 0, sortOrder: 14, isFeatured: false },
    { name: "Shoes", slug: "shoes", description: "Footwear for all occasions.", level: 0, sortOrder: 15, isFeatured: false },
    { name: "Toys & Games", slug: "toys-games", description: "Fun and games for all ages.", level: 0, sortOrder: 16, isFeatured: false },
    { name: "Weddings", slug: "weddings", description: "Bridal, decor, and wedding essentials.", level: 0, sortOrder: 17, isFeatured: false }
  ];`;

// Replace categoryData
content = content.replace(/const categoryData = \[[\s\S]*?\];/, newCategoryData);

const newGetCatSlug = `function getCatSlug(name: string): string {
    return name.toLowerCase().replace(/\\s+/g, "-").replace(/&/g, "").replace(/--/g, "-");
  }`;

content = content.replace(/function getCatSlug\([\s\S]*?}[\s\S]*?}/, newGetCatSlug);

// Replace productCategoryMap
const oldMapRegex = /const productCategoryMap: Record<string, string\[\]> = {[\s\S]*?};\n/g;

const newMap = `const productCategoryMap: Record<string, string[]> = {
    // Hemachandra products
    "HHL-DUM-SAR-001": ["clothing"],
    "HHL-KAN-WALL-002": ["home-living"],
    "HHL-COT-SAR-003": ["clothing"],
    "HHL-MED-CUSH-004": ["home-living"],
    "HHL-LOT-RUN-005": ["home-living"],
    "HHL-BBY-SWD-006": ["kids-baby"],
    "HHL-BCH-WRP-007": ["clothing"],
    "HHL-KRT-FAB-008": ["craft-supplies-tools"],
    "HHL-WED-SAR-009": ["weddings"],
    "HHL-CUS-SET-010": ["home-living"],

    // Gunawardena products
    "GWC-AMB-NAGA-011": ["art-collectibles"],
    "GWC-KAN-MOON-012": ["art-collectibles"],
    "GWC-TEA-ELE-013": ["art-collectibles"],
    "GWC-EBO-LOT-014": ["art-collectibles"],
    "GWC-EMB-DNC-015": ["art-collectibles"],
    "GWC-GAR-YAK-016": ["art-collectibles"],
    "GWC-MAH-BUD-017": ["home-living"],
    "GWC-JAC-SPI-018": ["home-living"],
    "GWC-TEA-BKE-019": ["home-living"],
    "GWC-KOL-PAN-020": ["toys-games"],

    // Kulatunga products
    "KPS-CLY-CUR-021": ["home-living"],
    "KPS-TER-JUG-022": ["home-living"],
    "KPS-GLZ-DIN-023": ["home-living"],
    "KPS-TER-PLN-024": ["home-living"],
    "KPS-OIL-PAH-025": ["home-living"],
    "KPS-CLY-TEA-026": ["home-living"],
    "KPS-TER-SNG-027": ["home-living"],
    "KPS-ART-MUG-028": ["home-living"],
    "KPS-TER-TAN-029": ["home-living"],
    "KPS-BON-POT-030": ["home-living"],

    // Rajapakse products
    "RBG-BRS-LMP-031": ["home-living"],
    "RBG-SAP-PEN-032": ["jewelry"],
    "RBG-BRS-TRY-033": ["home-living"],
    "RBG-MNS-RNG-034": ["jewelry"],
    "RBG-BRS-BEL-035": ["home-living"],
    "RBG-GAR-EAR-036": ["jewelry"],
    "RBG-BRS-WAL-037": ["home-living"],
    "RBG-STR-CUF-038": ["jewelry"],
    "RBG-BRS-DOR-039": ["home-living"],
    "RBG-PRL-NEC-040": ["jewelry"],
  };
`;
content = content.replace(oldMapRegex, newMap);

// The getCatSlug replacement for line 1507
content = content.replace(/const categorySlug = getCatSlug\("Handloom & Textiles"\);/g, 'const categorySlug = "clothing";');

fs.writeFileSync('./prisma/seed.ts', content, 'utf8');
console.log('Done!');
