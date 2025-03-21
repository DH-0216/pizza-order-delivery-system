import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebsr from './componnents/sidebar/sidebar'

const App = () => {
  return (
    <div>
      <Navbar/>
     <hr/>
     <div className='app-content'>
      <sidebar/> 

     </div>
      
    </div>
  )
}

export default App

