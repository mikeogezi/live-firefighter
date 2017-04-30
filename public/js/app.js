var apiKey = 'AIzaSyD7xFbJB99jG3BMQIFJy1mN4kcuxMMlcyU'

var urlBase = 'http://localhost:3000/'

$(document).ready(function docReadyFunction () {
    function setup () {
        $('.modal').modal()
    }

    setup()
});


var Vom = {
    location: {
        lat: 9.73,
        lng: 8.80
    }
};

var iconBase = urlBase + 'images/';

var icons = {
    fire: {
        icon: iconBase + 'fire_1.png'
    },
    water: {
        icon: iconBase + 'water_1.png'
    },
    safety: {
        icon: iconBase + 'safety.png'
    },
    hospital: {
        icon: iconBase + 'hospital.png'
    },
    firetruck: {
        icon: iconBase + 'firetruck.png'
    },
    firetruck_hq: {
        icon: iconBase + 'firetruck_hq.png'
    }
};

var defaultReqObj = {
    topLeftLat: 9.93,
    topLeftLon: 9.00,

    topRightLat: 9.93,
    topRightLon: 8.60,

    bottomLeftLat: 9.53,
    bottomLeftLon: 9.00,

    bottomRightLat: 9.53,
    bottomRightLon: 8.60,

    fireCount: 1,
}

var defaultDirectionsObj = {
    origin: Vom.location,
    travelMode: 'WALKING'
}

var fireTruckHq = {
    lat: Vom.location.lat,
    lng: Vom.location.lng
}

var fireTruck = {
    lat: Vom.location.lat + 0.01,
    lng: Vom.location.lng + 0.01
}

var hospital = {
    lat: Vom.location.lat - 0.01,
    lng: Vom.location.lng - 0.01
}

var map;

var fires = []
var fireMarkers = []
var fireMarkersIntervals = []
var escapeRoutes = []
var escapeMarkers = []

var directionsDisplay;
var directionsService;
var escapeRequest = {
    travelMode: 'WALKING'
}

function initMap () {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: Vom.location,
        mapTypeId: 'hybrid'  // roadmap, satellite, hybrid, terrain
    });

    directionsDisplay.setMap(map)

    function makeFireRequest (callback) {
        $.post(urlBase + 'getFires', defaultReqObj, function (data, textStatus, jqXHR) {
            if (textStatus != 'success') {
                return
            }

            if (google && google.maps) {
                fires = []
                fireMarkers = []
                fireMarkersIntervals = []

                for (var position of data) {
                    if (position && position.lat && position.lon) {
                        position.lng = position.lon = position.lon || position.lng

                        var escapeRoute = position.info.escapeRoute
                        escapeRoute.lng = escapeRoute.lon = escapeRoute.lon || escapeRoute.lng

                        var fireMarker = new google.maps.Marker({
                            position: position,
                            icon: icons['fire'].icon,
                            map: map
                        })

                        var escapeMarker = new google.maps.Marker({
                            position: escapeRoute,
                            icon: icons['safety'].icon,
                            map: map
                        })

                        var hospitalMarker = new google.maps.Marker({
                            position: hospital,
                            icon: icons['hospital'].icon,
                            map: map
                        })

                        var fireTruckMarker = new google.maps.Marker({
                            position: fireTruck,
                            icon: icons['firetruck'].icon,
                            map: map
                        })

                        var fireTruckHqMarker = new google.maps.Marker({
                            position: fireTruckHq,
                            icon: icons['firetruck_hq'].icon,
                            map: map
                        })

                        fires.push(position)

                        fireMarkers.push(fireMarker)

                        escapeRoutes.push(escapeRoute)

                        escapeMarkers.push(escapeMarker)

                        defaultDirectionsObj.waypoints = [{
                            location: position,
                            stopover: true
                        }]
                        defaultDirectionsObj.destination = escapeRoute

                        escapeRequest.origin = position
                        escapeRequest.destination = escapeRoute

                        var infoWindow = new google.maps.InfoWindow()

                        google.maps.event.addListener(fireMarker, 'click', function onClickMarker () {
                            infoWindow.setContent(
                                '<div><strong>Fire location</strong><br>' +
                                '<div><strong>Name: </div></strong><br>' +
                                '<div><strong>Time: </div></strong><br>' +
                                '<div><strong>Intensity: </div></strong><br>'
                            );

                            infoWindow.open(map, this);
                        });
                    }
                }

                callback()
            }
        }, 'json')
    }

    makeFireRequest(function () {
        for (var fireMarker of fireMarkers) {
            var fireMarkersInterval = setInterval(function () {
                fireMarker.setAnimation(google.maps.Animation.BOUNCE)
            }, 3000)

            fireMarkersIntervals.push(fireMarkersInterval)
        }
    })

    // setDirections(escapeRequest, 'escape')

    setDirections(defaultDirectionsObj, 'fire')

    startMakingDataRequests()
}

function setDirections (fromTo, extra) {
    directionsService.route(fromTo, function(result, status) {
        if (status == 'OK') {
            if (extra == 'escape') {
                directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: '#008000'
                    }
                })
                directionsDisplay.setMap(map)
            }
            else if (extra == 'fire') {
                directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: '#0000ff'
                    }
                })
                directionsDisplay.setMap(map)
            }
            else {

            }

            directionsDisplay.setDirections(result);
        }
    });
}

function startMakingDataRequests () {
    setInterval(function makeRequest () {
        $.post(urlBase + 'getFireData', {}, function (data, textStatus, jqXHR) {
            if (textStatus != 'success') {
                return
            }

            setWindDirection(data['windDirection'])
            setWindIntensity(data['windIntensity'])
            setRainfall(data['rainfall'] == 'available' ? 'Yes' : 'None')
            setHumidity(data['humidity'])
            // setVegetation(data['vegetationAvailability'] == 'available' ? data['vegetationAvailability'] + ' in the direction of ' + data['vegetationDirection'] : data['vegetationAvailability'])
            setVegetation(data['vegetationAvailability'] == 'available' ? data['vegetationDirection'] : 'None')
            // setWaterBody(data['waterBodyAvailability'] == 'available' ? data['waterBodyAvailability'] + ' in the direction of ' + data['waterBodyDirection'] : data['waterBodyAvailability'])
            setWaterBody(data['waterBodyAvailability'] == 'available' ? data['waterBodyDirection'] : 'None')
            setTemperature(data['temperature'])
        }, 'json')
    }, 5000);
}

function setWindDirection (val) {
    $('#wind-direction').html(val)
}

function setWindIntensity (val) {
    $('#wind-intensity').html(val)
}

function setRainfall (val) {
    $('#rainfall').html(val)
}

function setHumidity (val) {
    $('#humidity').html(val)
}

function setVegetation (val) {
    $('#vegetation').html(val)
}

function setWaterBody (val) {
    $('#water-body').html(val)
}

function setTemperature (val) {
    $('#temperature').html(val)
}

function setEscapeRouteDirection (val) {

}
