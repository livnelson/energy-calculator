import React from 'react'
import JsPDF from 'jspdf'
import '../styles/CustomerSummary.css' // Import your CSS file for styling

function CustomerSummary({ customerSummaryList, sums, checkPower }) {

  const powerCheckResult = checkPower(sums) // Use the checkPower function to determine "TruPower" or "Not TruPower"

  // Function to generate the PDF report
  const generatePDF = () => {
    // const report = new JsPDF('portrait', 'pt', 'a4')
    const report = new JsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      margins: { top: 10, bottom: 10, left: 10, right: 10 },
    })

    // Generate the PDF from the HTML content with the ID 'report'
    report.html(document.querySelector('#report')).then(() => {
      report.save('Your TruPower Summary.pdf') // Save the generated PDF with the specified filename
    })
  }

  function generateSummaryMessage() {
    const hasName = customerSummaryList.some((selectedRowData) => selectedRowData.name)
    if (!hasName) {
      return (
        <div>
          <h2 className='summary-heading'>Your TruPower Solution Summary</h2><br />
          <div className="power-check-result">{powerCheckResult}</div>
          <div className='download-button'>
            <button className='btn' onClick={generatePDF} type="button">Download Your Summary</button>
          </div>
          <div className="large-tip-message">
            <p>
              <em>Tip: This is a preliminary estimate only.<br />
                System size and quote should be finalized with your TruPower Installer.<br />
                To confirm your initial estimate with an expert installer,<br />
                contact <a href='mailto:info@gettrupower.com' target='_blank' rel='noreferrer'>info@gettrupower.com</a>.</em>
            </p>
          </div>

        </div>
      )
    }
    // Return an empty string if there are selected rows with names
    return ''
  }

  const errorMessage = generateSummaryMessage()

  return (
    <div className='summary-details'>
      {errorMessage ? (
        <span>{errorMessage}</span>
      ) : (
        <div>
          <div id='report' className='pdf-container'>
            <h2 style={{ textAlign: 'center' }}>Your TruPower Solution Summary</h2>
            <div className="power-check-result">{powerCheckResult}</div>
            <div className='download-button'>
              <button className='btn' onClick={generatePDF} type="button">Download Your Summary</button>
            </div>
            <div className="large-tip-message">
              <p>
                <em>Tip: This is a preliminary estimate only.<br />
                  System size and quote should be finalized with your TruPower Installer.<br />
                  To confirm your initial estimate with an expert installer,<br />
                  contact <a href='mailto:info@gettrupower.com' target='_blank' rel='noreferrer'>info@gettrupower.com</a>.</em>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerSummary