import { useState, useEffect } from 'react'
import Home from './Home'
import Chelsy from './Chelsy'
import Olivenn from './Olivenn'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/portfolio/chelsy') {
    return <Chelsy />
  }
  if (currentPath === '/portfolio/oli') {
    return <Olivenn />
  }
  return <Home />
}

export default App