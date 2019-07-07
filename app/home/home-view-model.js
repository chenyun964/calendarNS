var observableModule = require("tns-core-modules/data/observable");
var Calendar = require("nativescript-calendar");
var dialogs = require("tns-core-modules/ui/dialogs");
var calendarModule = require("nativescript-telerik-ui-pro/calendar");
var Observable = require("data/observable").Observable;

function HomeViewModel() {
    let events = [];
    let now = new Date();
    let startDate;
    let endDate;
    var viewModel = observableModule.fromObject({

        //Ask user for calendar Permission
        doCheckHasPermission: function() {
            Calendar.hasPermission().then(
                function(granted) {
                    dialogs.alert({
                        title: "Permission granted?",
                        message: granted ? "YES" : "NO",
                        okButtonText: "OK"
                    });
                }
            );
        },

        //Check if calendar permission is granted
        doRequestPermission: function() {
            let vm = this;
            let selectedDate = new Date();
            Calendar.requestPermission().then(
                function() {
                  vm.set('selectedDate', selectedDate);
                    console.log("Permission requested");
                }
            );
        },

        //Do create event
        __createEvent: function(options) {
            Calendar.createEvent(options).then(
                function(createdId) {
                    dialogs.alert({
                        title: "Event created with ID",
                        message: JSON.stringify(createdId),
                        okButtonText: "OK, nice!"
                    });
                },
                function(error) {
                    console.log("doCreateEvent error: " + error);
                }
            );
        },

        //Example of create a full day event
        doCreateAllDayEvent: function() {
            var d = new Date();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);

            this.__createEvent({
                //event properties
                title: 'Go back to the shop - forgot milk',
                location: 'The shop',
                notes: 'This event spans all day',
                url: 'http://my.shoppinglist.com',
                reminders: null,
                // this will make this event an 'all day event' for tomorrow
                startDate: new Date(d.getTime() + (24 * 60 * 60 * 1000)),
                endDate: new Date(d.getTime() + (2 * 24 * 60 * 60 * 1000))
            });
            this.doFindAllEvents({});
        },

        //Example of creating repeating events
        doCreateRepeatingEvent: function() {
            this.__createEvent({
                title: 'Get groceries every other day',
                location: 'The shop',
                notes: 'This is a repeating event',
                url: 'http://my.shoppinglist.com',
                // repeat every other day for 10 days
                recurrence: {
                    frequency: Calendar.RecurrenceFrequency.DAILY,
                    interval: 2,
                    endDate: new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 days
                },
                startDate: new Date(new Date().getTime() + (1 * 60 * 60 * 1000)),
                endDate: new Date(new Date().getTime() + (2 * 60 * 60 * 1000))
            });
        },

        //Create events in the calendar
        doCreateEventInCustomCalendar: function() {
            this.__createEvent({
                title: 'Get groceries',
                location: 'The shop',
                notes: 'This event is in a custom calendar',
                url: 'http://my.shoppinglist.com',
                calendar: {
                    // if it doesn't exist we create it
                    name: "NativeScript Cal"
                },
                // spans 2 hours, starting in 3 hours
                startDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
                endDate: new Date(new Date().getTime() + (5 * 60 * 60 * 1000))
            });
            this.doListEvents({});
        },

        //Finding event by event title
        doFindEventByTitle: function() {
            Calendar.findEvents({
                // any event containing this string will be returned
                title: 'groceries',
                // dates are mandatory, the event must be within this interval
                startDate: new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)),
                endDate: new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000))
            }).then(
                function(events) {
                    // dialogs.alert({
                    //     title: events.length + " events match the title 'groceries'",
                    //     message: JSON.stringify(events),
                    //     okButtonText: "OK, thanks"
                    // });
                    return JSON.stringify(events);
                },
                function(error) {
                    console.log("doFindEventByTitle error: " + error);
                }
            );
        },

        //Finding event by event date
        doFindEventByDate: function(startDate, endDate) {
            let vm = this;
            Calendar.findEvents({
                // dates are mandatory, the event must be within this interval
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }).then(
                function(events) {
                    if (events.length != 0) {
                        var day = startDate.getDate();
                        var eventTitle = events[0]['title'];
                        var eventLocation = events[0]['location'];
                        var eventNotes = events[0]['notes'];
                        var eventStart = new Date(events[0]['startDate']).getHours();
                        if (eventStart < 12) {
                            eventStart += 'am';
                        } else if (eventStart > 12) {
                            eventStart += "pm";
                        }

                        var eventEnd = new Date(events[0]['endDate']).getHours();
                        if (eventEnd < 12) {
                            eventEnd += 'am';
                        } else if (eventEnd > 12) {
                            eventEnd += "pm";
                        }
                        var eventTime = eventStart + " - " + eventEnd;

                        if (eventTitle.length > 11) {
                            eventTitle = eventTitle.substr(0, 9) + '...';
                        }

                        if (eventNotes.length > 16) {
                            eventNotes = eventNotes.substr(0, 18) + '...';
                        }
                        vm.set('startDate', day);
                        vm.set('eventTitle', eventTitle);
                        vm.set('eventLocation', eventLocation);
                        vm.set('eventNotes', eventNotes);
                        vm.set('eventTime', eventTime);
                        // dialogs.alert({
                        //     title: events.length + " events match the date",
                        //     message: JSON.stringify(events),
                        //     okButtonText: "OK, thanks"
                        // });
                        return JSON.stringify(events);
                    } else {
                        var day = startDate.getDate();
                        vm.set('startDate', day);
                        vm.set('eventTitle', "No Event Found");
                        vm.set('eventLocation', "");
                        vm.set('eventNotes', "");
                        vm.set('eventTime', "");
                    }
                },
                function(error) {
                    console.log("doFindEventByTitle error: " + error);
                }
            );
        },


        //List all the events and display on the calendar
        doListEvents: function() {
            let vm = this;
            Calendar.findEvents({
                // dates are mandatory, the event must be within this interval
                startDate: new Date(new Date().getTime() - (50 * 24 * 60 * 60 * 1000)),
                endDate: new Date(new Date().getTime() + (50 * 24 * 60 * 60 * 1000))
            }).then(
                function(events) {
                    var allEvents = [];
                    for (var i = 0; i < events.length; i++) {
                        var event = new calendarModule.CalendarEvent(events[i]['title'], events[i]['startDate'], events[i]['endDate']);
                        allEvents.push(event);
                    }
                    vm.set('calEvents', allEvents);
                },
                function(error) {
                    dialogs.alert({
                        title: "Error in findEvents",
                        message: JSON.stringify(error),
                        okButtonText: "OK, thanks"
                    });
                }
            );
        },

        //Delete all the events within the selected dates
        doDeleteEvents: function() {
            let vm = this;
            Calendar.deleteEvents({
                // id: 'EF33E6DE-D36E-473B-A50B-FEFAEF700031',
                // title: 'Go back to the shop',
                startDate: new Date(new Date().getTime() - (100 * 24 * 60 * 60 * 1000)),
                endDate: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))
            }).then(
                function(deletedEventIds) {
                    dialogs.alert({
                        title: "Deleted " + deletedEventIds.length + " 'groceries' event(s)",
                        message: "ID's of deleted event(s)\n\n" + JSON.stringify(deletedEventIds),
                        okButtonText: "Awesome"
                    });

                    Calendar.findEvents({
                        // dates are mandatory, the event must be within this interval
                        startDate: new Date(new Date().getTime() - (50 * 24 * 60 * 60 * 1000)),
                        endDate: new Date(new Date().getTime() + (50 * 24 * 60 * 60 * 1000))
                    }).then(
                        function(events) {
                            // dialogs.alert({
                            //     title: events.length > 1 ? "Showing last event of " + events.length + " in total" : "findEvents result",
                            //     message: JSON.stringify(events.length > 1 ? events[events.length - 1] : events),
                            //     okButtonText: "OK, thanks"
                            // });
                            var allEvents = [];
                            for (var i = 0; i < events.length; i++) {
                                var event = new calendarModule.CalendarEvent(events[i]['title'], events[i]['startDate'], events[i]['endDate']);
                                allEvents.push(event);
                            }
                            vm.set('calEvents', allEvents);
                        },
                        function(error) {
                            dialogs.alert({
                                title: "Error in findEvents",
                                message: JSON.stringify(error),
                                okButtonText: "OK, thanks"
                            });
                        }
                    );
                },
                function(error) {
                    console.log("doFindEvents error: " + error);
                }
            );
        },


    });

    // Function not in use.
    //doFindAllEvents: function() {
    //      let vm = this;
    //     Calendar.findEvents({
    //         // dates are mandatory, the event must be within this interval
    //         startDate: new Date(new Date().getTime() - (50 * 24 * 60 * 60 * 1000)),
    //         endDate: new Date(new Date().getTime() + (50 * 24 * 60 * 60 * 1000))
    //     }).then(
    //         function(events) {
    //             dialogs.alert({
    //                 title: events.length > 1 ? "Showing last event of " + events.length + " in total" : "findEvents result",
    //                 message: JSON.stringify(events.length > 1 ? events[events.length - 1] : events),
    //                 okButtonText: "OK, thanks"
    //             });
    //             var allEvents = [];
    //             for (var i = 0; i < events.length; i++) {
    //                 var event = new calendarModule.CalendarEvent(events[i]['title'], events[i]['startDate'], events[i]['endDate']);
    //                 allEvents.push(event);
    //             }
    //             vm.set('calEvents', allEvents);
    //         },
    //         function(error) {
    //             dialogs.alert({
    //                 title: "Error in findEvents",
    //                 message: JSON.stringify(error),
    //                 okButtonText: "OK, thanks"
    //             });
    //         }
    //     );
    // },
    // doCreateEventWithReminders: function() {
    //     this.__createEvent({
    //         // spans an hour
    //         title: 'Get groceries',
    //         location: 'The shop',
    //         notes: 'This event has reminders',
    //         url: 'http://my.shoppinglist.com',
    //         reminders: {
    //             first: 30,
    //             second: 10
    //         },
    //     });
    // },
    //
    // doListCalendars: function() {
    //     Calendar.listCalendars().then(
    //         function(calendars) {
    //             dialogs.alert({
    //                 title: "Found " + calendars.length + " calendars",
    //                 message: JSON.stringify(calendars),
    //                 // message:calendars
    //                 okButtonText: "OK, sweet"
    //             });
    //             console.log(calendars);
    //         },
    //         function(error) {
    //             console.log("doListCalendars error: " + error);
    //         }
    //     );
    // },


    /* Add your view model properties here */
    return viewModel;
}

module.exports = HomeViewModel;
