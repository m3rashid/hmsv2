import { Col, Row, Space, Typography } from "antd";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ShowAvailability from "./ShowAvailability";

function DoctorDisplay({ doctor, DisabledItems }) {
  const DoctorInfo = useMemo(
    () => [
      { title: "ID No.", dataIndex: "id" },
      { title: "Authority Name", dataIndex: "authorityName" },
      { title: "Designation", dataIndex: "designation" },
      { title: "Sex", dataIndex: "sex" },
      { title: "Bio", dataIndex: "bio" },
      { title: "Contact", dataIndex: "contact" },
      {
        title: "Availability",
        dataIndex: "availability",
        Cell: ({ doctor }) => {
          return (
            <React.Fragment>
              <ShowAvailability availability={doctor.availability} />
            </React.Fragment>
          );
        },
      },
    ],
    []
  );

  // console.log(doctor);

  return (
    <React.Fragment>
      <Space direction="vertical" style={{ width: "100%" }}>
        {DoctorInfo.map((_info, index) => {
          if (!doctor || !doctor[_info.dataIndex]) return null;
          if (DisabledItems && DisabledItems.includes(_info.dataIndex))
            return null;

          return (
            <Row key={index}>
              <Col span={9}>
                <Typography.Text strong>{_info.title}</Typography.Text>
              </Col>
              <Col span={15}>
                <Typography.Text>
                  {_info.Cell
                    ? _info.Cell({ doctor })
                    : doctor[_info.dataIndex]}
                </Typography.Text>
              </Col>
            </Row>
          );
        })}
      </Space>
    </React.Fragment>
  );
}

DoctorDisplay.propTypes = {
  doctor: PropTypes.object,
  DisabledItems: PropTypes.array,
};

export default DoctorDisplay;
