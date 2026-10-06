// d:\ael\ael_backend\src\scripts\seed_real_safety_guidelines.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Page } from "../models/page.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ael";

/**
 * Robust pure Node.js PDF 1.4 Generator
 * Creates standard-compliant, printable, beautiful A4 PDF documents
 */
function createPdfDocument({ title, subtitle, category, code, documentDate, sections }) {
  // Page size: A4 (595.28 x 841.89 points)
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  let streamContent = "";

  // Helper for drawing shapes
  const rect = (x, y, w, h, fill = true, stroke = false, fillColor = [0.95, 0.95, 0.95], strokeColor = [0.8, 0.8, 0.8]) => {
    let res = "";
    if (fill) {
      res += `${fillColor[0]} ${fillColor[1]} ${fillColor[2]} rg\n`;
    }
    if (stroke) {
      res += `${strokeColor[0]} ${strokeColor[1]} ${strokeColor[2]} RG\n0.75 w\n`;
    }
    res += `${x} ${y} ${w} ${h} re\n`;
    if (fill && stroke) res += "B\n";
    else if (fill) res += "f\n";
    else if (stroke) res += "S\n";
    return res;
  };

  // Top header banner background (Navy primary #1D4E91 -> rgb: 0.114, 0.306, 0.569)
  streamContent += rect(0, 750, pageWidth, 92, true, false, [0.08, 0.22, 0.44]);

  // Accent gold line below header
  streamContent += rect(0, 746, pageWidth, 4, true, false, [0.85, 0.65, 0.15]);

  // Header Title
  streamContent += `BT\n/F1 18 Tf\n1 1 1 rg\n50 795 Td\n(${escapePdfText(title)}) Tj\nET\n`;

  // Header Subtitle & Category
  streamContent += `BT\n/F2 10 Tf\n0.88 0.92 0.98 rg\n50 775 Td\n(BANGLADESH LPG SAFETY & REGULATORY COMPLIANCE PLATFORM) Tj\nET\n`;
  streamContent += `BT\n/F1 9 Tf\n1 0.85 0.3 rg\n50 760 Td\n(CODE: ${escapePdfText(code)}  |  CATEGORY: ${escapePdfText(category.toUpperCase())}  |  ISSUED: ${escapePdfText(documentDate)}) Tj\nET\n`;

  // Watermark / Subtitle Banner Box
  streamContent += rect(50, 695, 495, 36, true, true, [0.96, 0.98, 1.0], [0.8, 0.88, 0.98]);
  streamContent += `BT\n/F1 10 Tf\n0.1 0.25 0.5 rg\n65 714 Td\n(${escapePdfText(subtitle)}) Tj\nET\n`;
  streamContent += `BT\n/F2 8.5 Tf\n0.35 0.45 0.55 rg\n65 702 Td\n(Statutory Reference: Department of Explosives (DoE) & Bangladesh Energy Regulatory Commission (BERC)) Tj\nET\n`;

  let currentY = 665;

  // Render Sections
  for (const sec of sections) {
    if (currentY < 120) break; // Keep within single A4 page neatly

    // Section Header Box
    streamContent += rect(50, currentY - 5, 495, 20, true, false, [0.93, 0.95, 0.98]);
    streamContent += `BT\n/F1 10 Tf\n0.08 0.22 0.44 rg\n58 ${currentY} Td\n(${escapePdfText(sec.heading)}) Tj\nET\n`;
    currentY -= 20;

    // Bullet points or paragraphs
    for (const point of sec.points) {
      if (currentY < 100) break;
      streamContent += `BT\n/F1 9 Tf\n0.08 0.22 0.44 rg\n60 ${currentY} Td\n([*]) Tj\nET\n`;
      streamContent += `BT\n/F2 9 Tf\n0.2 0.2 0.2 rg\n78 ${currentY} Td\n(${escapePdfText(point)}) Tj\nET\n`;
      currentY -= 14;
    }
    currentY -= 6;
  }

  // Bottom Trust & Hotline Box
  streamContent += rect(50, 42, 495, 44, true, true, [0.98, 0.98, 0.98], [0.85, 0.85, 0.85]);
  streamContent += `BT\n/F1 9 Tf\n0.7 0.1 0.1 rg\n62 70 Td\n(24/7 LPG EMERGENCY HOTLINES: Fire Service: 16137  |  National Emergency: 999  |  DoE Central: +880 2-9335445) Tj\nET\n`;
  streamContent += `BT\n/F2 8 Tf\n0.4 0.4 0.4 rg\n62 56 Td\n(This is an official technical compliance document published by AEL SafeLPG Bangladesh. Authorized distribution only.) Tj\nET\n`;
  streamContent += `BT\n/F1 8 Tf\n0.15 0.3 0.6 rg\n420 56 Td\n(Verify Online: lpgsafety.org.bd) Tj\nET\n`;

  // Construct PDF Objects with accurate byte offsets
  const objects = [];
  const addObj = (content) => {
    objects.push(content);
    return objects.length; // 1-indexed
  };

  // Obj 1: Catalog
  addObj(`<< /Type /Catalog /Pages 2 0 R >>`);
  // Obj 2: Pages
  addObj(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`);
  // Obj 3: Page
  addObj(`<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 ${pageWidth} ${pageHeight}]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /Contents 6 0 R
>>`);
  // Obj 4: Font Bold
  addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);
  // Obj 5: Font Regular
  addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  // Obj 6: Content Stream
  const streamBytes = Buffer.from(streamContent, "utf-8");
  addObj(`<< /Length ${streamBytes.length} >>\nstream\n${streamContent}\nendstream`);

  // Build binary buffer
  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "utf-8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const startXref = Buffer.byteLength(pdf, "utf-8");
  pdf += "xref\n";
  pdf += `0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += "trailer\n";
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += "startxref\n";
  pdf += `${startXref}\n`;
  pdf += "%%EOF\n";

  return Buffer.from(pdf, "utf-8");
}

function escapePdfText(text = "") {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " "); // Replace non-ascii with spaces for Type1 standard Helvetica
}

async function run() {
  console.log("Connecting to MongoDB:", MONGODB_URL);
  await mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB successfully.");

  const uploadDir = path.join(__dirname, "../../public/upload");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 4 Real Technical Guideline Definitions
  const guidelines = [
    {
      id: 1,
      targetTab: "investors",
      category: "Investors",
      nameEn: "Industrial LPG Bulk Storage & Plant Safety Norms",
      nameBn: "শিল্প কারখানা এলপিজি বাল্ক মজুত ও প্ল্যান্ট নিরাপত্তা নীতিমালা",
      type: "PDF",
      access: "Login Required",
      fileName: "investor-lpg-safety-manual.pdf",
      code: "AEL-SOP-INV-2024",
      date: "May 2024",
      subtitle: "Mandatory Engineering Norms for Bulk Storage Tanks, Manifolds & Auto-Shutoff",
      sections: [
        {
          heading: "1. BULK STORAGE SAFETY CLEARANCES (NFPA 58 / DoE RULE 1991)",
          points: [
            "Maintain minimum 15-meter buffer from property boundaries for storage > 20,000L.",
            "Install high-decibel hydrocarbon vapor sensors at 0.3m above ground near valves.",
            "Ensure dual earthing electrodes with ground resistance < 1.0 Ohm across all vessels.",
            "Equip all discharge manifolds with fail-safe pneumatic Emergency Shutoff Valves (ESV).",
          ],
        },
        {
          heading: "2. PERIODIC INSPECTION, TESTING & STATUTORY LICENSING",
          points: [
            "Perform mandatory hydrostatic pressure testing every 5 years under DoE surveyor.",
            "Calibrate pressure relief valves (PRV) annually; set pressure at 1.1x design rating.",
            "Maintain 24/7 dedicated deluge water spray system supplying 10.2 L/min/m2.",
            "Renew Department of Explosives (DoE) and Fire Service licenses prior to expiration.",
          ],
        },
        {
          heading: "3. PLANT OPERATIONAL PROTOCOLS & ACCIDENT PREVENTION",
          points: [
            "Prohibit all non-intrinsically safe electrical equipment inside Zone 1 & Zone 2 areas.",
            "Enforce strict Permit-to-Work (PTW) protocols for all hot work within 30 meters.",
            "Conduct quarterly full-scale emergency evacuation drills with local Fire Service.",
          ],
        },
      ],
    },
    {
      id: 2,
      targetTab: "dealer",
      category: "Dealer",
      nameEn: "LPG Retail Dealer Storage & Cylinder Handling SOP",
      nameBn: "এলপিজি ডিলার গুদাম মজুত ও সিলিন্ডার হ্যান্ডলিং স্ট্যান্ডার্ড প্রসিডিউর",
      type: "PDF",
      access: "Public",
      fileName: "dealer-cylinder-storage-sop.pdf",
      code: "AEL-SOP-DLR-2024",
      date: "May 2024",
      subtitle: "Warehouse Storage, Safe Stacking, Ventilation & Commercial Compliance Standards",
      sections: [
        {
          heading: "1. RETAIL WAREHOUSE VENTILATION & STORAGE SPECIFICATIONS",
          points: [
            "Store cylinders strictly in well-ventilated, ground-floor non-combustible sheds.",
            "Ensure natural cross-ventilation with louvered floor-level vents (LPG is heavier than air).",
            "Stack empty or full cylinders strictly upright; maximum allowed stacking is 2 tiers.",
            "Keep storage area strictly clear of flammable chemicals, stoves, or open flames.",
          ],
        },
        {
          heading: "2. RECEIVING, INSPECTION & HANDLING PROCEDURES",
          points: [
            "Inspect every inbound cylinder for intact seal, tare weight, and valve neck integrity.",
            "Never drop, roll horizontally, or drag cylinders during loading or unloading.",
            "Conduct mandatory soap-water leak testing on suspected valves before customer handover.",
            "Quarantine and report damaged, dented, or overdue hydro-test cylinders immediately.",
          ],
        },
        {
          heading: "3. FIRE SAFETY GEAR & CONSUMER ADVISORY DUTIES",
          points: [
            "Deploy minimum two 9kg Dry Chemical Powder (DCP) extinguishers at warehouse entry.",
            "Display emergency telephone numbers (Fire Service 16137) prominently on the wall.",
            "Educate every purchaser on safe vertical cylinder transport and regulator snap-lock.",
          ],
        },
      ],
    },
    {
      id: 3,
      targetTab: "distributor",
      category: "Distributor",
      nameEn: "Bulk Road Tanker & Cylinder Transit Safety Code",
      nameBn: "বাল্ক রোড ট্যাঙ্কার ও সড়ক পরিবহন নিরাপত্তা কোড",
      type: "PDF",
      access: "Login Required",
      fileName: "distributor-transportation-safety-code.pdf",
      code: "AEL-SOP-DST-2024",
      date: "May 2024",
      subtitle: "HAZMAT Transport Standards, Static Bonding, Speed Limits & Route Safety",
      sections: [
        {
          heading: "1. ROAD TANKER SPECIFICATIONS & RIGID MECHANICAL FITNESS",
          points: [
            "Install certified spark arrestors on vehicle exhaust systems at all times.",
            "Ensure static grounding bonding reel is firmly attached before hose connection.",
            "Equip all tankers with rear-end crash bumper guards extending 150mm beyond tank rear.",
            "Maintain digital GPS telemetry logging vehicle speed, route deviation, and braking.",
          ],
        },
        {
          heading: "2. CYLINDER CARRIER TRUCK SAFETY GUIDELINES",
          points: [
            "Transport cylinders exclusively in upright positions secured with heavy-duty lashings.",
            "Ensure truck cargo floor is non-sparking (timber lined or rubber bonded).",
            "Never transport passengers, matches, lighters, or loose steel tools in the cargo bed.",
            "Strictly observe urban transit windows and avoid congested residential roads during rush hours.",
          ],
        },
        {
          heading: "3. ON-ROAD EMERGENCY INCIDENT RESPONSE PROTOCOLS",
          points: [
            "In case of breakdown or leak, immediately park in open area and place caution reflectors at 50m.",
            "Stop engine immediately, disconnect battery master switch, and notify emergency hotline 16137.",
            "Keep bystanders at minimum 100m upwind; never allow smoking or vehicle ignition nearby.",
          ],
        },
      ],
    },
    {
      id: 4,
      targetTab: "customer",
      category: "Customer",
      nameEn: "Household LPG Cylinder Safety, Regulator & Leakage Guide",
      nameBn: "গৃহস্থালি এলপিজি সিলিন্ডার ব্যবহার, রেগুলেটর ও লিকেজ সতর্কতা নির্দেশিকা",
      type: "PDF",
      access: "Public",
      fileName: "customer-household-lpg-safety-guide.pdf",
      code: "AEL-SOP-CST-2024",
      date: "May 2024",
      subtitle: "Kitchen Safety, Safe Regulator Connection, Leak Detection & Life-Saving Protocols",
      sections: [
        {
          heading: "1. SAFE INSTALLATION & STORAGE IN HOUSEHOLD KITCHENS",
          points: [
            "Always keep LPG cylinders strictly upright on a firm, level floor in a ventilated area.",
            "Never place cylinders inside enclosed, unventilated cabinets or below ground level.",
            "Maintain at least 1 meter distance between the cylinder and your gas stove or electrical switches.",
            "Use only certified low-pressure click-on regulators with undamaged O-ring rubber seals.",
          ],
        },
        {
          heading: "2. HOSE INSPECTION, REPLACEMENT & LEAK DETECTION",
          points: [
            "Use only certified reinforced rubber hoses (BDS 1499 standard); replace every 2 years.",
            "Test connections regularly using soapy water sponge. NEVER use matchsticks or candles!",
            "Look for bubbles on regulator neck or hose joints. If bubbles appear, turn off regulator.",
            "Always turn off cylinder regulator knob at night or when leaving the house unattended.",
          ],
        },
        {
          heading: "3. CRITICAL EMERGENCY PROTOCOL IF YOU SMELL GAS",
          points: [
            "DO NOT touch any electric switch, refrigerator door, or mobile phone in the kitchen.",
            "Immediately turn the cylinder regulator switch to OFF position.",
            "Open all kitchen windows and doors wide to allow gas vapor to disperse naturally.",
            "Evacuate family members calmly outside into fresh air and call Fire Service at 16137.",
          ],
        },
      ],
    },
  ];

  // 1. Generate and write all 4 real PDF files to disk
  for (const g of guidelines) {
    const pdfBuffer = createPdfDocument({
      title: g.nameEn,
      subtitle: g.subtitle,
      category: g.category,
      code: g.code,
      documentDate: g.date,
      sections: g.sections,
    });

    const targetPath = path.join(uploadDir, g.fileName);
    fs.writeFileSync(targetPath, pdfBuffer);
    console.log(`[OK] Generated real PDF: ${g.fileName} (${pdfBuffer.length} bytes) at ${targetPath}`);
  }

  // 2. Prepare database payload - ONLY the 4 clean, real PDF documents
  const documentDownloads = guidelines.map((g) => ({
    id: g.id,
    nameEn: g.nameEn,
    nameBn: g.nameBn,
    targetTab: g.targetTab,
    type: g.type,
    access: g.access,
    fileName: g.fileName,
    pdfUrl: `/public/upload/${g.fileName}`,
  }));

  // 3. Update MongoDB
  const page = await Page.findOne({ pageKey: "safety-guidelines" });
  if (page) {
    const existingSections = page.sections || {};
    page.sections = {
      ...existingSections,
      documentDownloads: documentDownloads, // Replace entirely with the 4 real items
    };
    page.markModified("sections");
    await page.save();
    console.log("[OK] Successfully updated MongoDB pageKey 'safety-guidelines'. Old data cleared, 4 real PDF entries saved.");
  } else {
    console.log("[WARN] Page 'safety-guidelines' not found in database. Creating fresh page...");
    await Page.create({
      pageKey: "safety-guidelines",
      title: "Safety Guidelines",
      titleBn: "নিরাপত্তা নির্দেশিকা",
      sections: {
        documentDownloads: documentDownloads,
      },
      isPublished: true,
    });
    console.log("[OK] Created fresh 'safety-guidelines' page in MongoDB.");
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. All tasks finished successfully!");
}

run().catch((err) => {
  console.error("Error executing script:", err);
  process.exit(1);
});
