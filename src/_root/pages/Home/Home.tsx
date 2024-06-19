import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex-1">
      <p>Home</p>
      <Outlet />
    </div>
  );
};

export default Home;
