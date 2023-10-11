import React from "react"
import { Routes, Route } from "react-router-dom"
import Form from "./Form"
import Estimate from "./Estimate"
import '../styles/App.css'
import '../styles/Estimate.css'
import '../styles/Form.css'
import '../styles/InputStyles.css'
import '../styles/QuantityRowStyles.css'
import '../styles/SummaryStyles.css'
import '../styles/Table.css'
import '../styles/ToggleSwitch.css'
import '../styles/TotalBarStyles.css'

function App() {
  
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/estimate" element={<Estimate />} />
      </Routes>
    </div>
  )
}

export default App