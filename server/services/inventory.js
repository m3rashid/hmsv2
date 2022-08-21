const { faker } = require("@faker-js/faker");

const prisma = require("../utils/prisma");
const { Category, MedType } = require("@prisma/client");
const { InventoryTypes } = require("../utils/constants");

const dummymedicines = [
  "Acetaminophen",
  "Adderall",
  "Amitriptyline",
  "Amlodipine",
  "Amoxicillin",
  "Ativan",
  "Atorvastatin",
  "Azithromycin",
  "Benzonatate",
  "Brilinta",
  "Bunavail",
  "Buprenorphine",
  "Cephalexin",
  "Ciprofloxacin",
  "Citalopram",
  "Clindamycin",
  "Clonazepam",
  "Cyclobenzaprine",
  "Cymbalta",
  "Doxycycline",
  "Dupixent",
  "Entresto",
  "Entyvio",
  "Farxiga",
  "Fentanyl",
  "Fentanyl Patch",
  "Gabapentin",
  "Gilenya",
  "Humira",
  "Hydrochlorothiazide",
  "Hydroxychloroquine",
  "Ibuprofen",
  "Imbruvica",
  "Invokana",
  "Januvia",
  "Jardiance",
  "Kevzara",
  "Lexapro",
  "Lisinopril",
  "Lofexidine",
  "Loratadine",
  "Lyrica",
  "Melatonin",
  "Meloxicam",
  "Metformin",
  "Methadone",
  "Methotrexate",
  "Metoprolol",
  "Naloxone",
  "Naltrexone",
  "Naproxen",
  "Omeprazole",
  "Onpattro",
  "Otezla",
  "Ozempic",
  "Pantoprazole",
  "Prednisone",
  "Probuphine",
  "Rybelsus",
  "secukinumab",
  "Sublocade",
  "Tramadol",
  "Trazodone",
  "Viagra",
  "Wellbutrin",
  "Xanax",
  "Zubsolv",
];

const dummynonmedicines = [
  "Baby Food",
  "Baby Utility Charges",
  "Beauty Services",
  "Belt/Braces",
  "Buds",
  "Cold Pack/ Hot Pack",
  "Carry Bags",
  "Email/ Internet Charges",
  "Food Charges (Other than patient's diet provided by hospital)",
  "Leggings",
  "Laundry Charges",
  "Mineral Water",
  "Sanitary Pad",
  "Telephone Charges",
  "Guest Services",
  "Crepe Bandage",
  "Diaper Of any type",
  "Eyelet Collar",
  "Slings",
  "Blood Grouping and Cross Matching of Donors Samples",
  "Service charges where nursing charge also charged",
  "Television Charges",
  "Surcharges",
  "Attendant Charges",
  "Extra diet of patient (Other than that which forms part of bed charge)",
  "Birth Certificate",
  "Certificate Charges",
  "Courier Charges",
  "Conveyance Charges",
  "Medical Certificate",
  "Medical Records",
  "Photocopies Charges",
  "Mortuary Charges",
  "Walking AIDS Charges",
  "Oxygen Cylinder (For usage outside the hospital)",
  "Spacer",
  "Spirometre",
  "Nebulizer Kit",
  "Steam Inhaler",
  "Armsling",
  "Thermometer",
  "Cervical Collar",
  "Splint",
  "Diabetic Foot Wear",
  "Knee Braces ( Long/ Short/ Hinged)",
  "Knee Immobilizer/Shoulder Immobilizer",
  "Lumbo Sacral Belt",
  "Nimbus Bed or Water or Air Bed Charges",
  "Ambulance Collar",
  "Ambulance Equipment",
  "Abdominal Binder",
  "Private Nurses Charges - Special Nursing Charges",
  "Sugar Free Tablets",
  "Creams Powders Lotion (Toiletries are not payable, only prescribed medical pharmaceuticals payable)",
  "ECG Electrodes",
  "Gloves",
  "Nebulization Kit",
  "Any kit with no details mentioned (Delivery kit, Orthokit, Recovery kit, etc)",
  "Kidney Tray",
  "Mask",
  "Ounce Glass",
  "Oxygen Mask",
  "Pelvic Traction Belt",
  "Pan Can",
  "Trolly Cover",
  "Urometer, Urine Jug",
  "Ambulance",
  "Vasofix Safety",
  "Baby Charges (Unless Specified/ Indicated)",
  "Hand Wash",
  "Shoe Cover",
  "Caps",
  "Cradle Charges",
  "Comb",
  "EAU-DE-COLOGNE / Room Freshners",
  "Foot Cover",
  "Gown",
  "Slippers",
  "Tissue Paper",
  "Tooth Paste",
  "Tooth Brush",
  "Bed Pan",
  "Face Mask",
  "Flexi Mask",
  "Hand Holder",
  "Sputum Cup",
  "Disinfectant Lotions",
  "Luxury Tax",
  "HVAC",
  "House Keeping Charges",
  "Air Conditioner Charges",
  "Im Iv Injection Charges",
  "Clean Sheet",
  "Blanket/ Warmer Blanket",
  "Admission Kit",
  "Diabetic Chart Charges",
  "Documentation Charges/ Administrative Expenses",
  "Discharge Procedure Charges",
  "Daily Chart Charges",
  "Entrance Pass/ Visitors Pass Charges",
  "Expenses related to prescription on discharge",
  "File Opening Charges",
  "Incidental Expenses/ Misc. Charges",
  "Patient Identification Band/ Name Tag",
  "Pulseoxymeter Charges",
  "Hair Removal Cream",
  "Disposables Razors Charges (for site preparations)",
  "Eye Pad",
  "Eye Shield",
  "Camera Cover",
  "DVD, CD Charges",
  "Gause Soft",
  "Gauze",
  "Ward and Theatre Booking Charges",
  "Arthroscopy & Endoscopy Instruments",
  "Microscope Cover",
  "Surgical Blades, Harmonic Scalple, Shaver",
  "Surgical Drill",
  "Eye Kit",
  "Eye Drape",
  "X-Ray Film",
  "Boyles Apparatus Charges",
  "Cotton",
  "Cotton Bandage",
  "Surgical Tape",
  "Apron",
  "Torniquet",
  "Ortho Bundle, Gynaec Bundle",
  "Admission/ Registration Charges",
  "Hospitalisation for Evaluation/ Diagnostic Purpose",
  "Urine Container",
  "Blood Reservation Charges and Ante Natal Booking Charges",
  "BIPAP Machine",
  "CPAP/CAPD Equipment",
  "Infusion Pump",
  "Hydrogen Peroxide/ Spirit/ Disinfectants etc",
  "Nutrition Planning Charges - Dietician Charges - Diet Charges",
  "HIV Kit",
  "Antiseptic Mouthwash",
  "Lozenges",
  "Mouth Paint",
  "Vaccination Charges",
  "Alcohol Swabes",
  "Scrub Solution/ Sterillium",
  "Glucometer Strips",
  "Urine Bag",
];

const dummyotherassets = [
  "Stapler",
  "Eraser",
  "Push-pin",
  "Drawing pin (U.K)/ Thumbtack (U.S)",
  "Paper clip",
  "Rubber stamp",
  "Highlighter",
  "Fountain pen",
  "Pencil",
  "Marker",
  "Ballpoint",
  "Bulldog clip",
  "Tape dispenser",
  "Pencil sharpener",
  "Label",
  "Calculator",
  "Glue",
  "Scissors",
  "Sticky notes",
  "Paper",
  "Notebook",
  "Envelope",
  "Clipboard",
  "Monitor",
  "Computer",
  "Keyboard",
  "Folder",
  "Fax",
  "Filing cabinet",
  "Telephone",
  "Swivel chair",
  "Desk",
  "Wastebasket",
  "RAHUL BHABHAR\nJUNE 18, 2022 AT 8:10 PM\n\nHI..\nMUJHE SABHI TARAH KI ITEMS LENA HAI ??",
];

const addMedicineService = async (type, data) => {
  if (type == InventoryTypes.Medicine) {
    const medicine = await prisma.medicine.create({ data });
    return medicine;
  } else if (type == InventoryTypes.NonMedicine) {
    const nonMedicine = await prisma.nonMedicine.create({ data });
    return nonMedicine;
  } else if (type == InventoryTypes.OtherAssets) {
    const otherAssets = await prisma.otherAssets.create({ data });
    return otherAssets;
  } else {
    throw new Error("Invalid type");
  }
};

const DeleteInventoryService = async (medicineId, type) => {
  if (!medicineId) throw new Error("Invalid medicineId");
  console.log(medicineId);
  if (type == InventoryTypes.Medicine) {
    const medicine = await prisma.medicine.delete({
      where: { id: medicineId },
    });
    return medicine;
  } else if (type == InventoryTypes.NonMedicine) {
    const nonMedicine = await prisma.nonMedicine.delete({
      where: { id: medicineId },
    });
    return nonMedicine;
  } else if (type == InventoryTypes.OtherAssets) {
    const otherAssets = await prisma.otherAssets.delete({
      where: { id: medicineId },
    });
    return otherAssets;
  } else {
    throw new Error("Invalid type");
  }
};

const editMedicineService = async (id, data, type) => {
  let medicine;
  console.log(id, data, type);
  if (type == InventoryTypes.Medicine) {
    medicine = await prisma.medicine.update({
      where: { id: id },
      data: data,
    });
  } else if (type === InventoryTypes.NonMedicine) {
    medicine = await prisma.nonMedicine.update({
      where: { id: id },
      data: data,
    });
  } else if (type === InventoryTypes.OtherAssets) {
    medicine = await prisma.otherAssets.update({
      where: { id: id },
      data: data,
    });
  } else {
    throw new Error("Invalid type");
  }

  return medicine;
};

const getMedicine = async (medicineId) => {
  console.log({ medicineId });
  const gotMedicine = await prisma.inventory.findUnique({
    where: { id: medicineId },
  });
  console.log({ gotMedicine });
  return gotMedicine;
};

const addDummy = async () => {
  const type = faker.helpers.arrayElement(Object.values(InventoryTypes));
  if (type === InventoryTypes.Medicine) {
    await prisma.medicine.create({
      data: {
        name: faker.helpers.arrayElement(dummymedicines),
        batchNumber: faker.datatype.uuid(),
        category: faker.helpers.arrayElement(Object.values(Category)),
        expiry_date: faker.date.future(),
        medType: faker.helpers.arrayElement(Object.values(MedType)),
        quantity: faker.datatype.number({ min: 1, max: 100 }),
      },
    });
  } else if (type === InventoryTypes.NonMedicine) {
    await prisma.nonMedicine.create({
      data: {
        name: faker.helpers.arrayElement(dummynonmedicines),
        batchNumber: faker.datatype.uuid(),
        expiry_date: faker.date.future(),
        quantity: faker.datatype.number({ min: 1, max: 100 }),
      },
    });
  } else {
    await prisma.otherAssets.create({
      data: {
        quantity: faker.datatype.number({ min: 1, max: 100 }),
        name: faker.helpers.arrayElement(dummyotherassets),
      },
    });
  }
};

const searchInventoryService = async (type, { quantity, price, name }) => {
  console.log(name, quantity);
  let inventory = [];
  const queries = [
    { quantity: { gte: quantity } },
    { name: { contains: name } },
  ];
  if (type == InventoryTypes.Medicine) {
    inventory = await prisma.medicine.findMany({
      where: { OR: queries },
    });
  } else if (type == InventoryTypes.NonMedicine) {
    inventory = await prisma.nonMedicine.findMany({
      where: { OR: queries },
    });
  } else if (type == InventoryTypes.OtherAssets) {
    inventory = await prisma.otherAssets.findMany({
      where: { OR: queries },
    });
  }
  return inventory;
};

module.exports = {
  addMedicineService,
  DeleteInventoryService,
  editMedicineService,
  getMedicine,
  addDummy,
  searchInventoryService,
};
