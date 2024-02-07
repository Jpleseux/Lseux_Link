import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './Auth.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignUp from './pages/authPages/signUp.tsx'
import { GatewayProvider } from './gateway/gatewayContext.tsx'
import VerifyAccount from './pages/authPages/verifyAccount.tsx'
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
