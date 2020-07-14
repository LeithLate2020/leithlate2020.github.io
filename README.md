# muraldemo
Prototype for Leith Art Map with Mapbox platform

Mural images are stored in their original size (fullsize.jpg) and reduced to 1200px max on longest side (feature.jpg). The ImageMagick recipe for this is:

    convert fullsize.jpg -resize 1200x1200\> feature.jpg