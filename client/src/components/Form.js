import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Form.css'

function Form() {
  const [sliderValue, setSliderValue] = useState(35)
  const [hours, setHours] = useState(16)
  const [appliances, setAppliances] = useState([
    { name: 'Air Conditioner', own: false, useDuringOutage: false },
    { name: 'Pool Pump', own: false, useDuringOutage: false },
    { name: 'Electric Vehicle', own: false, useDuringOutage: false },
  ])

  const navigate = useNavigate()

  const handleSliderChange = (e) => {
    const newValue = e.target.value
    setSliderValue(newValue)
  }

  const handleIncrement = (e) => {
    e.stopPropagation()
    setHours(hours + 1)
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    if (hours > 0) {
      setHours(hours - 1)
    }
  }

  const handleShowEstimate = (e) => {
    e.preventDefault()
    navigate('/estimate')
  }

  const handleApplianceOwnershipChange = (index) => {
    const updatedAppliances = [...appliances]
    updatedAppliances[index].own = !updatedAppliances[index].own
    setAppliances(updatedAppliances)
  }

  const handleUseDuringOutageChange = (index) => {
    const updatedAppliances = [...appliances]
    updatedAppliances[index].useDuringOutage = !updatedAppliances[index].useDuringOutage
    setAppliances(updatedAppliances)
  }

  return (
    <div className='customer-form'>
      <form onSubmit={handleShowEstimate}>
        <h3>Enter Your Energy Requirements</h3>
        <div>
          {/* Label for zip code input */}
          <input
            className='customer-form-input'
            type='text'
            id='zipCode'
            name='zipCode'
            placeholder='Enter your Zip Code / Address'
            required
          />
        </div>

        <div className='customer-form-bill-input'>
          <label className='customer-form-label'>My Electricity Bill</label>
          <div className='customer-form-custom-input'>
            <span className='customer-form-input-text'>$</span>
            {/* Label for monthly bill input */}
            <input
              className='customer-form-small-input'
              type='text'
              id='monthlyBill'
              name='monthlyBill'
              placeholder='150'
            />
            <span className='customer-form-input-text'>per month</span>
          </div>
        </div>

        <div className='customer-form-slider'>
          {/* Label for estimated energy consumption input */}
          <label className='customer-form-label'>Estimated Energy Consumption</label>
          <input
            className='slider'
            name='estimatedEnergyConsumption'
            type='range'
            min='0'
            max='150'
            value={sliderValue}
            onChange={handleSliderChange}
            aria-label='Estimated Energy Consumption'
            aria-valuemin='0'
            aria-valuemax='150'
            aria-valuenow={sliderValue}
          />
          <span>{sliderValue} kWh/Day</span>
        </div>

        <div className='customer-form-radio-btn-container'>
          {/* Label for radio buttons */}
          <label className='customer-form-label'>Do you currently have solar?</label>
          <div>
            <input
              className='customer-form-radio'
              type='radio'
              id='radioYes'
              name='radioGroup'
              value='Yes'
            />
            <label htmlFor='radioYes'>Yes</label>
            <input
              className='customer-form-radio'
              type='radio'
              id='radioNo'
              name='radioGroup'
              value='No'
            />
            <label htmlFor='radioNo'>No</label>
          </div>
        </div>

        <div>
          {/* Label for backup hours */}
          <label className='customer-form-label'>In an outage, I need a backup of</label>
          <button
            className='customer-form-small-button'
            type='button' // Set type to "button"
            value='-'
            onClick={handleDecrement}
          >
            -
          </button>
          <span>{hours} hrs</span>
          <button
            className='customer-form-small-button'
            type='button' // Set type to "button"
            value='+'
            onClick={handleIncrement}
          >
            +
          </button>
        </div>

          <div className='appliance-table-container'>
            <table className='appliance-table'>
              <thead>
                <tr>
                  <th>Major Appliances</th>
                  <th>I Own</th>
                  <th>Use During Outage</th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((appliance, index) => (
                  <tr key={index}>
                    <td>{appliance.name}</td>
                    <td>
                      <input
                        type='radio'
                        name={`own-${index}`}
                        checked={appliance.own}
                        onChange={() => handleApplianceOwnershipChange(index)}
                      />
                    </td>
                    <td className='toggle-cell'>
                      <label className='toggle-switch'>
                        <input
                          type='checkbox'
                          checked={appliance.useDuringOutage}
                          onChange={() => handleUseDuringOutageChange(index)}
                        />
                        <span className='toggle-slider'></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        <div>
          <button className='customer-form-submit-btn' type='submit'>
            Show My Estimate
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form