import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import Root from './routes/Root.jsx'
import ErrorPage from './error-page'
import Preview,{loader as previewLoader} from './routes/Preview.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([{
  path:"/",
  element:<Root/>,
  errorElement : <ErrorPage/>,
  children:[
    {
      path:"/cats/:catId",
      element:<Preview/>,
      loader:previewLoader
    }
  ]
}])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
