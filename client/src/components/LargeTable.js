import React, { useState, useEffect } from 'react'
import LargeTableRow from './LargeTableRow' // Import the TableRow component
import CustomerSummary from './CustomerSummary'
import '../styles/LargeTable.css' // Import CSS for styling

function LargeTable({ showAdditionalConfigurationOptions, setShowAdditionalConfigurationOptions, checkPower }) {
  const [customerSummaryList, setCustomerSummaryList] = useState([]) // State to store selected customer summary list
  const [quantityChanged, setQuantityChanged] = useState(false) // State to track if quantity has changed
  const [sums, setSums] = useState({ power: 1447.22, usage: 0, kWh: 63.03 }) // State to store calculated sums

  // Define initial data for table rows, with 'ownership' initially set to an empty string
  const initialData = [
    { id: 2, name: 'Light Bulbs', power: 0.02, usage: 9, ownership: '✓', addBackup: false, quantity: 12, initialPower: 0.02 },
    { id: 4, name: 'Fridge', power: 60, usage: 24, ownership: '✓', addBackup: false, quantity: 1, initialPower: 60 },
    { id: 1, name: 'Microwave', power: 0.12, usage: .25, ownership: '', addBackup: false, quantity: 0, initialPower: 0.12 },
    { id: 3, name: 'TV', power: 0.48, usage: 5, ownership: '✓', addBackup: false, quantity: 1, initialPower: 0.48 },
    { id: 5, name: 'Router', power: 0.015, usage: 24, ownership: '✓', addBackup: false, quantity: 1, initialPower: 0.015 },
    { id: 6, name: 'Central AC', power: 10.55, usage: 2.5, ownership: '', addBackup: false, quantity: 0, initialPower: 10.55 },
    { id: 7, name: 'Heat Pump', power: 10.5, usage: 2, ownership: '', addBackup: false, quantity: 0, initialPower: 10.5 },
    { id: 8, name: 'Water Heater', power: 500, usage: 1, ownership: '', addBackup: false, quantity: 0, initialPower: 500 },
    { id: 9, name: 'Oven', power: 2.3, usage: 1, ownership: '✓', addBackup: false, quantity: 1, initialPower: 2.3 },
    { id: 10, name: 'Vacuum Cleaner', power: 0.75, usage: 0.5, ownership: '', addBackup: false, quantity: 0, initialPower: 0.75 },
    { id: 11, name: 'Hair Dryer', power: 1.5, usage: 0.25, ownership: '', addBackup: false, quantity: 0, initialPower: 1.5 },
    { id: 12, name: 'Pool', power: 1.12, usage: 2, ownership: '', addBackup: false, quantity: 0, initialPower: 1.12 },
    { id: 13, name: 'EV Charger', power: 7.2, usage: 9, ownership: '', addBackup: false, quantity: 0, initialPower: 7.2 },
  ]

  // State to store the data for the table rows
  const [data, setData] = useState(initialData)

  useEffect(() => {
    // Calculate sums when quantity has changed
    if (quantityChanged) {
      const newSums = { power: 1447.22, usage: 0, kWh: 63.03 }
      data.forEach((row) => {
        newSums.power += row.power * row.quantity
        newSums.usage += row.usage * row.quantity
        newSums.kWh += row.power * row.usage * row.quantity
      })
      setSums(newSums)
    }
  }, [data, quantityChanged])


  // Function to calculate sums of power, usage, and kWh
  const calculateSums = () => {
    const newSums = { power: 0, usage: 0, kWh: 0 }
    data.forEach((row) => {
      newSums.power += row.power * row.quantity
      newSums.usage += row.power * row.quantity
      newSums.kWh += row.power * row.usage
    })
    setSums(newSums)
  }

  // Function to handle ownership toggle for a row
  const handleOwnershipToggle = (id) => {
    const newData = data.map((row) =>
      row.id === id
        ? {
          ...row,
          ownership: row.ownership === '✓' ? '' : '✓',
          quantity: row.ownership === '✓' ? 0 : 1,
          power: row.ownership === '✓' ? 0 : row.initialPower * (row.quantity || 1),
          addBackup: row.ownership === '✓' ? false : row.addBackup,
        }
        : row
    )

    // Check if ownership was set to an empty string ('') and turn off backup in that case
    if (newData.find((row) => row.id === id).ownership === '') {
      newData.find((row) => row.id === id).addBackup = false
    }

    setData(newData)

    const updatedSummaryList = newData
      .filter((row) => row.ownership === '✓')
      .map((row) => ({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        power: row.power,
        backup: row.addBackup ? 'Yes' : 'No',
        usage: row.usage,
      }))

    setCustomerSummaryList(updatedSummaryList)
    setQuantityChanged(true)
  }

  // Function to handle backup toggle for a row
  const handleBackupToggle = (id) => {
    const newData = data.map((row) => {
      if (row.id === id) {
        const updatedRow = {
          ...row,
          addBackup: !row.addBackup,
        }

        // Check if ownership should be changed
        if (!row.addBackup && row.quantity === 0) {
          updatedRow.ownership = '✓' // Turn on ownership
          updatedRow.quantity = 1 // Set quantity to 1
        }
        return updatedRow
      }
      return row
    })

    setData(newData)

    const updatedSummaryList = newData
      .filter((row) => row.ownership === '✓')
      .map((row) => ({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        power: row.power,
        usage: row.usage,
        backup: row.addBackup ? 'Yes' : 'No',
      }))

    setCustomerSummaryList(updatedSummaryList)
    setQuantityChanged(true)

    // Check ownership and addBackup values
    // console.log('Ownership:', newData.find((row) => row.id === id).ownership);
    // console.log('Add Backup:', newData.find((row) => row.id === id).addBackup);
  }

  // Function to handle quantity change for a row
  const handleQuantityChange = (id, newQuantity) => {
    const updatedData = data.map((row) => {
      if (row.id === id) {
        const updatedRow = {
          ...row,
          quantity: newQuantity,
          power: row.initialPower * newQuantity,
          ownership: newQuantity > 0 ? '✓' : '', // Update ownership based on new quantity
          addBackup: newQuantity > 0 ? row.addBackup : false, // Turn off backup if new quantity is 0
        }
        return updatedRow
      }
      return row
    })

    // Update the customerSummaryList with the new quantity and existing backup and usage values
    const updatedCustomerSummaryList = updatedData
      .filter((row) => row.ownership === '✓')
      .map((row) => ({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        power: row.power,
        usage: row.usage,
        backup: row.addBackup ? 'Yes' : 'No',
      }))

    setData(updatedData) // Update data state
    setQuantityChanged(true) // Set quantityChanged to true when quantity is changed
    setCustomerSummaryList(updatedCustomerSummaryList) // Update customerSummaryList
    calculateSums() // Calculate sums after updating the data
  }

  // Function to increment quantity for a row
  const handleIncrement = (id) => {
    const newData = data.map((row) =>
      row.id === id
        ? {
          ...row,
          quantity: row.quantity + 1,
          ownership: '✓', // Set ownership to true when incrementing
        }
        : row
    )
    setData(newData)
    handleQuantityChange(id, newData.find(row => row.id === id).quantity) // Call handleQuantityChange
  }

  // Function to decrement quantity for a row
  const handleDecrement = (id) => {
    const updatedData = data.map((row) =>
      row.id === id
        ? {
          ...row,
          quantity: Math.max(row.quantity - 1, 0),
          ownership: Math.max(row.quantity - 1, 0) === 0 ? '' : row.ownership, // Set ownership to false if new quantity is 0
        }
        : row
    )
    setData(updatedData)
    handleQuantityChange(id, updatedData.find((row) => row.id === id).quantity) // Call handleQuantityChange
  }

  // Function to handle power change for a row
  const handlePowerChange = (e, id) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      const roundedValue = Math.round(newValue * 100) / 100 // Round to 2 decimal places
      const newData = data.map((row) =>
        row.id === id ? { ...row, power: roundedValue } : row
      )
      setData(newData) // Update data state
      calculateSums()
    }
  }

  // Function to handle usage change for a row
  const handleUsageChange = (e, id) => {
    const newValue = parseFloat(e.target.value, 10)
    const newData = data.map((row) =>
      row.id === id ? { ...row, usage: newValue } : row
    )
    setData(newData)
    calculateSums() // Recalculate sums after updating usage

    // Update the customerSummaryList with the new usage value
    const updatedCustomerSummaryList = newData
      .filter((row) => row.ownership === '✓')
      .map((row) => ({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        power: row.power,
        usage: row.usage, // Include updated usage in the summary
        backup: row.addBackup ? 'Yes' : 'No',
      }))

    setCustomerSummaryList(updatedCustomerSummaryList)
  }

  const handleClose = () => {
    setShowAdditionalConfigurationOptions(!showAdditionalConfigurationOptions)
  }






  return (
    <div className='energy-calculator'>
      <div className='close-btn-container'>
        <button className='large-table-close-button' onClick={handleClose}>Close</button>
      </div>
      <div className='large-table-container'>
        <table className='large-table'>
          <thead>
            <tr>
              <th className='large-table-header'>Appliance</th>
              <th className='large-table-header'>Own</th>
              <th className='large-table-header'>Backup</th>
              <th className='large-table-header'>Quantity</th>
              <th className='large-table-header'>Energy Usage</th>
              <th className='large-table-header'>Daily Usage</th>
            </tr>
          </thead>
          <tbody className='large-table-body'>
            {data.map((row) => (
              <LargeTableRow
                key={row.id}
                row={row}
                handleOwnershipToggle={handleOwnershipToggle}
                handleBackupToggle={handleBackupToggle}
                handleDecrement={handleDecrement}
                handleIncrement={handleIncrement}
                handlePowerChange={handlePowerChange}
                handleUsageChange={handleUsageChange}
              />
            ))}
          </tbody>
        </table>
        <div className='large-total-bar'>
          <div className='large-totals'>
            <span className='large-total-sum'>Total Energy Usage: {sums.power.toFixed(2)}kW</span>
            <span className='large-total-sum'>Total Backup kWh Needed: {sums.kWh.toFixed(2)}kWh</span>
          </div>
        </div>
        <div className='customer-summary'>
          <CustomerSummary customerSummaryList={customerSummaryList} sums={sums} checkPower={checkPower} />
        </div>
      </div>
    </div>
  )
}

export default LargeTable