import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import Root from './routes/Root.jsx'
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Profile from "./routes/Profile";
import ErrorPage from './error-page'
import Preview,{loader as previewLoader} from './routes/Preview.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";

const router = createBrowserRouter([{
  path:"/",
  element:<Root/>,
  errorElement : <ErrorPage/>,
  children:[
    {
      path:"/cats/:catId",
      element:<Preview/>,
      loader:previewLoader
    },
  ]
},{
  path:"/login",
  element:<Login/>,
  errorElement : <ErrorPage/>,
},   
{
  path:"/signup",
  element:<Signup/>,
  errorElement : <ErrorPage/>,
},
{
  path:"/profile",
  element:<Profile/>,
  errorElement : <ErrorPage/>,
}
])
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode> strict mode causes useCallback to render twice
    <RouterProvider router={router}/>
  // </React.StrictMode>,
)
