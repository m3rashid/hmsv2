import { useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Col, Row, Space, Table, Typography } from "antd";

import { authState } from "../atoms/auth";
import { quantityCalculator } from "./Doctor/quantityCalculator";

const GeneratePdf = (props) => {
  const parchiData = props.data[0];
  const { user } = useRecoilValue(authState);
  const componentRef = useRef();

  const printPdf = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (!props.print) return;
    printPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.print]);

  const normalTextStyles = { fontWeight: "normal", fontSize: "16px" };

  return (
    <>
      <div className="print__section" style={{ marginTop: "20px" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                ref={componentRef}
                className="card"
                style={{ marginTop: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/logo.jpg"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100%",
                      marginRight: "10px",
                      padding: "2px",
                    }}
                    alt="null"
                  ></img>
                  <Typography.Title level={4}>
                    Dr M.A ANSARI HEALTH CENTER
                  </Typography.Title>
                  &nbsp;&nbsp;
                  <img
                    src="/images/logo.jpg"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100%",
                      marginRight: "10px",
                      padding: "2px",
                    }}
                    alt="null"
                  ></img>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "lighter",
                  }}
                >
                  <span style={normalTextStyles}>
                    डॉक्टर एम.ए अंसारी स्वास्थ्य केंद्र
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "lighter",
                  }}
                >
                  <span style={normalTextStyles}>
                    Jamia Millia Islamia (Accredited "A" Grade by NAAC)
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "lighter",
                  }}
                >
                  <span style={normalTextStyles}>
                    जामिया मिलिया इस्लामिया (NAAC द्वारा मान्यता प्राप्त "ए"
                    ग्रेड)
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "lighter",
                  }}
                >
                  <span style={{ fontWeight: "normal", fontSize: "12px" }}>
                    (A Central University by an Act of Parliament)( संसद के एक
                    अधिनियम द्वारा एक केंद्रीय विश्वविद्यालय)
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "lighter",
                  }}
                >
                  <span style={normalTextStyles}>
                    Maulana Mohammad Ali Jauhar Marg,New Delhi -110025 ,Ph
                    2698717 Ext. 1781,26984625
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "lighter",
                  }}
                >
                  <span style={normalTextStyles}>
                    मौलाना मोहम्मद अली जौहर मार्ग, नई दिल्ली -110025, फोन
                    2698717 एक्सटेंशन 1781,26984625
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "50px",
                    textAlign: "right",
                    marginRight: "50px",
                    fontSize: "15px",
                  }}
                >
                  <span>
                    Date :{" "}
                    <strong>{parchiData?.date && parchiData.date}</strong>
                  </span>
                </div>
                <Space
                  direction="vertical"
                  style={{
                    marginTop: "50px",
                    padding: "20px",
                    marginLeft: "50px",
                    fontSize: "15px",
                    width: "80%",
                  }}
                >
                  <Row>
                    <Col span={8}>By</Col>
                    <Col span={16}>
                      <strong>{user.name}</strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>Patient Name</Col>
                    <Col span={16}>
                      <strong>
                        {parchiData?.appointment &&
                          parchiData.appointment.split("-")[0]}
                      </strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>Symptoms</Col>
                    <Col span={16}>
                      <strong>
                        {parchiData?.symptoms &&
                          parchiData.symptoms.split("-")[0]}
                      </strong>
                    </Col>
                  </Row>
                </Space>
                <div
                  style={{
                    marginTop: "20px",
                    marginLeft: "50px",
                    fontSize: "20px",
                  }}
                >
                  <Table
                    columns={[
                      {
                        title: "Medicine",
                        dataIndex: "medicine",
                        render: (text) => <span>{text?.name}</span>,
                      },
                      {
                        title: "Dosage",
                        dataIndex: "dosage",
                        render: (text, record) => (
                          <span>{record?.dosage?.value}</span>
                        ),
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        render: (text, record) => (
                          <span>
                            {quantityCalculator(
                              record?.duration,
                              record?.dosage?.value
                            )}
                          </span>
                        ),
                      },
                      { title: "Description", dataIndex: "description" },
                    ]}
                    dataSource={parchiData?.medicines}
                    pagination={false}
                  />
                </div>
                <Space
                  direction="vertical"
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    marginLeft: "50px",
                    fontSize: "15px",
                    width: "80%",
                  }}
                >
                  <Row>
                    <Col span={8}>CustomMedicines</Col>
                    <Col span={16}>
                      <strong>
                        {parchiData?.CustomMedicines &&
                          parchiData.CustomMedicines}
                      </strong>
                    </Col>
                  </Row>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GeneratePdf;
// {appointment: 'Aaliya begh-August 26 2022 15:01 PM', symptoms: 'asd', CustomMedicines: 'asd', datetime: '2022-08-20 17:01:47', medicines: Array(1)}
// CustomMedicines: "asd"
// appointment: "Aaliya begh-August 26 2022 15:01 PM"
// datetime: "2022-08-20 17:01:47"
// medicines: Array(1)
// 0: {name: '1', dosage: 'Twice a day', quantity: '2', description: 'sdad'}
// length: 1
// [[Prototype]]: Array(0)
// symptoms: "asd"
// [[Prototype]]: Object
