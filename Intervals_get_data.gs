// this function assumes the CSV has no fields with commas,
// and strips out all the double quotes
function parse_csv_response(csv_string) {
  var retArray = [];
  var strLines = csv_string.split(/\n/g);
  var strLineLen = strLines.length;
  for (var i = 0; i < strLineLen; i++) {
    var line = strLines[i];
    if (line != '') {
      retArray.push(line.replace(/"/g, "").split(/,/));
    }
  } return retArray;
}

// makes request to Intervals.icu and pulls back all activity data. Dumps it into a sheet.
function populate_intervals_sheet_csv() {
  var csvUrl = INTERVALS_API_BASE + '/athlete/' + ATHLETE_ID + '/activities.csv'
  var user = 'API_KEY'
  var pw = API_KEY
  var resp = UrlFetchApp.fetch(csvUrl, {
    headers: {
      // use basic auth
      'Authorization': 'Basic ' + Utilities.base64Encode(
        user + ':' + pw, Utilities.Charset.UTF_8)
    }
  });// parse the response as a CSV

  var csvContent = parse_csv_response(resp.getContentText());// clear everything in the sheet    
  var sheet = SpreadsheetApp.getActive().getSheetByName(INTERVALS_ICU_SHEET_NAME);
  sheet.clearContents().clearFormats();// set the values in the sheet (as efficiently as we know how)
  sheet.getRange(1, 1, csvContent.length, csvContent[0].length).setValues(csvContent);

}