"use strict";

/////////////////////////////////////////////////////////////////////////////
// Name of the top-level folder which contains the subfolders of content for each site
var muralFolder = 'murals';
var studioFolder = 'studios';

// Name of the top-level file which contains the GeoJSON data for each site
var muralDataFile = 'murals.json';
var studioDataFile = 'studios.json';

// Melisa's custom icons -- converted to PNG because SVG doesn't work
var muralIconFile = 'icons/triangle-15.png';
var muralPastIconFile = 'icons/triangle-stroked-15.png';
var studioIconFile = 'icons/cemetery-JP-15.png';

/////////////////////////////////////////////////////////////////////////////
// Mapbox configuration

// This is Melisa's map -- CHANGEME
// mapboxgl.accessToken = 'pk.eyJ1IjoibWVsaXNhcGF6IiwiYSI6ImNrOXdqdWRtdDA5aTkzZ3VoYXhramNyZjgifQ.V3kNFUghK_8qlcj5ac_WPQ';

// This is the map from leithlatetours@gmail.com
mapboxgl.accessToken =
'pk.eyJ1IjoibGVpdGhsYXRlIiwiYSI6ImNrY20xZGY0NzJheDUyem54M3h4c2h6MncifQ.8T4JjPlNUOfwVvpXVTyVIw';

var map = new mapboxgl.Map({
    container: 'mapcontainer',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [-3.162, 55.966], // starting position [lng, lat]
    zoom: 13.2, // starting zoom
});

/////////////////////////////////////////////////////////////////////////////
// An array of strings with the file path to the content for each site
var muralContentPath = [];
var studioContentPath = [];

// An array of jQuery objects with the sidebar HTML content for each site
var muralContent = [];
var studioContent = [];

// An array of jQuery objects with the image HTML content for each site
var muralImage = [];
var studioImage = [];

/////////////////////////////////////////////////////////////////////////////
// Prebuild content for each mural on the map
muralData.features.forEach(function(mural, index){
  // Build up complete sidebar content in siteHTML
  let siteHTML;
  let imageHTML;
  let contentPath = muralFolder + "/" + mural.properties.folder + "/";

  // Assign an ID to each mural
  mural.properties.id = index;

  // Build the HTML raw for jQuery performance reasons
  siteHTML = "<div id='sitename'>" + mural.properties.name + "</div>\n";
  siteHTML += "<div id='artist'>" + mural.properties.artist + "</div>\n";
  if (mural.properties.year) {
    siteHTML += "<div id='year'>" + mural.properties.year + "</div>\n";
  }
  siteHTML += "<div id='description'>" + mural.properties.description + "</div>\n";

  // There can be a variable number of audio clips
  siteHTML += "<div id='audio'>";
  if (mural.properties.audio) {
    mural.properties.audio.forEach(function(clip) {
      siteHTML += "<div class='audioclip'>\n";
      siteHTML += "<div class='audiolabel'>" + clip.label + "</div>\n";
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

//  imageHTML = "<a href='" + contentPath + "fullsize.jpg' target='_blank'>";
  imageHTML = "<img src='" + contentPath + "feature.jpg' id='featureimage' alt='";
  imageHTML += "Image of " + mural.properties.name;
  imageHTML += "'>";
//  imageHTML += "'></a>";

  // Store the assembled content for live access
  muralContentPath[index] = contentPath;
  muralContent[index] = siteHTML;
  muralImage[index] = imageHTML;

});

/////////////////////////////////////////////////////////////////////////////
// Prebuild content for each studio on the map
studioData.features.forEach(function(studio, index){
  // Build up complete sidebar content in siteHTML
  let siteHTML;
  let imageHTML;
  let contentPath = studioFolder + "/" + studio.properties.folder + "/";

  // Assign an ID to each mural
  studio.properties.id = index;

  // Build the HTML raw for jQuery performance reasons
  siteHTML = "<div id='sitename'>" + studio.properties.name + "</div>\n";
  siteHTML += "<div id='description'>" + studio.properties.description + "</div>\n";

  // There can be a variable number of video clips
  if (studio.properties.video) {
    studio.properties.video.forEach(function(clip) {
      siteHTML += "<div class='videoclip'>\n";
      siteHTML += "<div class='videolabel'>" + clip.label + "</div>\n";


// This is the actual video embed code, commented out whilst the videos are private
//      siteHTML += "<iframe src='" + clip.url + "' frameborder='0' allow='autoplay; fullscreen' allowfullscreen></iframe>\n;"

      // This is not the actual video but a Paolozzi placeholder
      siteHTML += "<iframe src='https://player.vimeo.com/video/31835579' frameborder='0' allow='autoplay; fullscreen' width='100%' height='100%' allowfullscreen></iframe>\n";
      siteHTML += "</div>\n";

      // Use native player
//      siteHTML += "<video controls>";
//      siteHTML += "<source src='" + contentPath + clip.file;
//      siteHTML += "' type='video/mp4'>";
//      if (clip.subtitles) {
//        siteHTML += "<track label='English' kind='subtitles' srclang='en' src='";
//        siteHTML += contentPath + clip.subtitles + "' default>";
//      }
//      siteHTML += "Your browser does not support the video element.</video>";
//      siteHTML += "</div>\n";


      // Each clip should have a transcript in PDF
//      siteHTML += "<div class='transcript'>";
//      siteHTML += "[<a href='" + contentPath + clip.transcript;
//      siteHTML += "'>transcript</a>]</div>\n";
//      siteHTML += "</div>\n";
    })
  };

  imageHTML = "<img src='" + contentPath + "feature.jpg' id='featureimage' alt='";
  imageHTML += "Image of " + studio.properties.name;
  imageHTML += "'>";

  // Store the assembled content for live access
  studioContentPath[index] = contentPath;
  studioContent[index] = siteHTML;
  studioImage[index] = imageHTML;

});

/////////////////////////////////////////////////////////////////////////////
// Open site content by displaying the respective blocks
function openContent() {
  $("#sidebar").css("display","block");
  $("#content").css("display","flex");
  $("#overlay").css("display","block");
  $("#close").css("display","block");
};

// Close site content by hiding the respective blocks
function closeContent() {
  $("#sidebar").css("display","none");
  $("#content").css("display","none");
  $("#overlay").css("display","none");
  $("#close").css("display","none");
}

/////////////////////////////////////////////////////////////////////////////
// Begin once map assets are loaded
map.on('load', function (e) {

  // Load icons
  map.loadImage(muralIconFile, function(error, image) {
    if (error) throw error;
    map.addImage('mural', image);
  });
  map.loadImage(muralPastIconFile, function(error, image) {
    if (error) throw error;
    map.addImage('muralpast', image);
  });
  map.loadImage(studioIconFile, function(error, image) {
    if (error) throw error;
    map.addImage('studio', image);
  });

  // Add the murals to the map as a symbol layer
  map.addLayer({
    "id": "murals",
    "type": "symbol",
    // Add a GeoJSON source containing place coordinates and information
    "source": {
      "type": "geojson",
      "data": muralData,
    },
    'layout': {
      'icon-image': '{icon}',
      'icon-size': 0.25,
      'icon-allow-overlap': false,
//      'text-field': '{name}',
//      'text-size' : 14,
//      'text-anchor': 'top',
//      'text-offset': [0,0.7],
    }
  });

  // Add the studios to the map as a symbol layer
  map.addLayer({
    "id": "studios",
    "type": "symbol",
    // Add a GeoJSON source containing place coordinates and information
    "source": {
      "type": "geojson",
      "data": studioData,
    },
    'layout': {
      'icon-image': '{icon}',
      'icon-size': 0.25,
      'icon-allow-overlap': false,
    }
  });


// Looks like label properties are set per layer so this won't work on a single site
//  map.on('mousemove', 'murals', function(e) {
//    let siteId = e.features[0].properties.id;
//    let siteName = e.features[0].properties.name;
//    console.log(siteId);
//    map.setLayoutProperty('murals', 'text-field', siteName);
//    );
//  });

  // When user clicks on a map feature, open the content
  map.on('click', 'murals', function(e) {
    let siteId = e.features[0].properties.id;
    openContent();

    // Fill content panels with prebuilt content
    $("#sidebar").html(muralContent[siteId]);
    $("#content").html(muralImage[siteId]);

    // When user clicks on close div or background, close the content
    $("#close").click(function() { closeContent(); });
    $("#content").click(function() { closeContent(); });

    // When user clicks on feature image, open fullsize version in another tab
    // This could be cleanly done in the HTML but for some reason
    // div > a > img is a nightmare to style under flexbox.
    // div > img works fine.
    $("#featureimage").click(function(e) {
      window.open(muralContentPath[siteId] + "fullsize.jpg","_blank");
      // We don't want this click to also close the content window
      e.stopPropagation();
    });
  });

  map.on('click', 'studios', function(e) {
    let siteId = e.features[0].properties.id;
    openContent(siteId);

    // Fill content panels with prebuilt content
    $("#sidebar").html(studioContent[siteId]);
    $("#content").html(studioImage[siteId]);

    // When user clicks on close div or background, close the content
    $("#close").click(function() { closeContent(); });
    $("#content").click(function() { closeContent(); });

    // When user clicks on feature image, open fullsize version in another tab
    $("#featureimage").click(function(e) {
      window.open(studioContentPath[siteId] + "fullsize.jpg","_blank");
      // We don't want this click to also close the content window
      e.stopPropagation();
    });
  });

  // Change the cursor to a pointer when the mouse is over a symbol layer.
  map.on('mouseenter', 'murals', function() {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseenter', 'studios', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back from a pointer when it leaves.
  map.on('mouseleave', 'murals', function() {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseleave', 'studios', function() {
    map.getCanvas().style.cursor = '';
  });

});



//    var coordinates = e.features[0].geometry.coordinates.slice();
//    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
//    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//    }
