// ===========================================
// GOOGLE APPS SCRIPT - Contact Form Handler
// ===========================================
// 
// SETUP INSTRUCTIONS:
// 
// 1. Open your Google Sheet: 
//    https://docs.google.com/spreadsheets/d/1dk-m7VPXkfmjy774lDFOidxYHs3U2KwRy6LasPzDAEs/edit
//
// 2. Go to Extensions > Apps Script
//
// 3. Delete any existing code and paste this entire file
//
// 4. Click "Deploy" > "New deployment"
//
// 5. Click the gear icon next to "Select type" and choose "Web app"
//
// 6. Set the following:
//    - Description: "Contact Form Handler"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
//
// 7. Click "Deploy"
//
// 8. Copy the Web app URL (looks like: https://script.google.com/macros/s/XXXXXXX/exec)
//
// 9. Paste that URL into your contact.html file, replacing the placeholder in GOOGLE_SCRIPT_URL
//
// ===========================================

// The name of the sheet tab where data will be stored
const SHEET_NAME = 'Sheet1';

// Handle POST requests from the contact form
function doPost(e) {
  try {
    // Handle both FormData (e.parameter) and JSON (e.postData.contents)
    let data;
    if (e.parameter && e.parameter.name) {
      // FormData submission
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      // JSON submission
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received');
    }

    // Get the spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // If the sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Name', 'Email', 'Message']]);
      // Format headers
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // Format the timestamp for readability
    const timestamp = data.timestamp 
      ? new Date(data.timestamp).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        })
      : new Date().toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        });
    
    // Append the new row of data
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.message || ''
    ]);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 4);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data saved successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'Contact form handler is running' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this to verify setup
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Name', 'Email', 'Message']]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  // Add a test entry
  sheet.appendRow([
    new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    'Test User',
    'test@example.com',
    'This is a test message to verify the setup works correctly.'
  ]);
  
  sheet.autoResizeColumns(1, 4);
  
  Logger.log('Test completed! Check your sheet for the test entry.');
}
