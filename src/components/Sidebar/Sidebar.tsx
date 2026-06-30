import { useNavigate, useLocation } from "react-router-dom";
import { Home, PlaySquare } from "lucide-react";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { label: "Home", icon: <Home size={20} />, path: "/" },
    { label: "Shorts", icon: <PlaySquare size={20} />, path: "/shorts" },
  ];

  return (
    <aside className="fixed top-14 left-0 w-[220px] h-[calc(100vh-56px)] bg-black py-3 overflow-y-auto">
      {sidebarItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-6 py-2.5 mx-2 rounded-lg cursor-pointer text-sm transition-colors ${
              isActive
                ? "bg-neutral-800 font-semibold"
                : "hover:bg-neutral-800"
            }`}
          >
            <span className="w-6 flex justify-center">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;