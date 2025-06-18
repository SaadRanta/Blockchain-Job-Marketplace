import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JobMarketplace from './components/JobMarketplace';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <JobMarketplace></JobMarketplace>
    </>
  )
}

export default App
