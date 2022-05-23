import React, { useCallback, useEffect, useState } from "react";
import "./styles/theme.less";
import AppLayout from "./components/Layout/AppLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes, { validateRoute } from "./routes";
import { useRecoilState } from "recoil";
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

  if (isLoading) {
    return <Loading text="App is Loading.." />;
  }

  return (
    <BrowserRouter>
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
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
