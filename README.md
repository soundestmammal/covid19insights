# COVID-19 Insights

This app is for people to get a basic assessment and risk levels of COVID-19 for each US State. This application aggregates data from several sources and renders the transformed data in a Dashboard.

***
## Table of contents
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Start and Watch](#start-and-watch)
- [Languages and tools](#languages-and-tools)
- [Data](#data)

## Getting Started
For development, you will only need [Docker](http://docker.com) installed on your environment.

## Installation

```
    $ git clone https://github.com/soundestmammal/covid19insights.git
    $ cd covid19insights
```

## Start and Watch

Due to environment variables, you will not be able to run the app with full features.

However, with the environment variables provided you should be able to run.

```
  $ docker-compose up
```

## Languages and Tools

c19insights uses a number of technologies to run properly:

* React
* Chart.js
* D3
* Express
* Node.js
* Airflow
* Python
* Pandas
* Nginx
* Docker
* AWS

## Data

C19insights uses data from a variety of sources to show trends:

* [The New York Times](https://developer.nytimes.com/) - To display Daily Cases & Daily Deaths.
* [rt.live](https://rt.live/) - Latest estimates of Rt.
* [COVID Tracking Project](https://covidtracking.com/data) - To calculate the positivity rate.
* [Test and Trace](https://testandtrace.com/) - To measure the capabilities of contact tracing.
