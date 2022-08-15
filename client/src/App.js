import "./styles/theme.less";
import { message } from "antd";
import { useRecoilState } from "recoil";
import { Routes, Route, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";

import AppLayout from "./components/Layout/AppLayout";
import routes, { validateRoute } from "./routes";
import { authState } from "./atoms/auth";
import { revalidateJWT } from "./api/auth/revalidateJWT";
import Loading from "./components/Loading/Loading";
import Home from "./pages/home";
import UnAuthPage from "./pages/unAuthenticated";
import { socket } from "./api/socket";

export const SocketContext = React.createContext();

function App() {
  const [Auth, setAuth] = useRecoilState(authState);
  const [isLoading, setisLoading] = useState(true);
  const location = useLocation();
  const revalidate = useCallback(() => {
    revalidateJWT(setAuth)
      .then((res) => {
        console.log(res);
        socket.connect();
      })
      .finally(() => {
        setisLoading(false);
      });
  }, [setAuth]);

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Auth Socket", Auth);
    if (!Auth.isLoggedIn) return;
    socket.on("new-appointment-created", (data) => {
      console.log("Some Appointment Created");

      console.log(data, Auth);

      if (data.doctor?.id === Auth.user.id) {
        console.log(data);
        message.info(`New appointment created`);
      }
    });
    return () => {
      socket.off("new-appointment-created");
    };
  }, [Auth, location]);

  if (isLoading) {
    return <Loading text="App is Loading.." />;
  }

  return (
    <AppLayout>
      <div className="App">
        <div style={{ height: "100vh" }}>
          <Routes>
            {routes.map((route, index) => {
              const validated = validateRoute(Auth, route);
              if (!validated) {
                return <Route path="*" element={<UnAuthPage />} />;
              }
              return (
                <Route
                  key={`route ${index} ${route.path}`}
                  path={route.path}
                  element={<route.component />}
                />
              );
            })}
            <Route path="" element={<Home />} />
          </Routes>
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
