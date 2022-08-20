import { Button, Typography } from "antd";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const GeneratePdf = (props) => {
  const parchiData = props.data[0];
  // console.log(parchiData?.medicines);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <div
        className="print__section"
        style={{
          marginTop: "20px",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Button
                type="primary"
                onClick={handlePrint}
                className="print__button"
                style={{ margin: "10px" }}
              >
                {" "}
                Print{" "}
              </Button>
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
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "16px",
                    }}
                  >
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
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
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
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "16px",
                    }}
                  >
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
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "12px",
                    }}
                  >
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
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "16px",
                    }}
                  >
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
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "16px",
                    }}
                  >
                    मौलाना मोहम्मद अली जौहर मार्ग, नई दिल्ली -110025, फोन
                    2698717 एक्सटेंशन 1781,26984625
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "50px",
                    textAlign: "right",
                    marginRight: "50px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    {" "}
                    Date :&nbsp;
                    {parchiData?.datetime !== undefined
                      ? parchiData.datetime.split(" ")[0]
                      : ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "50px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginLeft: "50px",
                  }}
                >
                  <span>
                    {" "}
                    Patient Name :&nbsp;
                    {parchiData?.appointment !== undefined
                      ? parchiData.appointment.split("-")[0]
                      : ""}
                  </span>
                  <span style={{ marginTop: "20px" }}>
                    {" "}
                    Symptoms :&nbsp;
                    {parchiData?.symptoms !== undefined
                      ? parchiData.symptoms.split("-")[0]
                      : ""}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    marginLeft: "50px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Medicines :
                  {parchiData?.medicines !== undefined ? (
                    parchiData?.medicines.map((medicine) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            gap: "30px",
                            marginLeft: "20px",
                            fontSize: "16px",
                            marginTop: "5px",
                          }}
                        >
                          <span>Name : {medicine.name}</span>
                          <span>Dosage : {medicine.dosage}</span>
                          <span>Quantity : {medicine.quantity}</span>
                          <span>Description : {medicine.description}</span>
                        </div>
                      </>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    marginLeft: "50px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Custom Medicines :&nbsp;
                  {parchiData?.CustomMedicines !== undefined
                    ? parchiData.CustomMedicines
                    : ""}
                </div>
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
