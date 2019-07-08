
function main(){
  var startRow = 2;
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var currSheet = spreadSheet.getSheets()[0];
  var cells = currSheet.getRange("A1:N1");
  var timeDifference = cells.getCell(1, 2).getValue();
  var mainCityDate = cells.getCell(1, 4).getValue();
  var startTime = cells.getCell(1, 6).getValue();
  var endTime = cells.getCell(1, 8).getValue();
  var mainCityName = cells.getCell(1, 10).getValue();
  var city2Name = cells.getCell(1, 12).getValue();
  var validDateArray = cells.getCell(1, 14).getValue().split(';');
  Generate100Units(mainCityName, city2Name, mainCityDate, startTime, endTime, 12, 2, timeDifference, validDateArray, currSheet)
}

function Generate100Units(mainCityName, city2Name, date, startTime, endTime, diffTime, rowIdx, timeDifference, validDateArray, sheet){
  var i = 0;
  for(i = 0; i < 100; i++){
    while(!isValidDay(date, validDateArray)){
      date.setDate(date.getDate() + 1);
    }
    GenerateRows(mainCityName, city2Name, date, startTime, endTime, diffTime, rowIdx, sheet);
    rowIdx += 3;
    date.setDate(date.getDate() + 1);
  }
}

function isValidDay(date, validDateArray){
  var daysArray = ['Sn', 'M', 'T', 'W', 'Th', 'F', 'S'];
  var day = GetDayNumberFromDate(date);
  return validDateArray.indexOf(daysArray[day]) != -1;
}

function GenerateRows(mainCityName, city2Name, date, startTime, endTime, diffTime, rowIdx, sheet){
  var diffStartTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime)
  diffStartTime.setHours(diffStartTime.getHours() + diffTime);
  
  var diffEndTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime)
  diffEndTime.setHours(diffEndTime.getHours() + diffTime);
  //MainCity
  SetCityValue(sheet, mainCityName, new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime), new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime), rowIdx);
  
  //city2
  SetCityValue(sheet, city2Name, diffStartTime, diffEndTime, rowIdx + 1);
  
  //put colot
  var timeSpan = GetHrsDifferenceFromTwoDate(diffStartTime, diffEndTime);
  SetBackgroundColor(sheet, timeSpan, rowIdx);
}

//TODO put the color
function SetBackgroundColor(sheet, timeSpan, rowIdx){
  var alphbatArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
  var i =0;
  currRow = sheet.getRange()
  for(i = 0; i <timeSpan; i++){
    timeColumn = alphbatArray[i] + rowIdx;
    sheet.getRange(timeColumn).setValue(GetCityTimeFormat(currDateTime));
    currDateTime.setHours(currDateTime.getHours() + 1);
  }
}

function SetCityValue(sheet, cityName, startDateTime, endDateTime, rowIdx){
  var cityRowIdx = 'A' + rowIdx;
  var hrSlot = GetHrsDifferenceFromTwoDate(endDateTime, startDateTime);
  var alphbatArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
  var timeColumn = '';
  var currDateTime = startDateTime;
  var i = 0;
  
  sheet.getRange(cityRowIdx).setValue(cityName);
  for(i = 1; i <= hrSlot; i++){
    timeColumn = alphbatArray[i] + rowIdx;
    sheet.getRange(timeColumn).setValue(GetCityTimeFormat(currDateTime));
    currDateTime.setHours(currDateTime.getHours() + 1);
  }
}

function GetCityTimeFormat(dateTime){
  var daysArray = ['Sn', 'M', 'T', 'W', 'Th', 'F', 'S'];
  var day = daysArray[GetDayNumberFromDate(dateTime)];
  return '(' + day + ')' + Utilities.formatDate(dateTime, "GMT-4", "MM/dd HH:mm");
}

/*
* 0:Sun, 1:Mon, ..... 6:Sat
*/
function GetDayNumberFromDate(date){
    return new Date(date).getDay();
}

/*
*  It will not over 1 day;
* futureDate: Date
* currDate: Date
* Date = month starts from 0 to 11;
* GetHrsDifferenceFromTwoDate(new Date(2019, 6,8, 1), new Date(2019, 6, 7, 23))
*/
function GetHrsDifferenceFromTwoDate(futureDate, currDate){
  var timeDiff = futureDate - currDate;
  var hrDiff = ((timeDiff / 1000) / 3600) % 24;
  return hrDiff;
}

