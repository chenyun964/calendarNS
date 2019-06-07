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

    // var page = args.object;
    // var pageData = new Observable();
    // page.bindingContext = pageData;
    // var eventTitles = ["Lunch with Steve", "Meeting with Jane", "Q1 Recap Meeting"];
    // var events = [];
    //
    // var j = 1;
    // for (var i = 0; i < eventTitles.length; i++) {
    //     var now = new Date();
    //     var startDate = new Date(now.getFullYear(), now.getMonth(), j * 2, 12);
    //     console.log(startDate);
    //     var endDate = new Date(now.getFullYear(), now.getMonth(), (j * 2) + (j % 3), 13);
    //     console.log(endDate);
    //     var event = new calendarModule.CalendarEvent(eventTitles[i], startDate, endDate);
    //     events.push(event);
    //     j++;
    // }
    // pageData.set("calEvents", events);
}

exports.pageLoaded = pageLoaded;
