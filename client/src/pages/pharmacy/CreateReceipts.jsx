import dayjs from "dayjs";
import { useRecoilValue } from "recoil";
import { Button, Form, Select, Spin } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { socket } from "../../api/socket";
import { instance } from "../../api/instance";
import { pharmacyState } from "../../atoms/pharmacy";
// import GeneratePdf from "../../components/generatePdf";
import MedicineTable from "../../components/Pharmacy/MedicineTable";
import usePrescribeMedicines from "../../components/Doctor/hooks/prescribeMeds.hook";
import ShowReceipt from "./ShowReciept";

function CreateReceipts() {
  const {
    state: {
      printContainerRef,
      // PrintButtonRef
    },
    actions: { printPdf },
  } = usePrescribeMedicines(socket);
  const loading = false;
  const navigate = useNavigate();
  const pharmacyData = useRecoilValue(pharmacyState);
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedPrescriptionData, setSelectedPrescriptionData] = useState({
    loading: false,
    data: null,
  });

  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();

  const prescriptionId = searchParams.get("prescriptionId");

  const handlePrescriptionSelect = useCallback(
    async (prescription_id) => {
      prescription_id = parseInt(prescription_id);
      const prescription = pharmacyData.prescriptions.find(
        (prescription) => prescription.id === prescription_id
      );
      if (prescription) {
        setSelectedPrescriptionData((prev) => ({ ...prev, loading: true }));
        setSelectedPrescription(prescription);
        form.setFieldValue(
          "prescription",
          `${prescription.appointment.patient.name}, ${dayjs(
            prescription.datePrescribed
          ).format("DD MMM, hh:mm A")}`
        );
        const { data } = await instance.get(
          `/pharmacy/prescriptions/${prescription.id}`
        );
        setSelectedPrescriptionData((prev) => ({
          ...prev,
          loading: false,
          data: data.prescription,
        }));
      }
    },
    [form, pharmacyData.prescriptions]
  );

  useEffect(() => {
    if (prescriptionId !== null && pharmacyData.prescriptions.length > 0) {
      handlePrescriptionSelect(prescriptionId);
    }
  }, [
    handlePrescriptionSelect,
    pharmacyData.prescriptions.length,
    prescriptionId,
  ]);

  const [total, setTotal] = useState({});
  const formSubmitHandler = async (values) => {
    if (loading) return;

    socket.emit("dispense-prescription", {
      prescriptionId: selectedPrescription.id,
      medicines: selectedMedicines,
    });

    setTotal({});
    setSelectedPrescription(null);
    setSelectedPrescriptionData({ data: [] });
    form.resetFields();
    navigate("/pharmacy/prescriptions");
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={formSubmitHandler}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 8 }}
      >
        <Form.Item
          label="Choose Prescription"
          name="prescription"
          rules={[{ required: true, message: "Please Enter patient name!" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="select an Prescription"
            onSelect={(id) => {
              handlePrescriptionSelect(id);
            }}
            optionLabelProp="Appointment"
          >
            {pharmacyData.prescriptions
              ?.filter((pr) => pr.pending)
              .map((presp) => {
                return (
                  <Select.Option key={presp.id} value={presp.id}>
                    <span>
                      {presp.appointment.patient.name} -{" "}
                      {dayjs(presp.datePrescribed).format(
                        "DD MMM YY,  HH:mm A"
                      )}
                    </span>
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>

        <Spin spinning={selectedPrescriptionData.loading}>
          {selectedPrescription && (
            <MedicineTable
              medicines={selectedPrescriptionData.data?.medicines || []}
              setSelectedMedicines={setSelectedMedicines}
              selectedMedicine={selectedMedicines}
            />
          )}

          <Form.Item wrapperCol={{ offset: 10 }}>
            <div style={{ display: "flex" }}>
              {selectedPrescription && selectedPrescriptionData.data && (
                <>
                  <div>
                    <Button
                      disabled={selectedPrescriptionData.loading}
                      style={{ marginTop: "20px", marginRight: "10px" }}
                      type="primary"
                      className="print__button"
                      onClick={printPdf}
                    >
                      Print Prescription
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={{ marginTop: "20px", marginLeft: "10px" }}
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                    >
                      Confirm Transaction
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Form.Item>
        </Spin>
      </Form>
      {selectedPrescriptionData.data && (
        <ShowReceipt
          printContainerRef={printContainerRef}
          data={[
            {
              ...selectedPrescriptionData?.data,
              date: dayjs().format("MMMM DD YYYY HH:mm A"),
            },
          ]}
        />
      )}
    </div>
  );
}

export default CreateReceipts;
