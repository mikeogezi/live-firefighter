let assert = require('assert')
let fs = require('fs')
let util = require('util')

let jsonObj = require('../data/factors.json')

let windDirection = jsonObj['wind_direction']
let windIntensity = jsonObj['wind_intensity']
let rainfall = jsonObj['rainfall']
let humidity = jsonObj['humidity']
let vegetationAvailability = jsonObj['vegetation_availability']
let vegetationDirection = jsonObj['vegetation_direction']
let waterBodyAvailability = jsonObj['water_body_availability']
let waterBodyDirection = jsonObj['water_body_direction']
let temperature = jsonObj['temperature']
let escapeRouteDirection = jsonObj['escape_route_direction']

function getRandomElement (arr) {
    assert(arr instanceof Array)

    return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomWithin (arr, mem, range) {
    let rand = Math.random()
    let index = arr.indexOf(mem)
    let num

    if (range == 0) {
        return mem
    }

    switch (true) {
        case rand < 0.5:
            num = Math.floor(Math.random() * range)
            break
        default:
            num = -1 * Math.floor(Math.random() * range)
    }

    var sum = index + num
    if (sum < arr.length && sum >= 0) {
        index = sum
    }

    return arr[index]
}

class Data {
    constructor () {
        this.lastWindDirection = null
        this.lastWindIntensity = null
        this.lastRainfall = null
        this.lastHumidity = null
        this.lastVegetationAvailability = null
        this.lastVegetationDirection = null
        this.lastWaterBodyAvailability = null
        this.lastWaterBodyDirection = null
        this.lastTemperature = null
        this.lastEscapeRouteDirection = null

        this.rangeWindDirection = 0
        this.rangeWindIntensity = 1
        this.rangeRainfall = 0
        this.rangeHumidity = 3
        this.rangeVegetationAvailability = 0
        this.rangeVegetationDirection = 0
        this.rangeWaterBodyAvailability = 0
        this.rangeWaterBodyDirection = 0
        this.rangeTemperature = 3
        this.rangeEscapeRouteDirection = 0

        this.temperatureValuesRange = [21.8, 23.8]
        this.humidityValuesRange = [52, 54]
    }

    getTemperatureNumber (strVal) {
        let beg = this.temperatureValuesRange[0]
        let end = this.temperatureValuesRange[1]
        let diff = beg - end
        let spaces = diff / temperature.length
        let index = temperature.indexOf(strVal)
        return (beg + (spaces * index * Math.random())).toFixed(2) + ' °C'
    }

    getHumidityNumber (strVal) {
        let beg = this.humidityValuesRange[0]
        let end = this.humidityValuesRange[1]
        let diff = beg - end
        let spaces = diff / humidity.length
        let index = humidity.indexOf(strVal)
        return (beg + (spaces * index * Math.random())).toFixed(2) + ' %'
    }

    // return this.[^\=]*

    getWindDirection () {
        this.lastWindDirection = this.lastWindDirection || getRandomElement(windDirection)
        return getRandomWithin(windDirection, this.lastWindDirection, this.rangeWindDirection)
    }

    getWindIntensity () {
        this.lastWindIntensity = this.lastWindIntensity || getRandomElement(windIntensity)
        return getRandomWithin(windIntensity, this.lastWindIntensity, this.rangeWindIntensity)
    }

    getRainfall () {
        this.lastRainfall = this.lastRainfall || getRandomElement(rainfall)
        return getRandomWithin(rainfall, this.lastRainfall, this.rangeRainfall)
    }

    getHumidity () {
        this.lastHumidity = this.lastHumidity || getRandomElement(humidity)
        return getRandomWithin(humidity, this.lastHumidity, this.rangeHumidity)
    }

    getVegetationAvailability () {
        this.lastVegetationAvailability = this.lastVegetationAvailability || getRandomElement(vegetationAvailability)
        return getRandomWithin(vegetationAvailability, this.lastVegetationAvailability, this.rangeVegetationAvailability)
    }

    getVegetationDirection () {
        if (this.lastVegetationAvailability == 'unavailable') { return null }
        this.lastVegetationDirection = this.lastVegetationDirection || getRandomElement(vegetationDirection)
        return getRandomWithin(vegetationDirection, this.lastVegetationDirection, this.rangeVegetationDirection)
    }

    getWaterBodyAvailability () {
        this.lastWaterBodyAvailability = this.lastWaterBodyAvailability || getRandomElement(waterBodyAvailability)
        return getRandomWithin(waterBodyAvailability, this.lastWaterBodyAvailability, this.rangeWaterBodyAvailability)
    }

    getWaterBodyDirection () {
        if (this.lastWaterBodyAvailability == 'unavailable') { return null }
        this.lastWaterBodyDirection = this.lastWaterBodyDirection || getRandomElement(waterBodyDirection)
        return getRandomWithin(waterBodyDirection, this.lastWaterBodyDirection, this.lastWaterBodyDirection)
    }

    getTemperature () {
        this.lastTemperature = this.lastTemperature || getRandomElement(temperature)
        return getRandomWithin(temperature, this.lastTemperature, this.rangeTemperature)
    }

    getEscapeRouteDirection () {
        this.lastEscapeRouteDirection = this.lastEscapeRouteDirection || getRandomElement(escapeRouteDirection)
        return getRandomWithin(escapeRouteDirection, this.lastEscapeRouteDirection, this.rangeEscapeRouteDirection)
    }

    getData () {
        return {
            windDirection: this.getWindDirection(),
            windIntensity: this.getWindIntensity(),
            rainfall: this.getRainfall(),
            humidity: this.getHumidityNumber(this.getHumidity()),
            vegetationAvailability: this.getVegetationAvailability(),
            vegetationDirection: this.getVegetationDirection(),
            waterBodyAvailability: this.getWaterBodyAvailability(),
            waterBodyDirection: this.getWaterBodyDirection(),
            temperature: this.getTemperatureNumber(this.getTemperature()),
            escapeRouteDirection: this.getEscapeRouteDirection()
        }
    }
}

exports.Data = Data
