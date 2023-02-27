import weatherApi from './weatherApi.js';
// import {performance} from 'perf_hooks';

// let startTime = performance.now()

let stations = [['KDCA:9:US', './data/washington_weather.csv'], ['RJOO:9:JP', "./data/kyoto_weather.csv"], ['LFSB:9:FR', './data/liestal-weideli_weather.csv'], ['CYVR:9:CA', './data/vancouver_weather.csv']];

for(const station of stations) {
    weatherApi(station[0], station[1]);
}

// let endTime = performance.now()


// console.log(`Call to weatherApi taook ${endTime - startTime} milliseconds`)