const prisma = require("../utils/prisma");
const { faker } = require("@faker-js/faker");

const addMedicine = async (name, quantity, price, description) => {};

const removeMedicine = async (medicineId) => {};

const editMedicine = async (
  medicineId,
  name,
  quantity,
  price,
  description
) => {};

const getMedicine = async (medicineId) => {};

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

const addDummy = async () => {
  const data = {
    name: dummymedicines[Math.floor(Math.random() * dummymedicines.length)],
    quantity: faker.datatype.number({ min: 10, max: 100 }),
    price: faker.datatype.number({ min: 10, max: 100 }),
    description: faker.lorem.sentence(),
  };
  await prisma.inventory.create({
    data,
  });
};

const searchInventoryService = async ({ quantity, price, name }) => {
  console.log(name, quantity, price);
  const inventory = await prisma.inventory.findMany({
    where: {
      quantity: {
        gte: quantity,
      },
      price: {
        lte: price,
      },
      name: {
        contains: name,
      },
    },
  });

  return inventory;
};

module.exports = {
  addMedicine,
  removeMedicine,
  editMedicine,
  getMedicine,
  addDummy,
  searchInventoryService,
};
