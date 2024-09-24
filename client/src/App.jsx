import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Join from './components/Join'
import Landing from './components/Landing'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Join/>}/>
        <Route path='/game' element={<Landing/>}/>
      </Routes>
    </Router>
  )
}

export default App