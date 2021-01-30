// All functions based on Polar Accesslink open api
// https://www.polar.com/accesslink-api/#polar-accesslink-api
// Note the followin - the means for obtaining a token is rather convuluted and I have not made this
// work with Google Apps Script yet. Best option is to follow their example for the Python script first
// https://github.com/polarofficial
// Once you have that working you can take the token id that is stored in creds.yml and use that in Script requests


// get a list of nightly recharges from last 28 days - not used here other than testing
function list_nightly_recharges() {

  var url = POLAR_API_BASE + '/users/nightly-recharge';

  var headers = {
    // use basic auth
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
    'Accept': 'application/json',
    "Content-Type": "application/json"
  };

  var options = {
    'method': 'GET',
    'headers': headers,
    'muteHttpExceptions': true
    //'payload': JSON.stringify(payload)
  };

  //var request = UrlFetchApp.getRequest(url, options);
  //Logger.log(request);
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getContentText());

}


// get last night's nightly recharge data and return results to calling function
function get_nightly_recharge() {

  var today_date = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  var url = POLAR_API_BASE + '/users/nightly-recharge/' + today_date;

  var headers = {
    // use basic auth
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
    'Accept': 'application/json',
    "Content-Type": "application/json"
  };

  var options = {
    'method': 'GET',
    'headers': headers,
    'muteHttpExceptions': true
    //'payload': JSON.stringify(payload)
  };

  //var request = UrlFetchApp.getRequest(url, options);
  //Logger.log(request);
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getContentText());

  var data = JSON.parse(response.getContentText());
  var rows = []
  rows[0] = [data.ans_charge,
  data.beat_to_beat_avg,
  data.breathing_rate_avg,
  data.date,
  data.heart_rate_avg,
  data.heart_rate_variability_avg,
  data.nightly_recharge_status];

  return rows

}


// get last night's sleep data and return results to calling function
// Total Sleep (hr) is a calculated field made by adding deep/light/rem sleep values together
function get_sleep() {

  var today_date = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  var url = POLAR_API_BASE + '/users/sleep/' + today_date;

  var headers = {
    // use basic auth
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
    'Accept': 'application/json',
    "Content-Type": "application/json"
  };

  var options = {
    'method': 'GET',
    'headers': headers,
    'muteHttpExceptions': true
    //'payload': JSON.stringify(payload)
  };

  //var request = UrlFetchApp.getRequest(url, options);
  //Logger.log(request);
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getContentText());

  // parse some of the JSON data to convert sleep values from seconds to rounded decimal hour for ease of use
  var data = JSON.parse(response.getContentText());
  //Logger.log(data);
  var rows = []
  rows[0] = [data.continuity,
  data.continuity_class,
  data.date,
  Math.round((data.deep_sleep / 3600 + Number.EPSILON) * 100) / 100,
  data.device_id,
  Math.round((data.light_sleep / 3600 + Number.EPSILON) * 100) / 100,
  Math.round((data.rem_sleep / 3600 + Number.EPSILON) * 100) / 100,
  data.sleep_end_time,
  data.sleep_score,
  data.sleep_start_time,
  Math.round((data.total_interruption_duration / 3600 + Number.EPSILON) * 100) / 100,
  data.unrecognized_sleep_stage,
  Math.round(((data.deep_sleep + data.light_sleep + data.rem_sleep) / 3600 + Number.EPSILON) * 100) / 100
  ];

  return rows
}

// append the data from nightly recharg and sleep to create a single row
// which we then append to the bottom of our spreadsheet.
// Please note - the spreadsheet column headers are arbirary and created in no special order
// but should match the ordering of the array!
// In this example, the headers are:
// ANS Charge,Beat to Beat Avg (ms),Breathing Rate Avg (rpm),Recharge Date,	Heart Rate Avg,
// HRV Avg (ms),Nightly Recharge Status, Continuity, Continuity Class, Sleep Date, Deep Sleep, Device Id, 
// Light Sleep, REM Sleep, Sleep End Time, Sleep Score, Sleep Start Time, Total Interruption Duration, 
// Unrecognized Sleep Stage, Total Sleep (hr)
//
// Total Sleep (hr) is a calculated field made by adding rem/deep/light sleep values together
function append_polar_row() {

  var recharge_data = get_nightly_recharge()
  var sleep_data = get_sleep()
  var row_data = recharge_data[0].concat(sleep_data[0])

  var sheet = SpreadsheetApp.getActive().getSheetByName(DATA_SHEET);
  var rangeLastRow = sheet.getLastRow() + 1;
  sheet.appendRow(row_data);

}
