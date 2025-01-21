import * as React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router'

import { ThemeProvider } from './components/theme-provider'
import router from './router'
import './styles/global.css'
import './i18n'

const $container = document.querySelector('#app') as HTMLElement

ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
