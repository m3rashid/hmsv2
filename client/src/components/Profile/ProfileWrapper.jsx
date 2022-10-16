import React from "react";
import { useRecoilValue } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Card, Col, Divider, PageHeader, Row } from "antd";

import { authState } from "../../atoms/auth";

const ProfileWrapper = ({ children }) => {
  const auth = useRecoilValue(authState);
  // const [online, setOnline] = React.useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (pathname === "/me" && auth.user.permissions.includes("ADMIN")) {
      navigate("/admin/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <>
      <div
        className="site-page-header-ghost-wrapper"
        style={{ width: "50%", margin: 10, borderRadius: 10 }}
      >
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={auth.user.name}
          subTitle={""}
        >
          <Row>
            <Col span={24}>
              {auth.user && (
                <Badge.Ribbon color="green" text="Online">
                  <Card title={auth.user[auth.user.role]?.name} size="small">
                    Email: {auth.user.email}
                  </Card>
                </Badge.Ribbon>
              )}
            </Col>
          </Row>
        </PageHeader>
      </div>

      <Divider />
      {children}
    </>
  );
};

export default ProfileWrapper;
