import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { api } from './lib/api.ts'

window.Notification.requestPermission((permission) => {
  if (permission === 'granted') {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(async (serviceWorker) => {
        let subscription = await serviceWorker.pushManager.getSubscription()

        if (!subscription) {
          const publicKeyResponse = await api.get('/push/public-key')

          subscription = await serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKeyResponse.data.publicKey,
          })
        }

        await api.post('/push/register', {
          subscription,
        })

        await api.post('/push/send', {
          subscription,
        })
      })
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
