let assert = require('assert')

class Position {
    constructor (lat, lon) {
        if (!lat || !lon) {
            throw new Exception('Latitude or longitude was not provided')
        }

        this.lat = lat
        this.lon = lon

        this.latInc = 0.08
        this.lonInc = 0.08
    }

    // Escape route
    setInfo () {
        let info = {}

        let rand = Math.random()
        let latInc = this.latInc * Math.random()
        let lonInc = this.lonInc * Math.random()

        switch (true) {
            case rand <= 0.25:
                info.escapeRoute = new Position(this.lat + latInc, this.lon + lonInc)
                break
            case rand <= 0.5:
                info.escapeRoute = new Position(this.lat + latInc, this.lon - lonInc)
                break
            case rand <= 0.75:
                info.escapeRoute = new Position(this.lat - latInc, this.lon + lonInc)
                break
            default:
                info.escapeRoute = new Position(this.lat - latInc, this.lon - lonInc)
        }

        this.info = info
    }

    getInfo () {
        if (!this.info) {
            this.setInfo()
        }

        return this.info
    }
}

class Rectangle {
    constructor (topLeftPosition, topRightPosition, bottomLeftPosition, bottomRightPosition) {
        for (let argument of arguments) {
            if (!argument) {
                throw new Exception('Arguments for topLeftPosition, topRightPosition, bottomLeftPosition, bottomRightPosition should be provided')
            }

            assert(argument instanceof Position)
        }

        this.topLeft = topLeftPosition
        this.topRight = topRightPosition
        this.bottomLeft = bottomLeftPosition
        this.bottomRight = bottomRightPosition
    }
}

class RandomFireGenerator {
    constructor (rectangle) {
        assert(rectangle instanceof Rectangle)

        this.rectangle = rectangle
    }

    generateFirePosition () {
        let latA = this.rectangle.topLeft.lat, lonA = this.rectangle.topLeft.lon
        let latB = this.rectangle.bottomRight.lat, lonB = this.rectangle.bottomRight.lon

        let latInc = Math.random() * Math.abs(latA - latB)
        let lonInc = Math.random() * Math.abs(lonA - lonB)

        let position = new Position(latA - latInc, lonA - lonInc)

        position.setInfo()

        delete position.latInc
        delete position.lonInc
        delete position.info.escapeRoute.latInc
        delete position.info.escapeRoute.lonInc

        return position
    }
}

exports.RandomFireGenerator = RandomFireGenerator
exports.Position = Position
exports.Rectangle = Rectangle
