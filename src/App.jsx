import SideMenu from "./shared/components/SideMenu";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { getCookie } from "./utils/getCookie";
import { useEffect, useState } from "react";
import {authService} from "./features/auth/services/authService";
import LoadingUI from "./shared/components/LoadingUi";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.me();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {    
    return <LoadingUI></LoadingUI>;
  }

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <aside className="w-64 shrink-0 h-full bg-primary overflow-y-auto">
        <SideMenu />
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-9 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
