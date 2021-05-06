# tigerhall-kittens

APIs to add sightings of the tigers in the wild.

## Installation

```sh
$ npm install
$ npm run knex migrate:latest
```

## APIs

### List all tigers

Returns json list of all tigers sorted by last seen timestamp

```
GET http://<domain>/tigers
```

Sample Response

```json
{
  "tigerList": [
    {
      "id": "a68d9133-0e0d-4fd7-8a57-9adb92774eca",
      "name": "Kelsie",
      "dateOfBirth": "2017-01-01T00:00:00.000Z",
      "lastSeenAt": "2021-05-05T23:10:12.000Z",
      "lastSeenCord": {
        "lat": "1.34501000",
        "lng": "103.98320800"
      },
      "image": "/image/resized/wallpaper2you_307771.jpg"
    },
    {
      "id": "ccd91c82-f096-4d56-824b-d3ffceb507c9",
      "name": "Hilario",
      "dateOfBirth": "2019-02-10T00:00:00.000Z",
      "lastSeenAt": "2021-05-04T19:59:26.000Z",
      "lastSeenCord": {
        "lat": "1.35208300",
        "lng": "103.81983900"
      },
      "image": "/image/resized/19e80ad1-93ed-5742-8647-d35ac1318adb.png"
    }
  ]
}
```

### List of tiger sightings

Returns json list of all tiger signtings sorted by last seen timestamp for the provided tiger

```
GET http://<domain>/tiger/<tiger-uuid>/sightings
```

Sample Response

```json
{
  "tigerSightings": [
    {
      "id": "e596213c-6fa0-4036-ae21-5767f216bf4b",
      "seenAt": "2021-05-05T23:10:12.000Z",
      "seenCord": {
        "lat": "1.34501000",
        "lng": "103.98320800"
      },
      "image": "/image/resized/wallpaper2you_307771.jpg"
    },
    {
      "id": "42e6d913-b749-4f3b-a62d-ed3e5ff47df7",
      "seenAt": "2021-05-05T18:16:13.000Z",
      "seenCord": {
        "lat": "1.35208300",
        "lng": "103.81983900"
      },
      "image": "/image/resized/19e80ad1-93ed-5742-8647-d35ac1318adb.png"
    }
  ]
}
```

### Create tiger

Create a new tiger from the data provided. The request type is `multipart/form-data` to allow upload of image

```
POST http://<domain>/tiger
```

Sample Request

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>Field</td>
      <td>The tiger name</td>
    </tr>
    <tr>
      <td>dateOfBirth</td>
      <td>Field</td>
      <td>The tiger date of birth</td>
    </tr>
    <tr>
      <td>lastSeenAt</td>
      <td>Field</td>
      <td>The last seen at timestamp</td>
    </tr>
    <tr>
      <td>lat</td>
      <td>Field</td>
      <td>The last seen latitude</td>
    </tr>
    <tr>
      <td>lng</td>
      <td>Field</td>
      <td>The last seen longitude</td>
    </tr>
    <tr>
      <td>image</td>
      <td>File</td>
      <td>The image for the tiger</td>
    </tr>
  </tbody>
</table>

<br/>

### Create tiger sighting

Create a new tiger sighting not within 5km of previous sightings. The request type is `multipart/form-data` to allow upload of image

```
POST http://<domain>/tiger/sighting
```

Sample Request

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tigerId</td>
      <td>Field</td>
      <td>The tiger uuid</td>
    </tr>
    <tr>
      <td>seenAt</td>
      <td>Field</td>
      <td>The seen at timestamp</td>
    </tr>
    <tr>
      <td>lat</td>
      <td>Field</td>
      <td>The sighting latitude</td>
    </tr>
    <tr>
      <td>lng</td>
      <td>Field</td>
      <td>The sighting longitude</td>
    </tr>
    <tr>
      <td>image</td>
      <td>File</td>
      <td>The image for the tiger sighting</td>
    </tr>
  </tbody>
</table>

<br/>

## Running Tests

```sh
$ npm run test
```
