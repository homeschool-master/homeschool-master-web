import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { setSessionExpiredHandler } from './services/api.ts'
import { clearUser } from './store/authSlice.tsx'

// A refresh that fails is a real logout: clearing the user is enough, because
// the protected route guard sends anyone on an app page to login from there.
setSessionExpiredHandler(() => {
  store.dispatch(clearUser())
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
