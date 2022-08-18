import "./styles/theme.less";
// import { message } from "antd";
import { useRecoilState } from "recoil";
import {
  Routes,
  Route,
  // useLocation
} from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";

import AppLayout from "./components/Layout/AppLayout";
import routes, { checkAccess } from "./routes";
import { authState } from "./atoms/auth";
import { revalidateJWT } from "./api/auth/revalidateJWT";
import Loading from "./components/Loading/Loading";
import Home from "./pages/home";
import UnAuthPage from "./pages/unAuthenticated";
import { socket } from "./api/socket";
import useFetchSockets from "./components/Sockets/useFetchSockets";

export const SocketContext = React.createContext();

function App() {
  useFetchSockets();
  const [Auth, setAuth] = useRecoilState(authState);
  const [isLoading, setisLoading] = useState(true);
  // const location = useLocation();
  const revalidate = useCallback(() => {
    revalidateJWT(setAuth)
      .then((res) => {
        console.log(res);
        socket.io.opts.auth.token = res.token;
        socket.disconnect().connect();
      })
      .finally(() => {
        setisLoading(false);
      });
  }, [setAuth]);

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading text="App is Loading.." />;
  }

  return (
    <AppLayout>
      <div className="App">
        <div style={{ height: "100vh" }}>
          <Routes>
            {routes.map((route, index) => {
              const validated = checkAccess(Auth, route);
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
