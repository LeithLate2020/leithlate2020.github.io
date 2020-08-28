# LeithLate Virtual Tours Application


## Updating the content

To edit the content of the Virtual Tours application you require a GitHub account with access to the repository at:

https://github.com/LeithLate2020/leithlate2020.github.io

To edit a file, go to this URL and click on the 'Sign in' option at the top right of the page and enter your GitHub account details.

This will show a list of folders and files that contain the data for the application in much the same way as for a Windows File Explorer.

The content for each map feature (a mural or a studio) is held in two places: media in a folder, and information in a GeoJSON file.

Click on the filename to be edited in the list of files in the repository and this will take you to a page showing the content of the file with options for managing the file.

To edit the file click on the editing option ('pencil' icon) at the top right of the page. Make changes in the editing window and click on the green 'Commit changes' button at the bottom of the page.

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
        "name" : "Leith Aquatic Mural",
        "folder" : "LeithAquatic",
        "artist" : "Blameless Collective",
        "year" : "2013",
        "description" :
          "<p>The Leith Aquatic was the first mural fundraised for and commissioned by LeithLate, as part of The Mural Project in 2013. It was produced by Blameless Collective through local community consultation and was also the first large-scale mural to be installed in Leith for almost three decades, kickstarting a new association with public art in the area. The mural launch in July 2013 included a street party for local residents with speeches, DJs and free daal courtesy of Sikh Sanjog.</p><p>Photo: <a href='https://www.eoincareyphoto.com/' target='_blank'>Eoin Carey</a>.</p>",
        "icon" : "mural",
        "audio" : [
          {
            "file" : "CameronFoster.mp3",
            "transcript" : "CameronFoster.pdf",
            "label" : "Cameron Foster Audio Guide",
          },
          {
            "file" : "RabiyaChoudhry.mp3",
            "transcript" : "RabiyaChoudhry.pdf",
            "label" : "Rabiya Choudhry on Leith Aquatic Mural",
          },
          {
            "file" : "RichieCumming.mp3",
            "transcript" : "RichieCumming.pdf",
            "label" : "Richie Cumming on Leith Aquatic Mural",
          },
          {
            "file" : "FraserGray.mp3",
            "transcript" : "FraserGray.pdf",
            "label" : "Fraser Gray on Leith Aquatic Mural",
          },
        ],
        "video" : [
          {
            "url" : "https://player.vimeo.com/video/83446593",
            "label" : "Arts News",
          },
          {
            "url" : "https://player.vimeo.com/video/72727555",
            "label" : "Cagoule",
          },
        ],
      },

      "geometry" : {
        "type" : "Point",
        "coordinates" : [-3.170161848,55.9678748],
      }
    },


It's hopefully self-explanatory. Notice a few things:

* that's HTML code inside the description;
* there can be a variable number of audio clips. Each has file/transcript/label inside curly brackets, but the entire list of clips is inside *square* brackets, to show it's a list;
* video is configured like audio, in a separate list of video clips &mdash; but we specify url/label instead of file/transcript/label. The Vimeo URL (web address) needs to mention *player* or the link won't work;
* the new code block has to go immediately after or before the code block for another feature, because it's part of a *list of features.* Look for the square brackets around that list if you want to understand the format better;
* remember to update the GPS coordinates.

## Developer notes

Mural images are stored in their original size (fullsize.jpg) and reduced to 1200px max on longest side (feature.jpg). The ImageMagick recipe for this is:

    convert fullsize.jpg -interlace Plane -resize 1200x1200\> feature.jpg

Quick recipe for converting WAV files:

    ffmpeg -i RichieCumming.wav RichieCumming.mp3
