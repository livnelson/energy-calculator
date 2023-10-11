import React from 'react'
import '../styles/LargeTable.css' // Import CSS for styling


function LargeTableRow({
  row,
  handleOwnershipToggle,
  handleBackupToggle,
  handleIncrement,
  handleDecrement,
  handlePowerChange,
  handleUsageChange,
}) {

  return (
    <tr key={row.id} className='large-table-row'>
      <td className='large-row-name'>{row.name}</td>
      <td>
        {/* Own Button */}
        <button
          className={row.ownership === '✓' ? 'large-own-button' : 'large-not-own-button'}
          onClick={() => handleOwnershipToggle(row.id)}
        >
          {row.ownership}
        </button>
      </td>
      <td className='large-toggle-cell'>
        {/* Toggle Switch */}
        <div className='centered-toggle-switch'>
        <div
          className={`large-toggle-switch ${row.addBackup ? 'on' : 'off'}`}
          onClick={() => handleBackupToggle(row.id)}
        >
          <div className="large-slider"></div>
        </div>
        </div>
      </td>
      <td>
        {/* Quantity Controls */}
        <div className='large-quantity-row'>
          <button className='large-row-decrement' onClick={() => handleDecrement(row.id)}>-</button>
          <span>{row.quantity}</span>
          <button className='large-row-increment' onClick={() => handleIncrement(row.id)}>+</button>
        </div>
      </td>
      <td>
        {/* Power Input */}
        <div>
          <input
            className='large-power-row-input'
            type='number'
            step='0.01'
            min='0'
            value={row.power.toFixed(2)} // Use toFixed(2) to display 2 decimal places
            onChange={(e) => handlePowerChange(e, row.id)}
          />
          <span>kW</span>
        </div>
      </td>
      <td>
        {/* Usage Input */}
        <div>
          <input
            className='large-usage-row-input'
            type='number'
            step='0.25'
            min='0'
            value={row.usage}
            onChange={(e) => handleUsageChange(e, row.id)}
          />
          <span>Hours</span>
        </div>
      </td>
    </tr>
  )
}

export default LargeTableRow