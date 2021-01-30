# polar_google_intervals
Integration from Polar fitness data to Google sheets to Intervals.icu

These scripts are designed to be used in Google App Script - mainly for Google sheets.
The idea being that you pull data from Polar, dump it in a sheet, and then be able to put relevant data fields into Wellness fields in [Intervals.icu](https://intervals.icu)  
Once you have data in Google Sheets you can also build dashboard visualisations with [Google Data Studio](https://datastudio.google.com)  

Important caveat - you require a Polar accesslink account (free) and a token.  
This is a somewhat convoluted process but I think best option is to run the Polar demo application in Python and then just grab the token from the yml file that stores it.  
Once you have it, just update the constants.gs file and it should work. According to the docs it won't expire either.  

Polar documentation to get started:  
https://www.polar.com/accesslink-api/#polar-accesslink-api  

Polar demo repo  
https://github.com/polarofficial  

My forked Polar demo repo which includes recharge and sleep data and will push to a Google sheet  
https://github.com/Dan-01/polar_to_googlesheets  

This package includes an integration with Intervals.icu to push wellness data into that platform


