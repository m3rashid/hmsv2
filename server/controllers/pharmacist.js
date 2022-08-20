const {dispensePrescriptionService, getAllPrescriptionsService, getPrescriptionByIdService} = require("../services/pharmacist");


const getAllPrescriptions = async (req, res) => {
    const { prescriptions } = await getAllPrescriptionsService(req.query);
    return res.status(200).json({ prescriptions });
}

const getPrescriptionById = async (req, res) => {
  console.log(req.params.id);
  const { prescription } = await getPrescriptionByIdService(parseInt(req.params.id));
  return res.status(200).json({ prescription });

}
const dispensePrescription = async (req, res) => {
  try {
    if (!req.user || !req.user.id) throw new Error("Unauthorized");
    console.log(req.user);
    const { receipt } = await dispensePrescriptionService(req.body);
    return res.status(200).json({ receipt });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};



module.exports ={
    getAllPrescriptions,
    getPrescriptionById,
    dispensePrescription,

}