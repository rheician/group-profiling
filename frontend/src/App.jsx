import { useState, useEffect } from 'react'
import LoadingScreen from "./LoadingScreen.jsx";
import Home from './Home'
import Chelsy from './Chelsy'
import Rheician from './Rheician'
import Olivenn from './Olivenn'
import Radcliff from './Radcliff'

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

  if (currentPath === '/portfolio/rheician') {
    return <Rheician />
  }

  if (currentPath === '/portfolio/olivenn') {
    return <Olivenn />
  }

  if (currentPath === '/portfolio/radcliff') {
    return <Radcliff />
  }

  const [isLoading, setIsLoading] = useState(true);

  return (
      <>
        {isLoading && (
            <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
        <Home />
      </>
  );
}

export default App