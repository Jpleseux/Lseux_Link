import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignUp from './pages/authPages/signUp.tsx'
import { GatewayProvider } from './gateway/gatewayContext.tsx'
import VerifyAccount from './pages/authPages/verifyAccount.tsx'
const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    children:[
      {
        path: "/signup",
        element: <SignUp/>
      },
      {
        path: "verify/account/:token",
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
