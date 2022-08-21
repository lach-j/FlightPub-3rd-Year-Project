# Setting up the FlightPub Local Environment

## User Interface

### Prerequisites

To setup the user interface first ensure that a recent version of [node.js](https://nodejs.org/en/) is installed and you have the [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) package manager installed.

### Installation and Setup

1.  Navigate to the `flightpub-ui` directory and open a terminal window.
2.  Type `yarn install` and press enter to install all the needed dependencies for the project.
3.  Type `yarn start` to start the development environment.

## API/Database

### Prerequisites

To setup the API and database first ensure that a the following software is installed:

- [MySQL](https://dev.mysql.com/downloads/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download)

### Setting up the Database

1.  Open up the MySQL workbench or database management console of choice.
2.  Open all 3 scripts in the `resources/db_setup_scripts` directory.
3.  Run the scripts in the order of `FP-Schema.sql`, `FP-Data.sql` and then `FP-UpdateDates.sql`.

### Setting up the API

1.  Open the `flightpub-api` directory in IntelliJ IDEA.
2.  Update the configuration to match your setup, this can be done by either:
    - Open the "Edit Configurations" window, and set the `MYSQL_USERNAME` and `MYSQL_PASSWORD` environment variables to match your MySQL instance setup.
      OR
    - Navigate to the `src/main/resources/application.properties` file and update the values that are currently `admin` and `password`.
3.  Open the maven panel and ensure all maven dependencies are installed.
4.  Click on the "Run" button next to the FlightpubApplication configuration dropdown.

> **NOTE:** Ensure that only the `flightpub-api` folder is opened in the IntelliJ workspace as this may cause issues when loading configurations.

### Configuration

To enable email sending either navigate to the `src/main/resources/application.properties` file and set the `ENABLE_EMAIL` value to true. Or set the `ENABLE_EMAIL` environment variable to true in the "Edit Configurations" window.

## Default Logins

There are 2 default logins containing privileged roles as described below.
|Email|Password|Role|
|-|-|-|
|admin@admin.com|#Access123|Administrator|
|agent@agent.com|#Access123|Travel Agent|

To add more users with privileged roles, register the user with the regular register user form - this will create a user with standard registered user privileges. While logged into the Administrator account, navigate to the "Administrator Portal" -> "Manage Users" and find the user by entering their email. This will allow you to change their role and update the role to either a Travel Agent or Administrator.

> **NOTE:** Changing a users role requires the user to fully log out and back in before these changes take effect. The user may be able to access certain restricted areas, however these requests will fail as the token needs to be regenerated.
