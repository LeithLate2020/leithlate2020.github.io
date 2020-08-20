"use strict";

/////////////////////////////////////////////////////////////////////////////
// Name of the top-level folder which contains the subfolders of content for each site
var muralFolder = 'murals';
var studioFolder = 'studios';

// Name of the top-level file which contains the GeoJSON data for each site
var muralDataFile = 'murals.json';
var studioDataFile = 'studios.json';

// custom icons -- converted to PNG because SVG doesn't work
var muralIconFile = 'icons/triangle-15.png';
var muralPastIconFile = 'icons/triangle-stroked-15.png';
var studioIconFile = 'icons/cemetery-JP-15.png';

/////////////////////////////////////////////////////////////////////////////
// Mapbox configuration

// This is the map from leithlatetours@gmail.com
mapboxgl.accessToken =
'pk.eyJ1IjoibGVpdGhsYXRlIiwiYSI6ImNrY20xZGY0NzJheDUyem54M3h4c2h6MncifQ.8T4JjPlNUOfwVvpXVTyVIw';

var map = new mapboxgl.Map({
    container: 'mapcontainer',
    style: 'mapbox://styles/leithlate/ckcm2467f17vb1is46bz3uozl', //custom stylesheet
    center: [-3.167, 55.965], // starting position [lng, lat]
    zoom: 12.8, // starting zoom
    maxZoom: 16,
    minZoom: 12,
});

/////////////////////////////////////////////////////////////////////////////
// An array of strings with the file path to the content for each site
var muralContentPath = [];
var studioContentPath = [];

// An array of jQuery objects with the sidebar HTML content for each site
var muralContent = [];
var muralList = [];
var studioContent = [];
var studioList = [];

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
  siteHTML = "<div id='close'><img src='icons/cancel_s.png' width='32'></div>\n";
  siteHTML += "<div id='sitename'>" + mural.properties.name + "</div>\n";
  siteHTML += "<div id='artist'>" + mural.properties.artist + "</div>\n";
  if (mural.properties.year) {
    siteHTML += "<div id='year'>" + mural.properties.year + "</div>\n";
  }
  siteHTML += "<div id='description'>" + mural.properties.description + "</div>\n";

  // There can be a variable number of audio clips
  if (mural.properties.audio) {
    siteHTML += "<div id='audio'>";
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
      siteHTML += "' target='_blank'>transcript</a>]</div>\n";
      siteHTML += "</div>\n";
    });
    siteHTML += "</div>\n";
  };

  // There can be a variable number of video clips
  if (mural.properties.video) {
    siteHTML += "<div class='video'>";
    mural.properties.video.forEach(function(clip) {
      siteHTML += "<div class='videoclip'>\n";
      siteHTML += "<div class='videolabel'>" + clip.label + "</div>\n";

      // Embed videos using Vimeo or YouTube player
      siteHTML += "<iframe src='" + clip.url + "' frameborder='0' allow='autoplay; fullscreen' allowfullscreen></iframe>\n";

      siteHTML += "</div>\n";
    });
    siteHTML += "</div>\n";
  };

  //Google streetview link for murals
  if (mural.properties.streetview)
  {
      siteHTML += "<div id='streetview'>" + "<a href='" + mural.properties.streetview + "' target='_blank'>Google Street View" + "</a></div>\n";
  }

  imageHTML = "<img src='" + contentPath + "feature.jpg' id='featureimage' alt='";
  imageHTML += "Image of " + mural.properties.name;
  imageHTML += "'>";

  // Store the assembled content for live access
  muralContentPath[index] = contentPath;
  muralContent[index] = siteHTML;
  muralImage[index] = imageHTML;

});

// Prebuild list of murals
// Build up complete sidebar content in listHTML
let muralListHTML;

muralListHTML = "<div id='closeList'><img src='icons/cancel_s.png' width='32'></div><br/><br/><br/>\n";

muralData.features.forEach(function(mural, index)
{
  //Build the HTML raw for jQuery performance reasons
  let muralHTMLName = mural.properties.name.replace(/ /g, "&nbsp;");
  muralListHTML += "<div id=sitenameList onclick=panMap(" + mural.geometry.coordinates[1] + "," + mural.geometry.coordinates[0] + ",";
  muralListHTML += "'";
  muralListHTML += muralHTMLName;
  muralListHTML += "'";
  muralListHTML += ")>";
  if (mural.properties.icon === "mural")
  {
    muralListHTML += "<img src='" + muralIconFile + "'>&nbsp";
  }
  else if (mural.properties.icon === "muralpast")
  {
    muralListHTML += "<img src='" + muralPastIconFile + "'>&nbsp;";
  }
  muralListHTML += mural.properties.name + "</div>\n";
  muralListHTML += "<div id=detailsList onClick=openMuralDetails(" + mural.properties.id + ")>Details</div>";
  muralListHTML += "<hr/>\n";
});

muralList = muralListHTML;

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
  siteHTML = "<div id='close'><img src='icons/cancel_s.png' width='32'></div>\n";
  siteHTML += "<div id='sitename'>" + studio.properties.name + "</div>\n";
  siteHTML += "<div id='description'>" + studio.properties.description + "</div>\n";

  // There can be a variable number of video clips
  if (studio.properties.video) {
    studio.properties.video.forEach(function(clip) {
      siteHTML += "<div class='videoclip'>\n";
      siteHTML += "<div class='videolabel'>" + clip.label + "</div>\n";

      // Embed videos using Vimeo or YouTube player
      siteHTML += "<iframe src='" + clip.url + "' frameborder='0' allow='autoplay; fullscreen' allowfullscreen></iframe>\n";

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

// Prebuild list of studios
// Build up complete sidebar content in listHTML
let studioListHTML;

studioListHTML = "<div id='closeList'><img src='icons/cancel_s.png' width='32'></div><br/><br/><br/>\n";

studioData.features.forEach(function(studio, index)
{
  // Build the HTML raw for jQuery performance reasons
  let studioHTMLName = studio.properties.name.replace(/ /g, "&nbsp;");
  studioListHTML += "<div id=sitenameList onclick=panMap(" + studio.geometry.coordinates[1] + "," + studio.geometry.coordinates[0] + ",";
  studioListHTML += "'";
  studioListHTML += studioHTMLName;
  studioListHTML += "'";
  studioListHTML += ")>";
  studioListHTML += "<img src='" + studioIconFile + "'>&nbsp";
  studioListHTML += studio.properties.name + "</div>\n";
  studioListHTML += "<div id=detailsList onClick=openStudioDetails(" + studio.properties.id + ")>Details</div>";
  studioListHTML += "<hr/>\n";
});

studioList = studioListHTML;

/////////////////////////////////////////////////////////////////////////////
// Open site content by displaying the respective blocks
function openContent() {
  $("#sidebar").css("display","block");
  $("#content").css("display","flex");
  $("#overlay").css("display","block");
};

// Close site content by hiding the respective blocks
function closeContent() {
  $("#sidebar").css("display","none");
  $("#content").css("display","none");
  $("#overlay").css("display","none");
}

// Open site content by displaying the respective blocks
function openListContent() {
  $("#sidebar2").css("display","block");
};

// Close site content by hiding the respective blocks
function closeListContent() {
  $("#sidebar2").css("display","none");
}

//function to display sidebar with list of murals
$("#murals").click(function(){
  openListContent();
  $("#sidebar2").html(muralList);
  $("#closeList").click(function() { closeListContent(); });
});

//function to display sidebar with list of studios
$("#studios").click(function(){
  openListContent();
  $("#sidebar2").html(studioList);
  $("#closeList").click(function() { closeListContent(); });
});

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
      'icon-allow-overlap' : true,
      'text-allow-overlap': true,
      'icon-image': '{icon}',
      'icon-size': 0.25,
      'icon-allow-overlap': true,
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
      'icon-allow-overlap': true,
    }
  });

  ///////////////////////////////////////////////////////////////////////////
  // Build mouseover popups for murals (disable for touchscreens)
  if (!('ontouchstart' in window)) {

    map.on('mouseenter', 'murals', function(e) {

      let coordinates = e.features[0].geometry.coordinates.slice();
      let name = e.features[0].properties.name;

      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: [0, -10],
      });

      // Populate the popup and set its coordinates
      popup
        .setLngLat(coordinates)
        .setHTML(name)
        .addTo(map);

      // Have it disappear when the mouse leaves
      map.on('mouseleave', 'murals', function() {
        popup.remove();
      });
    });


    // Build mouseover popups for studios
    map.on('mouseenter', 'studios', function(e) {
      let coordinates = e.features[0].geometry.coordinates.slice();
      let name = e.features[0].properties.name;

      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: [0, -10],
      });

      // Populate the popup and set its coordinates
      popup
        .setLngLat(coordinates)
        .setHTML(name)
        .addTo(map);

      // Have it disappear when the mouse leaves
      map.on('mouseleave', 'studios', function() {
        popup.remove();
      });
    });

  }

  /////////////////////////////////////////////////////////////////////////////
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

//function to reset map
$("#virtualtours").click(function(){
  map.flyTo({
    center: [-3.167, 55.965], // starting position [lng, lat]
    zoom: 12.8 // starting zoom
  })
});

//from sidebar2 - function to pan map to supplied coordinates, trigger popup
function panMap(lat,lng, name)
{
  map.flyTo({
    center: [lng, lat], // pan position [lng, lat]
  })
  //remove any existing popups
  $('.mapboxgl-popup').remove();
  //create new one
  let popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: [0, -10],
  });
  popup
    .setLngLat([lng,lat])
    .setHTML(name)
    .addTo(map);
};

//from sidebar2 - functions to open site details
function openMuralDetails(siteId)
{
    openContent();
    $("#sidebar").html(muralContent[siteId]);
    $("#content").html(muralImage[siteId]);
    $("#close").click(function() { closeContent(); });
    $("#content").click(function() { closeContent(); });
    $("#featureimage").click(function(e) {
      window.open(muralContentPath[siteId] + "fullsize.jpg","_blank");
      e.stopPropagation();
    });
}
function openStudioDetails(siteId)
{
    openContent();
    $("#sidebar").html(studioContent[siteId]);
    $("#content").html(studioImage[siteId]);
    $("#close").click(function() { closeContent(); });
    $("#content").click(function() { closeContent(); });
    $("#featureimage").click(function(e) {
      window.open(studioContentPath[siteId] + "fullsize.jpg","_blank");
      e.stopPropagation();
    });
}