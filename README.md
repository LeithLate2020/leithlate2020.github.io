# muraldemo
Prototype for Leith Art Map with Mapbox platform

## Updating the content

The content for each map feature (a mural or a studio) is held in two places: media in a folder, and information in a GeoJSON file.

### Media

Media such as images, audio files and transcripts are collected in folders here. So e.g. the Dockers Club mural media is in `murals/DockersClub` and the Drill Hall media is in `studios/OOTBDrillHall`. To add a site, create a new folder in the appropriate place. Avoid spaces in its name. It would be good practice to look in other folders to see how their files are named and organised.

Video files are not kept in these folders. The files are too large to be hosted on github. Instead they are hosted on Vimeo. See below for the specifics of how the link to Vimeo works.

The only contents of these folders that are referenced automatically are the feature images. Put the full-sized image in `fullsize.jpg` and make a reduced version (1200px x 1200px max) named `feature.jpg`. The latter is the image that comes up first, and the former is the image that will appear if you click through to a separate tab.

### Information

The icon location for a studio or mural, and the information that comes up in its sidebar, are configured in one of two files at the top level: `murals.js` or `studios.js`. These describe the datasets in [GeoJSON](https://geojson.org/) format. You don't need to completely understand the format to edit it. Just understand that it is a big ol' nest of brackets, and it is **real picky** about matching those brackets.

You should be able to edit existing text as long as you are careful. Github maintains a copy of the previous version of the file, but you might like to save your own copy for reference before you start editing.

#### Things that might trip you up

**Quotes**: All text in GeoJSON must be surrounded by double quotes. This means you can't put double quotes in your text or you will prematurely end the text block. This is particularly likely around HTML links. *Use single quotes* instead.

**Commas**: Most GeoJSON is a list of `"name" : "value"` pairs connected by commas. If you forget a comma, the browser will throw an error and the map won't load. Every developer forgets them all the time.

**Indentation**: The ruthless indentation is not crucial to the data; it's a style convention that helps you match your brackets. Breaking it won't necessarily cause an error, but it's best to stick with it.

#### Adding a new site

Once you've put your media in a new content folder, you need to add a new feature to `murals.js` or `studios.js`. This is the complete code block for one feature:

    {
      "type" : "Feature",
      "properties" : {
        "name" : "Leith History Mural",
        "folder" : "LeithHistory",
        "artist" : "Tim Chalk and Paul Grime",
        "year" : "1985",
        "description" :
          "<p>The mural artwork was based on a series of workshops run with local people during 1985, referencing key points in Leith’s history and a depiction of the area at the time. Its original title was Moving into the future with a stronger community, exemplified by the last &lsquo;puzzle piece&rsquo; on the bottom right hand side of the mural.</p>",
        "icon" : "mural",
        "audio" : [
          {
            "file" : "CameronFoster.mp3",
            "transcript" : "CameronFoster.pdf",
            "label" : "Cameron Foster Audio Guide",
          },
          {
            "file" : "TimChalk.mp3",
            "transcript" : "TimChalk.pdf",
            "label" : "Tim Chalk on Leith History Mural",
          },
        ]
      },
      "geometry" : {
        "type" : "Point",
        "coordinates" : [-3.179364314,55.97573747],
      }
    },

It's hopefully self-explanatory. Notice a few things:

* that's HTML code inside the description;
* there can be a variable number of audio clips. Each has file/transcript/label inside curly brackets, but the entire list of clips is inside *square* brackets, to show it's a list;
* video is added just like audio, in a separate list of video clips &mdash; but we specify url/label instead of file/transcript/label;
* the new code block has to go immediately after or before the code block for another feature, because it's part of a *list of features.* Look for the square brackets around that list if you want to understand the format better;
* remember to update the GPS coordinates.

## Developer notes

Mural images are stored in their original size (fullsize.jpg) and reduced to 1200px max on longest side (feature.jpg). The ImageMagick recipe for this is:

    convert fullsize.jpg -resize 1200x1200\> feature.jpg

Quick recipe for converting WAV files:

    ffmpeg -i RitchieCumming.wav RichieCumming.mp3
