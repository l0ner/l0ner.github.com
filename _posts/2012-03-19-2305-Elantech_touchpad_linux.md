---
layout: default
title: Elantech touchpad two finger scrolling on linux
date: 2012-03-19 23:06
---

For some time I've been struggling to get my laptop (Samsung r540)[^1] to
work properly under linux for some time. Eventually I've resolved most of my
problems[^2] by installing Ubuntu Oneiric which is pretty nice, except some
Unity mis-designs[^3] which I was able to resolve.

One problem remained though:

My touchpad wasn't acting while using the "Two Finger Scroll" feature like
it should. The scrolling itself was working, but whenever I reached one of
the touchpad borders (which I did pretty much all the time) the document or
web page I was viewing (and scrolling) would jump all the way to the top or
bottom and lock the whole touchpad for a while. This was pretty annoying,
since I use my touchpad (and thus, scrolling) really frequently.

I was able to fix this in Archlinux by enabling SHMConfig option in my
xorg.conf, but it seems that Ubuntu don't accept manual X11 configuration.
When I configured X11, like I did under my Arch installation (which meant
copying the .conf file), the hell broke and I lost correct screen
configuration and my laptop keyboard wasn't detected.

I've begun googling around and I've [discovered that I still can configure
my touchpad through the xinput
tool](http://askubuntu.com/questions/18576/vostro-3400-touchpad-multiple-gesture-and-two-finger-scrolling-not-working>).
Yeah! I quickly applied what I was doing in Arch through X11 config file,
only to discover that it didn't fix my issue.

Damn! I started googling again and [found this
document](http://www.x.org/archive/X11R7.5/doc/man/man4/synaptics.4.html)
I've started reading it and I discovered interesting thing:

> When conventional coasting is enabled, horizontal/vertical scrolling can
> continue after the finger is released from the lower/right edge of the
> touchpad.

Wait, "finger is released from the lower edge of the touchpad". This is what
I was doing: I would release my fingers after I reached bottom of the
touchpad and then the scrolling would broke.

That would mean that I had problem with coasting! Quick search in the
document gave me solution how to configure/disable coasting. And since I
didn't like the idea of the scrolling continuation after I released my
fingers I decided that I would disable the whole thing. I've run `xinput
--set-prop "ETPS/2 Elantech Touchpad" "Synaptics Coasting Speed" 0 0`
disabling coasting and discovered that everything was working like it
should!

Ok, but this was only a one-shot solution. How could I make it permanent?
Let's put a script that does this in /etc/init.d and enable it by running
`update-rc.d FOO defaults` where FOO is the script name. Now everything
works as it should!

[^1]: Don't buy it. Don't buy any Samsung laptop if you want to run linux on
it. They give too many problems.

[^2]: Overheating on Arch, compilation problems and overheating on Gentoo.
Pretty much I couldn't do anything that required heavy CPU load.

[^3]: The whole dashboard thing and dock fixed to the left side of screen
without option to move it. Those are not wise decisions IMHO.
