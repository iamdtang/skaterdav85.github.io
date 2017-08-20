---
layout: tutorial
title: Google Maps and Geolocation
date: 2017-08-09
description: Examples of using the Google Maps JavaScript API
keywords: javascript, google maps, geolocation, api
---

The Google Maps JavaScript library exposes several constructor functions that allow you to create a map and different things on a map. If you're not familiar with constructor functions, read my other post, [JavaScript Constructor Functions and Classes](/tutorials/javascript-constructor-functions-and-classes).

To get started, you will need to [create an API key](https://developers.google.com/maps/documentation/javascript/get-api-key). Then, create an HTML page with the following template, which you can also find on the [getting started documentation](https://developers.google.com/maps/documentation/javascript/tutorial).

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Map</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8
        });
      }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
    async defer></script>
  </body>
</html>
```

Replace `YOUR_API_KEY` with your API key.

The first thing you'll notice is that a map is created using the [`Map` constructor function](https://developers.google.com/maps/documentation/javascript/reference#Map) under the `google.maps` namespace. The first argument is an element on the page for where the map will be placed, and the second argument is an object containing some configuration options.

## Adding a Point on the Map

To add a point on the map, we need to use two constructor functions. First, we will create a position object using the [`google.maps.LatLng()`](https://developers.google.com/maps/documentation/javascript/reference#LatLng) constructor function:

```js
let home = new google.maps.LatLng(-34.397, 150.644);
```

Second, we can use the [`google.maps.Marker()`](https://developers.google.com/maps/documentation/javascript/reference#Marker) constructor function to create a marker on the map at the `home` position:

```js
let homeMarker = new google.maps.Marker({
  map: map,
  position: home,
  animation: google.maps.Animation.DROP,
});
```

The `google.maps.Marker` constructor function needs access to the `map` object so it knows where to put the marker, and the position which should be an instance of `google.maps.LatLng`.

## Info Windows

We can add an info window to a specific position on our map using the [`google.maps.InfoWindow(obj)`](https://developers.google.com/maps/documentation/javascript/reference#InfoWindow) constructor function:

```js
let infoWindow = new google.maps.InfoWindow({
  content: '<strong>Hi!</strong>',
  position: home
});

infoWindow.open(map);
```

The info window won't be visible by default. You need to call the `open()` method on the `InfoWindow` instance for it to appear.

## Events

Let's add a click event to the map marker we just created so that when it is clicked, the info window will open.

```js
google.maps.event.addListener(homeMarker, 'click', function(event) {
  infoWindow.open(map);
});
```

[Event listeners](https://developers.google.com/maps/documentation/javascript/reference#MapsEventListener) can be applied to different map objects like markers, info windows, and the map itself.

## Geocoding and Reverse Geocoding

Google Maps has a constructor function that allows you to geocode and reverse geocode. Geocoding is the process of taking an address and converting it into coordinates. Reverse geocoding does the opposite and takes coordinates and converts it into an address.

Geocoding and reverse geocoding can be achieved using the [`google.maps.Geocoder()`](https://developers.google.com/maps/documentation/javascript/reference#Geocoder) constructor function.

```js
let geocoder = new google.maps.Geocoder();

geocoder.geocode({
  address: '3650 McClintock Ave., Los Angeles, CA 90089'
}, function(geocoderResults) {
  let latlng = geocoderResults[0].geometry.location; // a LatLng object
  console.log(latlng.lat(), latlng.lng());
});
```

Reverse geocoding can be achieved using the same `geocode` method but passing in `location` instead of `address`:

```js
let geocoder = new google.maps.Geocoder();

geocoder.geocode({
  location: home
}, function(geocoderResults) {
  console.log(geocoderResults);
});
```

Here is a [working demo](http://jsbin.com/keliwabobi/edit?js,console,output).

## The Geolocation API

The Geolocation API built into the browser can be used with Google Maps to create interesting map applications. Several sources are used to determine a user's location including Wifi, IP geolocation, and the GPS on mobile devices.

To get a user's current position, we can use the `navigator.geolocation.getCurrentPosition` function:

```js
let successHandler = function(position) {
  console.log(position.coords.latitude, position.coords.longitude);
};
let errorHandler = function(error) {};
let options = {};
navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
```

A position object is passed to the success callback function, which contains several useful properties:

| `coords.latitude`         	| The longitude                                   	|
| `coords.longitude`        	| The longitude                                   	|
| `coords.accuracy`         	| The accuracy of position                        	|
| `coords.altitude`         	| The altitude in meters above the mean sea level 	|
| `coords.altitudeAccuracy` 	| The altitude accuracy of position               	|
| `coords.heading`          	| The heading as degrees clockwise from North     	|
| `coords.speed`            	| The speed in meters per second                  	|
| `timestamp`               	| The date/time of the response                   	|

Note that `navigator.geolocation.getCurrentPosition` is asynchronous.

We can also watch a user's position, and get notified when it changes.

```js
let successHandler = function(position) {
  console.log(position.coords.latitude, position.coords.longitude);
};
let errorHandler = function(error) {};
let options = {};
navigator.geolocation.watchPosition(successHandler, errorHandler, options);
```

The `watchPosition` method also receives the same position object as `getCurrentPosition`. The `watchPosition` method returns an identifier that can be used to clear the watch using the method `clearWatch`, similar to how `setInterval` returns an identifier that can be used to clear the interval using `clearInterval`.

The _options_ object is optional in both methods. Here is a list of properties you can pass as options:

* __enableHighAccuracy__: provides a hint to the request that it wants the best possible result. The drawback is that it could be slower and use more power consumption which isn't always ideal on a mobile device
* __timeout__: the maximum length of time to wait for a response in milliseconds
* __maximumAge__: the maximum age of a __cached__ position that the page will be willing to accept. In milliseconds with a default value of 0, which means it wont pull a position object from cache.

## References

* [MDN navigator.geolocation](https://developer.mozilla.org/en-US/docs/Using_geolocation)
