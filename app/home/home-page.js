/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
var frameModule = require("tns-core-modules/ui/frame");
var HomeViewModel = require("./home-view-model");
var calendarModule = require("nativescript-telerik-ui-pro/calendar");
var Observable = require("data/observable").Observable;

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = HomeViewModel();
    page.bindingContext.doRequestPermission();
    page.bindingContext.doListEvents();
}

exports.pageLoaded = pageLoaded;

exports.onDateSelected = function(args) {
  var page = args.object;
  var startDate = args.date;
  var endDate = new Date(startDate);
  endDate.setDate(startDate.getDate()+1);
  var events = page.bindingContext.doFindEventByDate(startDate, endDate);

}

exports.onDateDeselected = function(args) {
  // console.log("onDateDeselected: " + args.date);
}

exports.onNavigatedToDate = function(args) {
  console.log("onNavigatedToDate: " + args.date);
}

exports.onNavigatingToDateStarted = function(args) {
  console.log("onNavigatingToDateStarted: " + args.date);
}

exports.onViewModeChanged = function(args) {
  console.log("onViewModeChanged: " + args.newValue);
}
