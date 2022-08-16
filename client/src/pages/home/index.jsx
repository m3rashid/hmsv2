import React from "react";
import { Typography } from "antd";
// import { Link } from "react-router-dom";

// const data = [
//   { title: "Reception", image: "/images/reception.jpg", link: "/reception" },
//   { title: "Doctor", image: "/images/doctor.jpg", link: "/doctor" },
//   { title: "Pharmacy", image: "/images/pharmacy.jpg", link: "/pharmacy" },
//   { title: "Admin", image: "/images/admin.jpeg", link: "/admin/home" },
// ];

const Home = () => {
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <img
        src="/images/center.jpg"
        alt="hospital"
        style={{ width: "100%", maxHeight: "300px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "15px",
          margin: "50px 0",
        }}
      >
        {/* {data.map((entry) => {
          const { title, image, link } = entry;
          return (
            <div key={`home ${link}`} style={{ maxWidth: 240 }}>
              <Link to={link}>
                <Card
                  hoverable
                  style={{ width: "100%", borderRadius: "5px" }}
                  cover={<img alt={`route to ${title}`} src={image} />}
                >
                  <Card.Meta title={title} />
                </Card>
              </Link>
            </div>
          );
        })} */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ width: "100%", maxWidth: "300px" }}
              src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mukhtar_Ahmed_Ansari_1980_stamp_of_India.jpg"
              alt="Mukhtar ahmad ansari"
            />
          </div>
          <div style={{ flex: 1, width: "100%", maxWidth: "500px" }}>
            <Typography.Title style={{ textAlign: "center" }}>
              Mukhtar Ahmed Ansari
            </Typography.Title>
            <p>
              Mukhtar Ahmed Ansari (25 December 1880 – 10 May 1936) was an
              Indian nationalist and political leader, and former president of
              the Indian National Congress and the Muslim League during the
              Indian Independence Movement. One of the founders of the Jamia
              Millia Islamia University he remained its chancellor 1928 to 1936.
            </p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
