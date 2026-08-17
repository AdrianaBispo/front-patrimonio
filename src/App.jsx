import SideMenu from "./shared/components/SideMenu";
import { Outlet } from "react-router-dom";

export default function App() {
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
