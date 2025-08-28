import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '../app/components/ui/theme-provider'
import { Toaster } from "../app/components/ui/sonner"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <App />
            <Toaster />
        </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>,
)