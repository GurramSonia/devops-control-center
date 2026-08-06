import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";

function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
     <NavBar />
     <SideBar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

export default DashBoardLayout;