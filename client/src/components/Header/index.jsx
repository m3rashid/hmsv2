import React from "react";
import { PageHeader, Badge, Card, Row, Col } from "antd";
import { useRecoilValue } from "recoil";
import { authState } from "../../atoms/auth";

const findAvatar = (role) => {
  switch (role) {
    case "DOCTOR":
      return "doctor.jpg";
    case "ADMIN":
      return "admin.jpeg";
    case "OTHER":
      return "logo.jpg";
    case "RECEPTIONIST":
      return "reception.jpg";
    case "PHARMACIST":
      return "pharmacy";
    default:
      return "logo.jpg";
  }
};

const Header = ({ online, setOnline }) => {
  const auth = useRecoilValue(authState);

  const avatar = findAvatar(auth.user.role);
  const Avatar = `/images/${avatar}`;

  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={auth.user.role}
        subTitle={""}
        avatar={{ src: `${Avatar}` }}
        // extra={[
        //   <Button key="3">Operation</Button>,
        //   <Button key="2">Operation</Button>,
        //   <Button key="1" type="primary">
        //     Primary
        //   </Button>,
        // ]}
      >
        <Row>
          <Col span={12}>
            {auth.user && (
              <Badge.Ribbon color="green" text="Online">
                <Card title={auth.user.name} size="small">
                  Email: {auth.user.email}
                </Card>
              </Badge.Ribbon>
            )}
          </Col>
          <Col span={12}></Col>
        </Row>
      </PageHeader>
    </div>
  );
};

export default Header;
