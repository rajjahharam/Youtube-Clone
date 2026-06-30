import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-[220px] mt-14 p-6 min-h-[calc(100vh-56px)] bg-black">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;