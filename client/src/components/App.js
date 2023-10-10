import React from "react"
import { Routes, Route } from "react-router-dom"
import Form from "./Form"
import Estimate from "./Estimate"
import '../styles/App.css'

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