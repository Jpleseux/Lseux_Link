import { Outlet } from "react-router"
import NavBar from "./components/navbar/navbar";

function Home() {
  return (
    <>
      <Outlet/>
      <NavBar />
    </>
  )
}

export default Home;
