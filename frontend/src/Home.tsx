import { Outlet } from "react-router"
import NavBar from "./components/navbar/navbar";

function Home() {
  return (
    <>
      <NavBar />
      <Outlet/>
    </>
  )
}

export default Home;
