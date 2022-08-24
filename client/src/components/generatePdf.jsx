import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Col, Collapse, Row, Space, Table, Typography } from "antd";

import { authState } from "../atoms/auth";
import { quantityCalculator } from "./Doctor/quantityCalculator";

const normalTextStyles = {
  fontWeight: "normal",
  fontSize: "16px",
};

const lighterFontFlex = {
  display: "flex",
  justifyContent: "center",
  fontWeight: "lighter",
};

const GeneratePdf = (props) => {
  const parchiData = props.data[0];
  const { user } = useRecoilValue(authState);
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    if (!props.printContainerRef.current) {
      setActiveKey("1");
      return;
    }
    setActiveKey("0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Collapse ghost bordered={false} style={{ padding: 0, margin: 0 }}>
        <Collapse.Panel header="Show Print Preview" key="1">
          <div className="print__section" style={{ marginTop: "20px" }}>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div
                    ref={props.printContainerRef}
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
                    <div style={lighterFontFlex}>
                      <span style={normalTextStyles}>
                        डॉक्टर एम.ए अंसारी स्वास्थ्य केंद्र
                      </span>
                    </div>
                    <div style={lighterFontFlex}>
                      <span style={normalTextStyles}>
                        Jamia Millia Islamia (Accredited "A" Grade by NAAC)
                      </span>
                    </div>
                    <div style={lighterFontFlex}>
                      <span style={normalTextStyles}>
                        जामिया मिलिया इस्लामिया (NAAC द्वारा मान्यता प्राप्त "ए"
                        ग्रेड)
                      </span>
                    </div>
                    <div style={lighterFontFlex}>
                      <span style={{ fontWeight: "normal", fontSize: "12px" }}>
                        (A Central University by an Act of Parliament)( संसद के
                        एक अधिनियम द्वारा एक केंद्रीय विश्वविद्यालय)
                      </span>
                    </div>
                    <div style={lighterFontFlex}>
                      <span style={normalTextStyles}>
                        Maulana Mohammad Ali Jauhar Marg,New Delhi -110025 ,Ph
                        2698717 Ext. 1781,26984625
                      </span>
                    </div>
                    <div style={lighterFontFlex}>
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
                              <span>{text?.value}</span>
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
                        dataSource={parchiData?.medicines?.medicines}
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
        </Collapse.Panel>
      </Collapse>
    </>
  );
};
export default GeneratePdf;
