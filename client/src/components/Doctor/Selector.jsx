import { Col, Row, Select, Space, Typography } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { instance } from "../../api/instance";
import PropTypes from "prop-types";

function DoctorSelector({ onChange }) {
  const { data: DoctorData } = useQuery("Doctor's List", async () => {
    const { data } = await instance.get("/doctor/search", {
      params: {
        name: "",
      },
    });

    return data.doctors;
  });

  return (
    <Select
      id="doctor"
      placeholder="Doctor Name"
      allowClear
      onChange={(value) => {
        const selectedDoctor = DoctorData.find((doctor) => doctor.id === value);

        onChange(selectedDoctor);
      }}
    >
      {DoctorData &&
        DoctorData?.map((doctor) => {
          return (
            <Select.Option value={doctor.id} key={doctor.id}>
              <Col direction="vertical" size={"small"} style={{ fontSize: 12 }}>
                <Row>
                  <Space>
                    <Typography.Text>{doctor.name}</Typography.Text>
                    {doctor.profile.designation && (
                      <Typography.Text type="danger">
                        {`${"("}${doctor.profile.designation}${")"}`}
                      </Typography.Text>
                    )}
                  </Space>
                </Row>
                <Row>
                  <Typography.Text disabled>{doctor.email}</Typography.Text>
                </Row>
              </Col>
            </Select.Option>
          );
        })}
    </Select>
  );
}

DoctorSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default DoctorSelector;
