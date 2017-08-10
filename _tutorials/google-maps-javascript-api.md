---
layout: tutorial
title: Google Maps and Geolocation
date: 2017-08-09
description: Examples of using the Google Maps JavaScript API
keywords: javascript, google maps, geolocation, api
---

## Google Maps API (V3)

* [Getting started documentation](https://developers.google.com/maps/documentation/javascript/tutorial)
* You will need to create an API key


A list of common _google.maps_ constructor functions:


## google.maps.Map()

https://developers.google.com/maps/documentation/javascript/reference#Map

```js
let element = document.getElementById('map-canvas');
let map = new google.maps.Map(element, {
	center: { lat: -34.397, lng: 150.644 },
	zoom: 12
});
```

## google.maps.LatLng()

https://developers.google.com/maps/documentation/javascript/reference#LatLng

```js
let latlng = new google.maps.LatLng(-34.397, 150.644);
```

## google.maps.Marker()

https://developers.google.com/maps/documentation/javascript/reference#Marker

```js
let marker = new google.maps.Marker({
	map: map,
	position: new google.maps.LatLng(-34.397, 150.644),
	animation: google.maps.Animation.DROP,
});
```

## google.maps.InfoWindow(obj)

https://developers.google.com/maps/documentation/javascript/reference#InfoWindow

```js
let infowindow = new google.maps.InfoWindow({
	content: '<strong>Meow</strong>',
	position: new google.maps.LatLng(-34.397, 150.644)
});

infowindow.open(map);
```

## google.maps.Geocoder()

https://developers.google.com/maps/documentation/javascript/reference#Geocoder

### Geocoding

Taking an address and converting it into coordinates.

```js
let geocoder = new google.maps.Geocoder();

geocoder.geocode({
	address: '3650 McClintock Ave., Los Angeles, CA 90089'
}, function(results) {
	let latlng = results[0].geometry.location; // a LatLng object
	console.log(latlng.lat(), latlng.lng())
});
```

### Reverse Geocoding

Taking coordinates and converting it into an address.

```js
let geocoder = new google.maps.Geocoder();

geocoder.geocode({
	location: new google.maps.LatLng(-34.397, 150.644)
}, function(results) {
	console.log(results);
});
```

## Events

https://developers.google.com/maps/documentation/javascript/reference#MapsEventListener

```js
google.maps.event.addListener(SOME OBJECT, 'click', function(event) {
	// SOME OBJECT could be a marker, an info window, the map, etc...
});
```

## The Geolocation API

Several sources are used to determine the user's location. They are a combination of Wifi, IP geolocation, and/or GPS on your mobile device.

## Getting the user's current position

```js
if (navigator.geolocation) { // Feature detection
  let successHandler = function(position) {};
  let errorHandler = function(error) {};
  let options = {};
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
}
```

A position object is passed to the success callback function. Here is a list of useful properties it contains:

* coords.latitude			The latitude
* coords.longitude			The longitude
* coords.accuracy			The accuracy of position
* coords.altitude			The altitude in meters above the mean sea level
* coords.altitudeAccuracy	The altitude accuracy of position
* coords.heading			The heading as degrees clockwise from North
* coords.speed				The speed in meters per second
* timestamp					The date/time of the response

## Watching the user's position

```js
if (navigator.geolocation) { // Feature detection
  let successHandler = function(position) {};
  let errorHandler = function(error) {};
  let options = {};
	navigator.geolocation.watchPosition(successHandler, errorHandler, options);
}
```

The watchPosition() method also receives the same position object as getCurrentPosition(). The watchPosition() method also returns an identifier that can be used to clear the watch using the method clearWatch(). This is similar to how the JS function setInterval() returns an identifier that can be used to clear the the interval using clearInterval().

The _options_ object is optional in both methods. Here is a list of properties you can pass as options:

* __enableHighAccuracy__: provides a hint to the request that it wants the best possible result. The drawback is that it could be slower and use more power consumption which isn't always ideal on a mobile device
* __timeout__: the maximum length of time to wait for a response in milliseconds
* __maximumAge__: the maximum age of a __cached__ position that the page will be willing to accept. In milliseconds with a default value of 0, which means it wont pull a position object from cache.

## References

* [MDN navigator.geolocation _(reference)_](https://developer.mozilla.org/en-US/docs/Using_geolocation)
