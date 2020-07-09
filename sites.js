"use strict";

/////////////////////////////////////////////////////////////////////////////////////////////////

// Name of the top-level folder which contains the subfolders of content for each site
var contentFolder = 'content';

// Name of the top-level file which contains the GeoJSON data for the murals
var muralDataFile = 'murals.json';

// Mapbox configuration
// This is Melisa's map -- probably CHANGEME
mapboxgl.accessToken = 'pk.eyJ1IjoibWVsaXNhcGF6IiwiYSI6ImNrOXdqdWRtdDA5aTkzZ3VoYXhramNyZjgifQ.V3kNFUghK_8qlcj5ac_WPQ';

var map = new mapboxgl.Map({
    container: 'mapcontainer',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [-3.164, 55.968], // starting position [lng, lat]
    zoom: 14, // starting zoom
});

/////////////////////////////////////////////////////////////////////////////////////////////////


// An array of jQuery objects with the sidebar content for each site
var siteContent = [];
// An array of jQuery objects with the initial image content for each site
var siteImage = [];

// Prepare content for each item on the map
muralData.features.forEach(function(mural, index){
  // Build up complete sidebar content in siteHTML
  let siteHTML;
  let contentPath = contentFolder + "/" + mural.properties.folder + "/";

  // Assign an ID to each mural
  mural.properties.id = index;

  // Build the HTML raw for jQuery performance reasons
  siteHTML = "<div id='sitename'>" + mural.properties.name + "</div>\n";
  siteHTML += "<div id='artist'>" + mural.properties.artist + "</div>\n";
  siteHTML += "<div id='description'>" + mural.properties.description + "</div>\n";

  // There can be a variable number of audio clips
  siteHTML += "<div id='audio'>";
  if (mural.properties.audio) {
    mural.properties.audio.forEach(function(clip) {
      siteHTML += "<div class='audioclip'>\n";
      siteHTML += clip.label;
      // Use native player
      siteHTML += "<div class='audioplayer'><audio controls>";
      siteHTML += "<source src='" + contentPath + clip.file;
      siteHTML += "' type='audio/mpeg'>Your browser does not support the audio element.</audio>";
      siteHTML += "</div>\n";
      // Each clip should have a transcript in PDF
      siteHTML += "<div class='transcript'>";
      siteHTML += "[<a href='" + contentPath + clip.transcript;
      siteHTML += "'>transcript</a>]</div>\n";
      siteHTML += "</div>\n";
    })
  };
  siteHTML += "</div>\n";

  siteContent[index] = siteHTML;
  siteImage[index] = "<img src='" + contentPath + "feature.jpg'>";

});

/* Begin once map assets are loaded */

map.on('load', function (e) {
  /* Add the data to the map as a layer */
  map.addLayer({
    "id": "murals",
    "type": "symbol",
    /* Add a GeoJSON source containing place coordinates and information. */
    "source": {
      "type": "geojson",
      "data": muralData,
    },
    'layout': {
      'icon-image': '{icon}-15',
      'icon-allow-overlap': false,
      'text-field': '{name}',
      'text-size' : 14,
      'text-anchor': 'top',
      'text-offset': [0,0.7],
    }
  });

  // When user clicks on a feature in the places layer, open the content
  map.on('click', 'murals', function(e) {
    $("#sidebar").css("display","block");
    $("#content").css("display","flex");
    $("#overlay").css("display","block");
    $("#close").css("display","block");

    // Fill content panels with prebuilt content
    let siteId = e.features[0].properties.id;
    $("#sidebar").html(siteContent[siteId]);
    $("#content").html(siteImage[siteId]);

    // When user clicks on close div, close the content
    $("#close").click(function() {
      $("#sidebar").css("display","none");
      $("#content").css("display","none");
      $("#overlay").css("display","none");
      $("#close").css("display","none");
    });


//    var coordinates = e.features[0].geometry.coordinates.slice();
//    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
//    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//    }
  });

  // Change the cursor to a pointer when the mouse is over the murals layer.
  map.on('mouseenter', 'murals', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back from a pointer when it leaves.
  map.on('mouseleave', 'murals', function() {
    map.getCanvas().style.cursor = '';
  });
});
