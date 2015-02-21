--- 
layout: default
title: Library sorting in Media Players 
date: 2012-07-09 
---

For some time I've been searching for an audio player that would suit me
perfectly. What I needed was a clean GUI, Library, possibility of automatic
Library cleanups (like automatic copying and renaming of files upon add), id3
tag editor and light and fast feel[^1]. For past 3 years I've been using iTunes,
since it's the only application that can be used to manage music on my iPod[^2].
I've grown pretty accustomed to it, but it felt kinda slow, and there were
things that I didn't like[^3]. So I've begun searching for a replacement.

I've noticed while testing that some players sort library top level (Artists) 
by "**Artist**" instead of "**Album Artist**" tag. This led to unimaginable 
clutter of my music library, since I have many compilation and remix albums,
where every track has a different artist. In iTunes those get sorted by "**Album
Artist**" tag, which exist for a reason. 

This made me curious. I've started to test different audio players to see how
their handle this stuff with default settings. Using wikipedia and aptitude on 
ubuntu I've picked a list of media players, both for windows and linux and
started testing. For this test I've choose 2 albums that are compilations of
tracks done by different artists: one containing remixes and one OST.

### Test environment:

The albums that I've choosen were: Appleseed soundtrack, and Celldwellers "Take 
it & break it vol. 1" remix album. In both cases pretty much every track on 
ablum was done by different artist (stored in "**Artist**" tag).

So, tl;dr: Players should group library by "Album Artist" and not by "Artist".
Let's see which pass this test. Screenshots as proofs.

### Tests:

#### players for Windows[^4]:

1. [AIMP3][aimp_w] ([screenshot][aimp])
   : groups library by Album Artist. This is the expected behaviour. Can't say 
     much more about this player, since I've never used it before. ***Passed***.  
2. [aTunes][atunes_w] ([screenshot][atunes])
   : Player written in Java. Strongly reminds my of Amarok 1.5. Groups library 
     by Album Artist as you can see on the screenshot. ***Passed***.
3. [iTunes][itunes_w] ([screnshot][itunes])
   : Groups by Album Artist. Not much to test since this was the player I was
     comparing others to. **Passed**.  
4. [Saw Player][saw_w]
   : Our first fail. Allows grouping only by Artist ([screenshot0][saw_artist])
     or by Album title ([screenshot1][saw_album]). After playing with it for 5 
     minutes got labeled as "crapware". Not even worth trying. **Failed**
5. [MediaMonkey][mediamonkey_w] ([screenshot0][mediamonkey])
   : By default groups by Artist but allows to configure grouping 
     ([screenshot1][mediamonkey_config]). On defaults it's a **Fail** but the
     configuration options make it a **Pass**.
     [screenshot2][mediamonkey_configured]) 
6. [Songbird][songbird_w] ([screenshot0][songbird])
   : Again: defaults to grouping by Artist and again give us option to change 
     it in it's configuration ([screenshot1][songbird_config], 
     [screenshot2][songbird_configured]). **Passed**
7. [Nightingale][night_w] ([screenshot0][nightingale]) 
   : Since it's a Songbird fork it behaves identically to it's original.
     ([screenshot1][nightingale_config], [screenshot2][nightingale_configured])
     **Passed**.

#### Players availble on Linux and Windows:

1. [Amarok 2.5][amarok_w] ([screenshot0][amarok])
   : Defaults to grouping by Artist but allows for configuration 
     ([screenshot1][amarok_config], [screenshot2][amarok_configured]). 
     **Passed**.
2. [Clementine][clementine_w] ([screenshot][clementine])
   : Amarok 1.5 ported to qt4 and stripped off KDE integration. Works same as 
     Amarok, defaulting to grouping by Artist, but allows configuration 
     ([screenshot1][clementine_config1], [screenshot2][clementine_config2], 
     [screenshot3][clementine_configured]). **Passed**.

#### Players for Linux:

1. [Banshee][banshee_w] ([screenshot0][banshee])
   : Defaults to grouping by Artist but allows configuration 
     ([screenshot1][banshee_config], [screenshot2][banshee_configured]). 
     **Passed**.  
2. [Bluemindo][bluemindo_w]
   : **Not starting** for me on ubuntu VM, so *??* 
3. [cmus][cmus_2] ([screenshot][cmus]).
   : Nice player for CLI. Groups by Album Artist. **Passed**.  
4. [Decibel Media Player][decibel_w] ([screenshot][decibel]).
   : Groups by Album Artist. **Passed**.
5. [Exaile][exaile_w] ([screenshot][exaile])
   : groups by Artist and does not allow for any kind of configuration. Can show 
     compilations as "Various Artist" field, but still **Fail**.  
6. [gmusicbrowser][gmusicbrowser_w] ([screenshot0][gmusicbrowser]) 
   : defaults to grouping by Artist but allows configuration 
     ([screenshot1][gmusicbrowser_config],
      [screenshot2][gmusicbrowser_configured]). **Passed**.  
7. [Goggles Music Manager][gogglesmm_w] ([screenshot][gogglesmm])
    : Groups by Album Artist. **Passed**.  
8. [Guaydeque Music Player][guayadeque_w] ([screenshot0][guayadeque])
   : defaults to grouping by Artist but allows configuration
     ([screenshot1][guayadeque_config], [screenshot2][guayadeque_configured]).
     **Passed**.  
9. [Jajuk][jajuk_w] ([screenshot][jajuk])
   : groups by Artist and does not allow any kind of configuration. **Failed**.  
10. [JuK][juk_w] ([screenshot][juk])
    : In tree view mode groups tracks by Artist. No configuration options. 
      **Failed**.
11. [Listen Music Player][listen_2] ([screenshot][listen])
    : groups by Artist and does not allow any kind of configuration. **Failed**.  
12. [Miro][miro_2] ([screenshot][miro])
    : This one is particular. It does not group media in it's library at all. 
      Displays them as single files allowing only different sorting options. 
      **Failed**.  
13. [Musique][musique_w] ([screenshot][musique])
    : I don't  know... Seems it groups by Artist tag and shows only the artists 
      that it can find on last.fm. I'm at loss what to think about this one, but
      certainly it's a **Fail**
14. [pytone][pytone_w]
    : **Does not start**. It has started once but was unresponsive. I couldn't 
      test it, but from what I've seen it defaults to grouping by Artist tag. 
      **Failed** 
15. [Quod Libet][quod_w] ([screenshot][quodlibet])
    : Groups by Artist and does not allow any kind of configuration. **Failed**.
16. [Rhythmbox][rhythm_w] ([screenshot][rhythmbox])
    : groups by Artist and does not allow any kind of configuration. **Failed**.

#### XMMS2 Clients:

1. [Abraca][abraca_w] 
   : Hard fail. It seems that is has some sort of library, but don't use it. 
     **Failed**.
2. [Esperanza][esperanza_w] ([screenshot][esperanza])
   : groups by Artist and does not allow any kind of configuration. **Failed**.
3. [gxmms2][gxmms2_w]
   : Same as above. **Failed**.

Little note here: XMMS2 clients suck hard. They don't work as they should IMHO.

#### MPD clients:

1. [Ario][ario_w] ([screenshot0][ario])
   : Defaults to grouping by Artist but allows configuration
     ([screenshot1][ario_config], [screenshot2][ario_configured]). **Passed**.

2. [gimmix][gimmix_w] ([screenshot][gimmix])
   : Groups library tracks by Album. Does not allow grouping by Artist.
     I can't imagine finding anything in a bigger library like this. **Failed**.

3. [Gnome Music Player Client][gmpc_w] ([screenshot][gmpc])
   : groups by Artist. Theoretically it hase option for configuring this in it's
     Preferences, but it does not work. Button that should allow you to chhose
     what field you want to add to grouping options by default adds "artist" and
     refuses to add anything else. Broken. **Failed**.  

4. [mpc][mpc_w] ([screenshot][mpc])
   : groups library tracks by Album. **Failed**.  

5. [ncmpc][ncmpc_w] ([screenshot][ncmpc]) 
   : groups by Artist and does not allow any kind of configuration. **Failed**.  

6. [ncmpcpp][ncmpcpp_w] ([screenshot0][ncmpcpp]). 
   : Defaults to grouping by Artist but allows configuration 
     ([screenshot1][ncmpcpp_config], [screenshot2][ncmpcpp_configured]).
     Personally I think it's the best MPD client. **Passed**.  

7. [pygmy][pygmy_w] ([screenshot][pygmy]) 
   : groups library tracks by Album. **Failed**.  

8. [QMPDClient][qmpdc] ([screenshot][qmpdclient]) 
   : groups by Artist and does not allow any kind of configuration. **Failed**.

9. [sonata][sonata_w] ([screenshot][sonata]) 
   : groups library tracks by Album. **Failed**.  

10. [xfmpc][xfmpc_w] ([screenshot][xfmpc]) 
    : groups library tracks by Album.  **Failed**.

#### Conclusion: 

Not much to say here, the tests results are clear. 16 players from pool of 38
passed. The stuation on windows is good (7 of 8 passed) while on Linux not so
(10 of 31 passes).

Personally I've decded to manually keep my Library sorted using 
`Album Artist/Year - Album/Disk Number Track - Title.extension` scheme. 
For my anime music collection I'll use `Anime'/Anime Title/Year - Album/Disk 
Number Track - Title.extension` and for soundtracks `Soundtrack/Year - Album/Disk
Number Track - Title.extension` scheme. It should keep my library clean and fast
for browsing. And I won't need to worry about the id3 tags correctness 
anymore[^6]. As player I'll use Mpxplay on windows (built in directory browsing
rules!) and mocp or MPD+ncmpcpp[^7] on linux.

##### Footnotes:

[^1]: So nothing like hour-long waits because player is parsing library or no
      major hangups. Yes I'm looking at you Songbird.

[^2]: I know that there may be others. I think i've even tried some, but
      everything except iTunes suck in this.

[^3]: Don't ask, I don't remember atm.

[^4]: I know, windows is 3vil, but I can't use linux on my laptop because of
      overheating problems.

[^5]: Nice player for dos with ncurses-like interface. Really fast and simple.
      Naturally it doesn't have library, but I decided to manage this myself.

[^6]: But probably I'll still spend hours completing and correcting them

[^7]: Id3 tag correctness will be required.

[aimp_w]: http://aimp.ru/index.php 
[atunes_w]: http://www.atunes.org/
[itunes_w]: http://www.apple.com/itunes/ 
[saw_w]: http://sawplayer.barell.org/
[mediamonkey_w]: http://www.mediamonkey.com/ 
[songbird_w]: http://getsongbird.com/
[night_w]: http://getnightingale.com/ 
[amarok_w]: http://amarok.kde.org/
[clementine_w]: http://www.clementine-player.org/ 
[banshee_w]: http://banshee.fm/
[bluemindo_w]: http://bluemindo.codingteam.net/
[cmus_2]: http://cmus.sourceforge.net/ 
[decibel_w]: http://decibel.silent-blade.org/
[exaile_w]: http://www.exaile.org/ 
[gmusicbrowser_w]: http://gmusicbrowser.org/
[gogglesmm_w]: http://code.google.com/p/gogglesmm/
[guayadeque_w]: http://sourceforge.net/projects/guayadeque/
[jajuk_w]: http://jajuk.info/index.php/Main_Page
[juk_w]: http://www.kde.org/applications/multimedia/juk/
[listen_2]: http://www.listen-project.org/ 
[miro_2]: http://www.getmiro.com/
[musique_w]: http://flavio.tordini.org/musique
[pytone_w]: http://www.luga.de/pytone/ 
[quod_w]: http://code.google.com/p/quodlibet/
[rhythm_w]: http://projects.gnome.org/rhythmbox/ 
[abraca_w]: http://abraca.xmms.se/
[esperanza_w]: http://xmms2.org/wiki/Client:Esperanza
[gxmms2_w]: http://wejp.k.vu/projects/xmms2/gxmms2
[ario_w]: http://ario-player.sourceforge.net/ 
[gimmix_w]: http://gimmix.berlios.de/
[gmpc_w]: http://gmpclient.org/ 
[mpc_w]: http://mpd.wikia.com/wiki/Client:Mpc
[ncmpc_w]: http://mpd.wikia.com/wiki/Client:Ncmpc
[ncmpcpp_w]: http://unkart.ovh.org/ncmpcpp/ 
[pygmy_w]: http://pygmy.berlios.de/
[qmpdc]: http://bitcheese.net/wiki/QMPDClient/ 
[sonata_w]: http://sonata.berlios.de/
[xfmpc_w]: http://goodies.xfce.org/projects/applications/xfmpc

[aimp]: http://i.imgur.com/6pdtsJl.png
[amarok]: http://i.imgur.com/AMYjUph.png
[amarok_config]: http://i.imgur.com/xrVsf8b.png
[amarok_configured]: http://i.imgur.com/LJHYJW0.png
[ario]: http://i.imgur.com/sJfDuC7.png
[ario_config]: http://i.imgur.com/kRvh4Xv.png
[ario_configured]: http://i.imgur.com/kk2HMyg.png
[atunes]: http://i.imgur.com/PNj2dB5.png
[banshee]: http://i.imgur.com/KE4QQeT.png
[banshee_config]: http://i.imgur.com/jA5hP19.png
[banshee_configured]: http://i.imgur.com/9BF5qFo.png
[clementine]: http://i.imgur.com/BjnUy8W.png
[clementine_config1]: http://i.imgur.com/sboliwJ.png
[clementine_config2]: http://i.imgur.com/sAdUCBG.png
[clementine_configured]: http://i.imgur.com/pRPKyRA.png
[cmus]: http://i.imgur.com/aagcofi.png
[decibel]: http://i.imgur.com/kF00n0t.png
[esperanza]: http://i.imgur.com/Qyi92fL.png
[exaile]: http://i.imgur.com/6wIGYOo.png
[gimmix]: http://i.imgur.com/G0Vqhkp.png
[gmusicbrowser]: http://i.imgur.com/M67zgWW.png
[gmusicbrowser_config]: http://i.imgur.com/FhAA6UX.png
[gmusicbrowser_configured]: http://i.imgur.com/ZQBE629.png
[gmpc]: http://i.imgur.com/DgGZQ9W.png
[gogglesmm]: http://i.imgur.com/X5Z7qIC.png
[guayadeque]: http://i.imgur.com/huQ7ar2.png
[guayadeque_config]: http://i.imgur.com/rKimbD4.png
[guayadeque_configured]: http://i.imgur.com/rKimbD4.png
[itunes]: http://i.imgur.com/n32pAIR.png
[jajuk]: http://i.imgur.com/3bus3gF.png
[juk]: http://i.imgur.com/WqF30e5.png
[listen]: http://i.imgur.com/QuEiPzR.png
[mediamonkey]: http://i.imgur.com/u30iYvX.png
[mediamonkey_config]: http://i.imgur.com/nZyeiEO.png
[mediamonkey_configured]: http://i.imgur.com/R2JppxR.png
[miro]: http://i.imgur.com/dRgOcCI.png
[musique]: http://i.imgur.com/HYikafX.png
[mpc]: #
[ncmpc]: http://i.imgur.com/iLVVAmk.png
[ncmpcpp]: http://i.imgur.com/XECpmMa.png
[ncmpcpp_config]: http://i.imgur.com/8lJSXaU.png
[ncmpcpp_configured]: http://i.imgur.com/rSQnQJk.png
[nightingale]: http://i.imgur.com/jAqnuqW.png
[nightingale_config]: http://i.imgur.com/OcYTl3a.png
[nightingale_configured]: http://i.imgur.com/ZCiqYKP.png
[pygmy]: http://i.imgur.com/3ZcfBbI.png
[qmpdclient]: http://i.imgur.com/cbHDdTv.png
[quodlibet]: http://i.imgur.com/O5qZsVv.png
[rhythmbox]: http://i.imgur.com/FsApqDp.png
[saw_album]: http://i.imgur.com/WtE97AD.png
[saw_artist]: http://i.imgur.com/h3O4HTB.png
[sonata]: http://i.imgur.com/5VBebd3.png
[songbird]: http://i.imgur.com/YjolQuT.png
[songbird_config]: http://i.imgur.com/oKZyYWN.png
[songbird_configured]: http://i.imgur.com/ovMnaVy.png
[xfmpc]: http://i.imgur.com/l1hkr9y.png
