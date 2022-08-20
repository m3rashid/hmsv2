const dayjs = require("dayjs");

const prisma = require("../utils/prisma");
const { permissions } = require("../utils/auth.helpers");

const getDoctorAppointmentsService = async (
  userId,
  { limit, offset, pending } = {}
) => {
  console.log({ userId });
  const query = {
    where: {
      doctor: {
        id: userId,
      },
      ...(pending ? { pending: true } : {}),
    },
    include: {
      patient: true,
    },
    orderBy: {
      date: "desc",
    },
    skip: offset || 0,
    take: limit || 500,
  };

  const appointments = await prisma.appointment.findMany(query);

  console.log(appointments);
  return { appointments };
};

const getDoctorPatientsService = async (doctorId) => {
  const patients = await prisma.Patient.findMany({
    where: {
      Appointment: {
        some: {
          doctorId: doctorId,
        },
      },
    },
  });
  return { patients };
};

const searchDoctorsService = async ({
  name,
  minAge,
  maxAge,
  designation,
  contact,
  email,
  address,
  availability,
}) => {
  const doctors = await prisma.auth.findMany({
    where: {
      OR: [
        {
          name: {
            contains: name,
          },
        },
        {
          email: {
            contains: email,
          },
        },
      ],
      AND: [
        {
          permissions: {
            has: permissions.DOCTOR_PRESCRIBE_MEDICINE,
          },
        },
      ],
    },
    include: {
      profile: true,
    },
  });
  return { count: doctors.length, doctors };
};

const createPrescriptionService = async ({
  appointment,
  symptoms,
  diagnosis,
  CustomMedicines,
  datetime,
  medicines,
}) => {
  // hopefully works
  console.log(medicines);
  const newPrescription = await prisma.prescription.create({
    data: {
      appointment: {
        connect: {
          id: appointment,
        },
      },
      symptoms,
      CustomMedicines,
      datePrescribed: dayjs(datetime).toDate(),
      medicines: {
        createMany: {
          data: medicines.map((medicine) => {
            console.log(medicine);
            return {
              MedicineId: parseInt(medicine.medicine.id),

              duration: parseInt(medicine.duration),
              dosage: medicine.dosage,
              ...(medicine.medType === "SYRUP"
                ? {
                    quantityPerDose: parseInt(medicine.quantityPerDose),
                  }
                : {}),
              description: medicine.description,
            };
          }),
        },
      },
    },
    include: {
      appointment: {
        select: {
          patient: {
            select: {
              name: true,
              contact: true,
            },
          },
          doctor: {
            select: {
              Auth: {
                select: {
                  name: true,
                },
              },
              designation: true,
            },
          },
        },
      },
    },
  });
  await prisma.appointment.update({
    where: {
      id: appointment,
    },
    data: {
      pending: false,
    },
  });

  // const newPresDetails = await newPrescription.getAppointment();
  // const patient = await newPresDetails.getPatient();
  // const doctor = await newPresDetails.getDoctor();

  return {
    prescription: newPrescription,
    // doctor,
    // patient,
  };
};

const updateAppointmentService = async ({
  appointmentId,
  date,
  remarks,
  pending,
}) => {
  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      ...(date ? { date } : {}),
      ...(remarks ? { remarks } : {}),
      ...(pending ? { pending } : {}),
    },
  });
  return {
    appointment: updatedAppointment,
  };
};
module.exports = {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  searchDoctorsService,
  createPrescriptionService,
  updateAppointmentService,
};
