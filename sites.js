"use strict";

// Name of the top-level folder which contains the subfolders of content for each site
var contentFolder = 'content';

// Mapbox configuration
// This is Melisa's map -- probably CHANGEME

mapboxgl.accessToken = 'pk.eyJ1IjoibWVsaXNhcGF6IiwiYSI6ImNrOXdqdWRtdDA5aTkzZ3VoYXhramNyZjgifQ.V3kNFUghK_8qlcj5ac_WPQ';

var map = new mapboxgl.Map({
    container: 'mapcontainer',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [-3.164, 55.968], // starting position [lng, lat]
    zoom: 14, // starting zoom
});

// This will be an array of jQuery objects with the sidebar content for each site
var siteContent = [];
// This will be an array of jQuery objects with the initial image content for each site
var siteImage = [];

// This is the raw GeoJSON
var muralData = {
  'type' : 'FeatureCollection',
  'features' : [
    {
      'type' : 'Feature',
      'properties' : {
        'name' : 'Wronger Rites',
        'folder' : 'WrongerRites',
        'artist' : 'Kirsty Whiten',
        'description' :
            '<p>Kirsty Whiten’s Wronger Rites mural was commissioned as part of The Mural Project for the LeithLate15 festival, with associated temporary public art installations on Leith Walk opposite the former Edinburgh Printmakers and an exhibition at the former Whitespace gallery. In 2017 two thirds of the mural were sadly demolished, though the horse figure remains intact.</p><p>Artist website: <a href="https://www.kirstywhiten.com/">www.kirstywhiten.com</a></p>',
        'icon' : 'museum',
        'audio' : [
          {
            'file' : 'CameronFoster.mp3',
            'transcript' : 'CameronFoster.pdf',
            'label' : 'Cameron Foster Audio Guide',
          },
          {
            'file' : 'KirstyWhiten.mp3',
            'transcript' : 'KirstyWhiten.pdf',
            'label' : 'Kirsty Whiten on Wronger Rites',
          },
        ],
      },
      'geometry' : {
        'type' : 'Point',
        'coordinates' : [-3.174445359,55.96481864],
      }
    },
    {
      'type' : 'Feature',
      'properties' : {
        'name' : 'Leith Dockers Club Mural',
        'folder' : 'DockersClub',
        'artist' : 'Tom Ewing',
        'description' :
            '<p>This mural was painted as a celebration of the history of both Leith and the Leith Dockers Club, and was unveiled by the author Irvine Welsh in early 2014. Although on private grounds, the mural is publicly available to view whenever the Leith Dockers Club is open.</p>',
        'icon' : 'harbor',
        'audio' : [
          {
            'file' : 'CameronFoster.mp3',
            'transcript' : 'CameronFoster.pdf',
            'label' : 'Cameron Foster Audio Guide',
          },
        ]
      },
      'geometry' : {
        'type' : 'Point',
        'coordinates' : [-3.170117861,55.97073971],
      }
    },
    {
      'type' : 'Feature',
      'properties' : {
        'name' : 'Leith Aquatic Mural',
        'folder' : 'LeithAquatic',
        'artist' : 'Blameless Collective',
        'description' :
            '<p>The Leith Aquatic was the first mural fundraised for and commissioned by LeithLate, as part of The Mural Project in 2013. It was produced by Blameless Collective through local community consultation and was also the first large-scale mural to be installed in Leith for almost three decades, kickstarting a new association with public art in the area. The mural launch in July 2013 included a street party for local residents with speeches, DJs and free daal courtesy of Sikh Sanjog.</p>',
        'icon' : 'aquarium',
        'audio' : [
          {
            'file' : 'CameronFoster.mp3',
            'transcript' : 'CameronFoster.pdf',
            'label' : 'Cameron Foster Audio Guide',
          },
          {
            'file' : 'RabiyaChoudhry.mp3',
            'transcript' : 'RabiyaChoudhry.pdf',
            'label' : 'Rabiya Choudhry on Leith Aquatic Mural',
          },
          {
            'file' : 'RichieCumming.mp3',
            'transcript' : 'RichieCumming.pdf',
            'label' : 'Richie Cumming on Leith Aquatic Mural',
          },
          {
            'file' : 'FraserGray.mp3',
            'transcript' : 'FraserGray.pdf',
            'label' : 'Fraser Gray on Leith Aquatic Mural',
          },

        ],
      },
      'geometry' : {
        'type' : 'Point',
        'coordinates' : [-3.170161848,55.9678748],
      }
    }
  ]
}

// Prepare content for each item on the map
muralData.features.forEach(function(mural, index){
  // Build up complete sidebar content in siteHTML
  let siteHTML;

  // Assign an ID to each mural
  mural.properties.id = index;
  //let siteId = "site-".concat(index);

  // Build the HTML raw for jQuery performance reasons
  siteHTML = "<div id='sitename'>" + mural.properties.name + "</div>\n";
  siteHTML += "<div id='artist'>" + mural.properties.artist + "</div>\n";
  siteHTML += "<div id='description'>" + mural.properties.description + "</div>\n";

  // There can be a variable number of audio clips
  siteHTML += "<div id='audio'>";
  console.log(mural.properties.audio);
  if (mural.properties.audio) {
    mural.properties.audio.forEach(function(clip) {
      siteHTML += "<div class='audioclip'>\n";
//      siteHTML += "<a href='" + contentFolder + "/" + mural.properties.folder + "/";
//      siteHTML += clip.file;
//      siteHTML += "'>";
      siteHTML += clip.label;
//      siteHTML += "</a>";
      // Use native player
      siteHTML += "<div class='audioplayer'><audio controls>";
      siteHTML += "<source src='";
      siteHTML += contentFolder + "/" + mural.properties.folder + "/";
      siteHTML += clip.file;
      siteHTML += "' type='audio/mpeg'>Your browser does not support the audio element.</audio>";
      siteHTML += "</div>\n";
      // Each clip should have a transcript in PDF
      siteHTML += "<div class='transcript'>";
      siteHTML += "[<a href='" + contentFolder + "/" + mural.properties.folder + "/";
      siteHTML += clip.transcript;
      siteHTML += "'>transcript</a>]</div>\n";
      siteHTML += "</div>\n";
    })
  };
  siteHTML += "</div>\n";

  siteContent[index] = siteHTML;
  siteImage[index] = "<img src='content/" + mural.properties.folder + "/feature.jpg'>";

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
      'icon-allow-overlap': true,
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
