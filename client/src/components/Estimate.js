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

  // Function to handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      if (name === 'monthlyBill') {
        // Ensure monthlyBill is a whole number and non-negative
        let numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          numericValue = Math.max(0, Math.floor(numericValue));
          setEditedData({ ...editedData, [name]: numericValue });
        }
      } else if (name === 'hours') {
        // Ensure hours is between 0 and 24
        let numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 24) {
          setEditedData({ ...editedData, [name]: numericValue });
        }
      }
    } else if (type === 'text') {
      // Handle text inputs as you were doing
      const trimmedValue = value.slice(0, 5);
      setEditedData({ ...editedData, [name]: trimmedValue });
    } else if (type === 'select-one') {
      // Handle dropdown selects separately
      setEditedData({ ...editedData, [name]: value });
    }
  }

  // Function to handle changes in the backup number input
  const handleBackupChange = (e) => {
    let backupHours = parseInt(e.target.value, 10) || 0; // Ensure it's a valid number

    // Ensure the value does not go below 0 or above 24
    backupHours = Math.min(24, Math.max(0, backupHours));

    setEditedData({ ...editedData, hours: backupHours });
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
    setEditMode(false)
  }

  // Function to determine whether the user needs solar and storage or just storage
  function determineSystemType(solarStatus) {
    if (solarStatus === 'No') {
      return 'Solar & Storage'
    } else {
      return 'Storage Only'
    }
  }

  // Function to claculate how many batteris a user needs based on input parameters
  function calculateBatteriesNeeded(appliances) {
    const ownUseDuringOutage = appliances.filter((appliance) => appliance.useDuringOutage === true).length

    if (ownUseDuringOutage === 0) {
      return (
        <div>
          <img className='estimate-img' src='https://res.cloudinary.com/domjidfzz/image/upload/v1697062067/TruPower/trupower_recomendation-1_mdsbno.png' alt='1 battery' /><br />
          <div className='estimate-subheading'><strong>Standard appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>Refrigerator, Lights, Television, Internet Router, and Outlets</span>
        </div>
      )
    } else if (ownUseDuringOutage === 1) {
      return (
        <div>
          <img className='estimate-img' src='https://res.cloudinary.com/domjidfzz/image/upload/v1697062056/TruPower/trupower-recomendation-2_haff8i.png' alt='2 batteries' /><br />
          <div className='estimate-subheading'><strong>Standard appliances to be backed up:</strong></div><br />
          <span className= 'estimate-description'>Refrigerator, Lights, Television, Internet Router, and Outlets</span>
          <div className='estimate-subheading'><strong>Major Appliances to be backed up:</strong></div><br />
          <span className='estimate-description'>One major household appliance(ex. Air Conditioner, Pool Pump)</span>
        </div>
      )
    } else {
      return (
        <div>
          <img className='estimate-img' src='https://res.cloudinary.com/domjidfzz/image/upload/v1697062044/TruPower/trupower-reccomendation-4_mhawoq.png' alt='4 batteries' /><br />
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

    // Generate the PDF from the HTML content with the ID 'estimate-report'
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
              {editedData.zipCode}, {editedData.sliderValue}kWh / month, {determineSystemType(editedData.solarStatus)}, {editedData.hours} hrs backup
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