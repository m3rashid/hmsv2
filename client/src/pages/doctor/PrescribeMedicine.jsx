import {
  Form,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Modal,
  Divider,
  Drawer,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";

import { socket } from "../../api/socket";
import usePrescribeMedicines from '../../components/Doctor/hooks/prescribeMeds.hook';
import MedicineInput from "../../components/Medicine/MedicineInput";
import ReferPatientModal from "../../components/Prescription/ReferPatientModal";
import styles from "./css/PrescribeMedicine.module.css";
import PatientInfo from "../patient";

import MedicineInputTable from "../../components/Medicine/MedicineInputTabular";
import PrescriptionDisplay from "../../components/Prescription/PrescriptionDisplay";

const PrescriptionForm = () => {
  const {
    state: {
      loading,
      formData,
      medicines,
      doctorData,
      appointmentId,
      referToAnotherDoctor,
      // navigate,
      form,
      CreatePrescriptionModalVisible,
      PatientData,
    },
    actions: {
      // setLoading,
      setFormData,
      setMedicines,
      setReferToAnotherDoctor,
      formSubmitHandler,
      addEmptyMedicine,
      deleteMedicine,
      handleReferPatientModalShow,
      handleAppointmentSelect,
      setCreatePrescriptionModalVisible,
      UpdateMedicine,
      setPatientData,
    },
  } = usePrescribeMedicines(socket);

  useEffect(() => {
    // console.log("appointment id", appointmentId);
    if (appointmentId !== null && doctorData.appointments.length > 0) {
      handleAppointmentSelect(appointmentId);
    }
  }, [appointmentId, doctorData.appointments.length, handleAppointmentSelect]);

  return (
    <React.Fragment>
      <div style={{ padding: 10 }}>
        <Typography.Title level={4}>Create Prescription</Typography.Title>
        <Form
          form={form}
          onFinish={formSubmitHandler}
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Choose Appointment"
            name="appointment"
            rules={[{ required: true, message: "Please Enter Appointment!" }]}
          >
            <Row gutter={10}>
              <Col span={18}>
                <Select
                  placeholder="Select an appointment"
                  style={{ width: "100%" }}
                  allowClear
                  onChange={(value) => {
                    handleAppointmentSelect(value);
                  }}
                  optionLabelProp="Appointment"
                >
                  {doctorData.appointments
                    .filter(
                      (apt) =>
                        apt.pending &&
                        {
                          /* dayjs(apt.date).isBefore(dayjs().add(6, "hours")) */
                        }
                    )
                    .map((appointment) => (
                      <Select.Option
                        key={appointment.id}
                        value={appointment.id}
                      >
                        <span>
                          {appointment.patient?.name} -{" "}
                          {dayjs(appointment.date).format(
                            "MMMM DD YYYY HH:mm A"
                          )}
                        </span>
                      </Select.Option>
                    ))}
                </Select>
              </Col>
              <Col>
                <Button
                  disabled={formData.appointment ? false : true}
                  onClick={() => {
                    setPatientData({
                      open: true,
                      data: formData.appointmentInfo,
                    });
                  }}
                >
                  View Patient's History
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="Symptoms"
            name="symptoms"
            rules={[{ required: true, message: "Please Enter Symptoms!" }]}
          >
            <Input.TextArea
              required
              type="text"
              placeholder="Enter symptoms"
              allowClear
              onChange={(e) => {
                setFormData({ ...formData, symptoms: e.target.value });
              }}
            />
          </Form.Item>
          <Divider />
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Text strong>Medicines</Typography.Text>
            <MedicineInputTable
              medicines={medicines.medicines}
              setMedicines={setMedicines}
            />
          </Space>
          <Divider />

          <Space direction="vertical" style={{ width: "100%" }}>
            <strong>Custom Medicines</strong>

            {medicines.extraMedicines.length > 0 && (
              <Row className={styles.prescribeTableHeader}>
                <Col className={styles.prescribeColHeader} span={6}>
                  Medicine
                </Col>
                <Col className={styles.prescribeColHeader} span={4}>
                  Dosage
                </Col>
                <Col className={styles.prescribeColHeader} span={5}>
                  Duration
                </Col>
                <Col className={styles.prescribeColHeader} span={5}>
                  Description
                </Col>
                <Col className={styles.prescribeColHeader} span={4}>
                  Action
                </Col>
              </Row>
            )}

            {medicines.extraMedicines?.map((medicine, index) => (
              <MedicineInput
                key={index}
                index={index}
                isExtra={true}
                type="extraMedicines"
                medicine={medicine}
                deleteMedicine={deleteMedicine}
                setMedicines={setMedicines}
                UpdateMedicine={UpdateMedicine}
              />
            ))}
            <Button
              type="primary"
              htmlType="button"
              onClick={() => addEmptyMedicine("extraMedicines")}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              + Add New Extra Medicine
            </Button>
          </Space>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space>
              {formData.appointmentInfo && (
                <Button
                  htmlType="button"
                  type="link"
                  danger
                  onClick={handleReferPatientModalShow}
                >
                  Refer Patient to another doctor
                </Button>
              )}
              <Button
                loading={loading.PrescribeMedicines}
                type="primary"
                htmlType="button"
                onClick={() => setCreatePrescriptionModalVisible(true)}
              >
                Confirm Create Prescription
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <PrescriptionDisplay
          id={formData?.appointmentInfo?.id}
          symptoms={formData?.symptoms}
          date={formData?.appointmentInfo?.date}
          patient={formData?.appointmentInfo?.patient}
          Medicines={medicines.medicines}
          ExtraMedicines={medicines.extraMedicines}
          showAvailability={true}
        />

        <ReferPatientModal
          modalState={referToAnotherDoctor}
          setModalState={setReferToAnotherDoctor}
          patientId={formData.appointmentInfo?.patientId}
          doctorId={formData.appointmentInfo?.doctorId}
        />

        <Drawer
          visible={PatientData.open}
          width={"60%"}
          onClose={() => {
            setPatientData({ open: false, data: null });
          }}
        >
          {PatientData.data && (
            <PatientInfo id={PatientData?.data?.patient?.id} />
          )}
        </Drawer>

        <Modal
          visible={CreatePrescriptionModalVisible}
          onOk={() => {
            setCreatePrescriptionModalVisible(false);
            form.submit();
          }}
          onCancel={() => setCreatePrescriptionModalVisible(false)}
          okText="Yes"
          cancelText="No"
          width={1000}
        >
          <PrescriptionDisplay
            id={formData?.appointmentInfo?.id}
            symptoms={formData?.symptoms}
            date={formData?.appointmentInfo?.date}
            patient={formData?.appointmentInfo?.patient}
            Medicines={medicines.medicines}
            ExtraMedicines={medicines.extraMedicines}
            showAvailability={true}
          />
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default PrescriptionForm;
