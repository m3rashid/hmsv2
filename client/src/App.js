import "./styles/theme.less";
import { useRecoilState } from "recoil";
import { Routes, Route } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";

import Home from "./pages/home";
import { socket } from "./api/socket";
import { authState } from "./atoms/auth";
import routes, { checkAccess } from "./routes";
import UnAuthPage from "./pages/unAuthenticated";
import Loading from "./components/Loading/Loading";
import AppLayout from "./components/Layout/AppLayout";
import { revalidateJWT } from "./api/auth/revalidateJWT";
import useFetchSockets from "./components/Sockets/useFetchSockets";
import { instance } from "./api/instance";

export const SocketContext = React.createContext();

function App() {
  useFetchSockets();
  const [Auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState(true);

  const revalidate = useCallback(async () => {
    try {
      const res = await revalidateJWT(setAuth);
      socket.io.opts.auth.token = res.token;
      socket.disconnect().connect();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  useEffect(() => {
    if (Auth.isLoggedIn) {
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${Auth.token}`;
    }
  }, [Auth]);

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
                return <Route key={index} path="*" element={<UnAuthPage />} />;
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
