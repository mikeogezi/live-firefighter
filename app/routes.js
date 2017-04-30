'use strict'

let fs = require('fs')
let path = require('path')

let nodemailer = require('nodemailer')

let { Position, Rectangle, RandomFireGenerator } = require('./fires')
let { Data } = require('./data')

const success = {
    statusCode: 200,
    message: 'success'
}

const error = {
    statusCode: 500,
    message: 'error'
}

let handleHtml = (req, res) => {
    res.redirect(req.path.replace('.html', ''))
}

let getFires = (req, res) => {
    let topLeft = new Position(req.body.topLeftLat || 10.0, req.body.topLeftLon || 10.0)
    let topRight = new Position(req.body.topRightLat || 10.0, req.body.topRightLon || 8.0)
    let bottomLeft = new Position(req.body.bottomLeftLat || 8.0, req.body.bottomLeftLon || 10.0)
    let bottomRight = new Position(req.body.bottomRightLat || 8.0, req.body.bottomRightLon || 8.0)

    let rectangle = new Rectangle(topLeft, topRight, bottomLeft, bottomRight)

    let randomFireGenerator = new RandomFireGenerator(rectangle)

    let fireCount = req.body.fireCount || 10
    let fires = []

    for (let i = 0; i < fireCount; ++i) {
        fires.push(randomFireGenerator.generateFirePosition())
    }

    res.json(fires)
}

let data = new Data()

let getFireData = (req, res) => {
    return res.json(data.getData())
}

exports.handleHtml = handleHtml
exports.getFires = getFires
exports.getFireData = getFireData
