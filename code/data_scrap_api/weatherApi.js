import { createObjectCsvStringifier } from 'csv-writer';
import * as fs from 'fs';


export default async function weatherApi(stationID, csvName) {
    // initialize write stream
    let stream = fs.createWriteStream(csvName);
    // csv-writer package to covert objects to csv format
    const csvStringifier  = createObjectCsvStringifier ({
        header: [
            {id: 'date', title: 'Date'},
            {id: 'average_temperature', title: 'Average Temperature'},
            {id: 'total_precipitation', title: 'Total Precipitation'},
            {id: 'humidity_rh', title: 'Humidity (rh)'},
            {id: 'pressure_in', title: 'Pressure (in)'},
            {id: 'wind_speed', title: 'Wind Speed (mph)'},
            {id: 'max_temp', title: 'Max Temp'}
        ]
    });
    stream.write(csvStringifier.getHeaderString());  // write csv header

    // date string in yyyymmdd format
    let date = 19450101;

   
    // send api request for dates from 19450101 to 20230203
    for (date; date < 20230223; date = incrementDate(date)) {
        let response = await fetch(`https://api.weather.com/v1/location/${stationID}/observations/historical.json?apiKey=e1f10a1e78da46f5b10a1e78da96f525&units=e&startDate=${date}&endDate=${date}`);
        let data = await response.json();  // api data gives hourly temperature measurements
        if (data.observations != undefined) {
            let i = 0;  // counts the number of hours or number of observations
            let sumTemp = 0;
            let sumHumid = 0;
            let precip = 0;
            let pressure = 0;
            let windSpd = 0;
            let maxTemp = 0;


            // sum temperature measurements of the day and calculate the average
            while (i < data.observations.length) {
                sumTemp += data.observations[i].temp;
                sumHumid += data.observations[i].rh;
                windSpd += data.observations[i].wspd;
                pressure += data.observations[i].pressure;
                
                if (data.observations[i].temp > maxTemp) {
                    maxTemp = data.observations[i].temp;
                }

                if (data.observations[i].precip_hrly != null) {
                    precip += data.observations[i].precip_hrly;
                }
                
                i++;
            }
    
            let dayWeatherData = [
                {
                'date': date.toString(),
                'average_temperature': sumTemp/i,
                'total_precipitation': precip,
                'humidity_rh': sumHumid/i,
                'pressure_in': pressure/i,
                'wind_speed': windSpd/i,
                'max_temp': maxTemp
                }
            ];
            stream.write(csvStringifier.stringifyRecords(dayWeatherData));
        }
    }

    stream.end();
}

function incrementDate(date) {
    let month = Math.floor((date % 10000) / 100);
    let day = date % 100;
    
    if (day < 31) {
        date++;
    } else {
        date -= 30;

        if (month < 12) {
            date += 100;  // add a month
        } else {
            date -= 1100;  // remove a month
            date += 10000; // add a year
        }
    }
    return date;
}