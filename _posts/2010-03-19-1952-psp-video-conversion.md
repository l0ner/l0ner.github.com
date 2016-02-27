--- 
layout: default
title: PSP video conversion
---
How to convert videos for PSP using ffmpeg:

**PSP Fullscreen 4:3**

`ffmpeg -i "$1" -f mp4 -r 29.97 -vcodec libx264 -s 640x480 -aspect 4:3 -b 1250kb -maxrate 4M -bufsize 4M -flags +loop -cmp +chroma -partitions +parti4x4+partp8x8+partb8x8 -memethod umh -subq 6 -trellis 1 -refs 2 -bf 1 -coder 1 -merange 16 -g 300 -keyintmin 25 -scthreshold 40 -iqfactor 0.71 -bt 1250k -qcomp 0.6 -qmin 10 -qmax 51 -qdiff 4 -level 21 -acodec libfaac -ab 128kb -ar 48000 -ac 2 -threads XXX "$2"`

**PSP Widescreen**

`ffmpeg -i "$1" -f mp4 -r 29.97 -vcodec libx264 -s 480x272 -aspect 16:9 -b 1250kb -maxrate 4M -bufsize 4M -flags +loop -cmp +chroma -partitions +parti4x4+partp8x8+partb8x8 -memethod umh -subq 6 -trellis 1 -refs 2 -bf 1 -coder 1 -merange 16 -g 300 -keyintmin 25 -scthreshold 40 -iqfactor 0.71 -bt 1250k -qcomp 0.6 -qmin 10 -qmax 51 -qdiff 4 -level 21 -acodec libfaac -ab 128kb -ar 48000 -ac 2 -threads XXX "$2"`

Where `XXX` stands for CPU core number, `$1` input file and `$2` output file
