import React, { useState } from 'react'
import JsPDF from 'jspdf'
import { useLocation } from 'react-router-dom'
import LargeTable from './LargeTable'
import '../styles/Estimate.css'

function Estimate() {
  const [showAdditionalConfigurationOptions, setShowAdditionalConfigurationOptions] = useState(false)
  const location = useLocation()

  // Access formData from the location state
  const formData = location.state

  // Use state to track edit mode and edited values
  const [editMode, setEditMode] = useState(false)
  const [editedData, setEditedData] = useState({ ...formData })

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  // Function to handle changes in edited data
  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      // Check if the value is a number
      const numericValue = parseFloat(value)
      if (!isNaN(numericValue)) {
        // Ensure the value does not go below 0 or above 24
        const clampedValue = Math.min(24, Math.max(0, numericValue))
        setEditedData({ ...editedData, [name]: clampedValue.toString() })
      }
    } else if (type === 'text') {
      // Ensure text values have at most 5 characters
      const trimmedValue = value.slice(0, 5)
      setEditedData({ ...editedData, [name]: trimmedValue })
    }
  }


  // Function to handle changes in the backup number input
  const handleBackupChange = (e) => {
    let backupHours = parseInt(e.target.value, 10) || 0 // Ensure it's a valid number

    // Ensure the value does not go below 0 or above 24
    backupHours = Math.min(24, Math.max(0, backupHours))

    setEditedData({ ...editedData, hours: backupHours })
  }


  // Function to handle appliance toggle cell
  const handleApplianceToggle = (index) => {
    const updatedAppliances = [...editedData.appliances]
    updatedAppliances[index].useDuringOutage = !updatedAppliances[index].useDuringOutage

    // Only turn 'own' on if 'useDuringOutage' is true
    if (updatedAppliances[index].useDuringOutage) {
      updatedAppliances[index].own = true
    }

    setEditedData({ ...editedData, appliances: updatedAppliances })
  }

  // Function to save edited data
  const saveEditedData = () => {
    // You can implement logic to save the edited data here, e.g., send it to an API
    // For simplicity, we'll just update edit mode and reset the form data
    setEditMode(false)
  }

  function determineSystemType(solarStatus) {
    if (solarStatus === 'No') {
      return 'Solar & Storage'
    } else {
      return 'Storage'
    }
  }

  function calculateBatteriesNeeded(appliances) {
    const ownYesCount = appliances.filter((appliance) => appliance.own === true).length

    if (ownYesCount === 0) {
      return (
        <div>
          <img className='estimate-img' src='' alt='1 battery' /><br />
          <div className='estimate-subheading'><strong>Standard appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>Refrigerator, Lights, Television, Internet Router, and Outlets</span>
        </div>
      )
    } else if (ownYesCount === 1) {
      return (
        <div>
          <img className='estimate-img' src='' alt='2 batteries' /><br />
          <div className='estimate-subheading'><strong>Standard appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>Refrigerator, Lights, Television, Internet Router, and Outlets</span>
          <div className='estimate-subheading'><strong>Major Appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>One major household appliance(ex. Air Conditioner, Pool Pump)</span>
        </div>
      )
    } else {
      return (
        <div>
          <img className='estimate-img' src='' alt='4 batteries' /><br />
          <div className='estimate-subheading'><strong>Standard appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>Refrigerator, Lights, Television, Internet Router, and Outlets</span><br />
          <div className='estimate-subheading'><strong>Extra Large Appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>One major household appliance and one extra large appliance<br />(ex. Electric Vehicle Charger)</span>
        </div>
      )
    }
  }

  const batteriesNeeded = calculateBatteriesNeeded(editedData.appliances)

  const handleAdditionalConfigurationOptions = () => {
    setShowAdditionalConfigurationOptions(!showAdditionalConfigurationOptions)
  }

  // Function to generate the PDF report
  const generatePDF = () => {
    // const report = new JsPDF('portrait', 'pt', 'a4')
    const report = new JsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      margins: { top: 10, bottom: 10, left: 10, right: 10 },
      width: '100%',
      height: '100%',
    })

    // Generate the PDF from the HTML content with the ID 'report'
    report.html(document.querySelector('#estimate-report')).then(() => {
      report.save('Your TruPower Summary.pdf') // Save the generated PDF with the specified filename
    })
  }






  return (
    <div id='estimate-report'>
      <div className="customer-estimate">
        <h3>Your Estimate</h3>
        {editMode ? (
          <div>
            <label>Update Your Zip Code:</label>
            <input className='customer-edit-input' type="text" name="zipCode" value={editedData.zipCode} onChange={handleInputChange} />
            <br />
            <label>Update Your Monthly Bill:</label>
            <input
              className='customer-edit-input'
              type="number"
              name="monthlyBill"
              value={editedData.monthlyBill}
              onChange={handleInputChange}
            />
            <br />
            <label>Do you currently have solar?</label>
            <select
              className='customer-edit-select-input'
              name="solarStatus"
              value={editedData.solarStatus}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <br />
            <label>How many hours of backup do you need per day?</label>
            <input
              className='customer-edit-input'
              type="number"
              name="hours"
              value={editedData.hours}
              onChange={handleBackupChange}
            />
            <br />
            <h4>Major Appliances:</h4>
            <div className='appliance-table-edit-container'>
              <table className='appliance-table-edit'>
                <thead>
                  <tr>
                    <th>Appliances</th>
                    <th>I Own</th>
                    <th>Use During Outage</th>
                  </tr>
                </thead>
                <tbody>
                  {editedData.appliances.map((appliance, index) => (
                    <tr key={index}>
                      <td>{appliance.name}</td>
                      <td>
                        <input
                          className='appliance-own'
                          type="checkbox"
                          name={`own-${index}`}
                          checked={appliance.own}
                          onChange={(e) => {
                            const updatedAppliances = [...editedData.appliances]
                            updatedAppliances[index].own = e.target.checked
                            setEditedData({ ...editedData, appliances: updatedAppliances })
                          }}
                        />
                      </td>
                      <td className="toggle-cell">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={appliance.useDuringOutage}
                            onChange={() => handleApplianceToggle(index)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className='customer-form-submit-btn' type='submit' onClick={saveEditedData}>Save</button>
            <button className='btn' onClick={handleAdditionalConfigurationOptions}>Additional Configuration</button>
          </div>
        ) : (
          <div>
            <div>
              {editedData.zipCode}, {editedData.sliderValue}kWh/day, {determineSystemType(editedData.solarStatus)}, {editedData.hours} hrs backup
            </div>
            <div>{batteriesNeeded}</div>
            <button className='customer-form-submit-btn' onClick={toggleEditMode}>Edit Details</button>
            <button className='btn' onClick={generatePDF}>Download Your Estimate</button>
          </div>
        )}
      </div>
      {showAdditionalConfigurationOptions ? <LargeTable showAdditionalConfigurationOptions={showAdditionalConfigurationOptions} setShowAdditionalConfigurationOptions={setShowAdditionalConfigurationOptions} /> : null}
    </div>
  )
}

export default Estimate