# 5_Day-Weather_Forecast Application


## Description

This project provides an application that displays weather data - including temperature, humidity and windspeed - for a chosen city on the current day and consecutive five days. 

The application provides further functionality in saving the history of previously-searched cities in easily-accessible history buttons, which can be cleared at user request, and an autocomplete function for cities different cities with the same name. 


The application can be accessed here: https://yusen22.github.io/Planner_Application/

A screenshot of the application can be viewed here: ![Screenshot-of-weather-application](./assets/5_day_planner_app_screenshot.png"Screenshot of application")



## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)


## Installation

N/A 


## Usage

Upon opening the application, the current date will be shown in the header. To view the current hour and date, open the development tools in the browser and access the console. 


To make an entry in a 'timeblock', click in the coloured area next to the desired time and type a task for that hour. To save this text to local storage, click the blue 'Save' button that corresponds to the chosen 'timeblock' to the right of the page. An alert message will notify that the entered task has been saved, and the tasks in the chosen 'timeblock' will be recalled if the page is refreshed. 

If a 'timeblock' is saved with no content, an alert will occur and no action will be taken. 


Each 'timeblock's' colour is dynamically updated within the app according to whether it is in the past in the current workday, it is the current hour, or it is in the future. The colour key for this feature is: 
 
                - PAST = Grey
                - PRESENT = Red
                - FUTURE = Green 

You will be able to enter tasks in any 'timeblock' regardless of it's current colour. 


To clear all tasks permanently, locate the 'Clear All Tasks' button at the bottom of the application's page. Click the button, and then click 'OK' in the confirm alert message that appears on screen. All tasks will now be deleted, and new entries will need to be made for content to appear in the 'timeblocks'.

Click 'Cancel' when asked to confirm deletion of all entries to return to the application with no action taken 


## Credits

N/A 


## License

Please refer to the LICENSE in the repo. 

---