import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { NextUIProvider, Spinner } from '@nextui-org/react'
import { RouterProvider } from 'react-router-dom'
import routes from './routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
    <RouterProvider router={routes} fallbackElement={<Spinner />} />
    </NextUIProvider>
  </React.StrictMode>,
)
