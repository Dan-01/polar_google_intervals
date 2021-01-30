// gets the wellness data you want from the sheet and puts it in to Intervals.icu
// see this link for more information
// https://forum.intervals.icu/t/api-access-to-intervals-icu/609
// an Intervals.icu api key must be generated from your account settings.
function populate_intervals_wellness_data() {
  var today_date = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  var url = INTERVALS_API_BASE + '/athlete/' + ATHLETE_ID + '/wellness/' + today_date;
  var user = 'API_KEY';
  var pw = API_KEY;

  // get last row and subsequent values
  var sheet = SpreadsheetApp.getActive().getSheetByName('Data');
  var rangeLastRow = sheet.getLastRow();

  // get polar values to put. We convert from decimal hours in the sheet back to seconds (* 3600)
  // as that is the format required by Intervals.icu
  var polar_hrv = sheet.getRange(rangeLastRow, 6).getValue();
  var polar_avg_hr = sheet.getRange(rangeLastRow, 5).getValue();
  var polar_total_sleep = sheet.getRange(rangeLastRow, 20).getValue();
  polar_total_sleep = polar_total_sleep * 3600;


  var payload = {
    'hrv': polar_hrv,
    'restingHR': polar_avg_hr,
    'sleepSecs': polar_total_sleep
  };

  var headers = {
    // use basic auth
    'Authorization': 'Basic ' + Utilities.base64Encode(
      user + ':' + pw, Utilities.Charset.UTF_8),
    "Content-Type": "application/json"
  };

  var options = {
    'method': 'put',
    'headers': headers,
    'muteHttpExceptions': true,
    'payload': JSON.stringify(payload)
  };

  //var request = UrlFetchApp.getRequest(url, options);
  //Logger.log(request);
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getContentText());

}