# Library for showing 3d coordinates on an interactive d3 coordinate system
 
![Screenshot](https://user-images.githubusercontent.com/4627728/34851227-ee48acf4-f6dd-11e7-92c2-2654be44c16a.png)

This module is framework agnostic so it can be used with React, Angular, Vue, or whatever other frameworks you so choose.

See **[Example](https://skycatch.github.io/photoset-grapher/sandbox/index.html)**

To use this module in your application import it as follows for the javascript

```javascript
const PhotosetGrapher = require('@skycatch/photoset-grapher');
```

The css if applicable will be located in the `dist` folder of the node_module

## Interface

Coordinates are as follows: [x, y, z]

```javascript
const PhotosetGrapher = require('@skycatch/photoset-grapher');

const coordinates = [
  [142.08271, 42.60278027777778, 54.35],
  [142.083625, 42.60330861111111, 53.97],
  [142.08395611111112, 42.60307666666667, 55.8]
];

const CanvasSystem = new PhotosetGrapher();
CanvasSystem.configure({ scale: 10, animate: true }); // optional
CanvasSystem.boot('#section', coordinates, [42.60278027777778, 142.08271, 27.153865699049703]);

```


## API 

**new PhotosetGrapher()**

**PhotosetGrapher.configure(options)** - _JSON_: Configuration options (optional)

* `options`

```javascript
 {
      'scale': 10,
      'animate': true
 }
```


**PhotosetGrapher.boot(SVG-DOM-Id, array_of_coordinates_lng_lat_alt, ground_coordinate_lng_lat_alt)**

* `SVG-DOM-Id` - _String_: DOM Element UID
* `array_of_coordinates_lng_lat_alt` - _Array[ARRAY]_: Array of Arrays of [x,y,z] coordinates in any coordinate system

```javascript
 [
   [142.0827, 42.6027, 54.35],
   [142.0836, 42.6033, 53.97],
   [142.0839, 42.6030, 55.80]
 ]
```
* `ground_coordinate_lng_lat_alt` - Array: Coordinate of a point on the surface (here altitude of the ground is ~27 meters)

```javascript
 [42.6027, 142.0827, 27.1530]
```

## What's in the box?

D3, Webpack Hot Module Replacement (HMR), ES6, SASS, Linting, Unit Tests, and Sandbox library module template

## Environment setup 

```sh
  $ npm i
```

## Development

Start the Webpack server (includes live reloading + hot module replacement when you change files):

```sh
  $ npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in a browser.  `./sandbox/index.html` is the example which is an example of an implentation of your src library.
`./src/index.js` is the entry point.

## Bundling 

When you're finished and want to make a build, you will need to actually bundle the code into its distribution bundles.  The following command will do this with which you can publish the library

```sh
  $ npm run bundle
```

