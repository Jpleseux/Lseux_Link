import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './Auth.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignUp from './pages/authPages/signUp.tsx'
import { GatewayProvider } from './gateway/gatewayContext.tsx'
import VerifyAccount from './pages/authPages/verifyAccount.tsx'
import Login from './pages/authPages/Login.tsx'
import Home from './Home.tsx'
import Index from './pages/home/index.tsx'
import Profile from './pages/home/profile.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NewPost from './pages/home/newPost.tsx'
const router = createBrowserRouter([
  {
    path:"/",
    element: <Auth />,
    children:[
      {
        path: "/signup",
        element: <SignUp/>
      },
      {
        path: "verify/account/:token/:email",
        element: <VerifyAccount/>
      },
      {
        path: "/",
        element: <Login />
      }
    ]
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "index",
        element: <Index />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "new/post",
        element: <NewPost />
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GatewayProvider >
      <RouterProvider router={router} />
    </GatewayProvider>
  </React.StrictMode>,
)
