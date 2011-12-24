/*******************************************************************************
* Snarkles.Net Useless Binary Time (SNUBT)
* 
* ThinkGeek's Binary LED Clock... in JavaScript! 
* http://www.thinkgeek.com/cubegoodies/lights/59e0/
* 
* Author: snarkles - http://snarkles.net/ - scripts [at] snarkles [dot] net
* Date: 09-Mar-2004
*
* Feel free to use this on your site, but please leave these comments 
* in tact. Thanks. :)
*******************************************************************************/

  // Convert current time to binary 
  function binaryize() {
    resetPanel();
    var time = getCurrentTime();
    for (i = 1; i <= time.length; i++) {
      num = time.charAt(i - 1);
      for (j = 8; j >= 1; j = j / 2) {			
        if (num - j >= 0) {
          eval("document.images.C" + i + j + ".src = 'img/on.gif'");
          num = num - j;
        }
      }
    }
    updateClock();
  }

  // Reset panel so all images are off
  function resetPanel() {
    for (i = 0; i < document.images.length; i++) {
      document.images[i].src = "img/off.gif";
    }
  }

  // Get current time, return as 6-digit string: HHMMSS
  function getCurrentTime() {
    var now = new Date();
    var hours = zeropad(now.getHours());
    var minutes = zeropad(now.getMinutes());
    var seconds = zeropad(now.getSeconds());
    var time = hours + "" + minutes + "" + seconds;
    return time;
  }

  // Pad numbers < 10 with zeroes
  function zeropad(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  // Update the clock every second
  function updateClock() {
    setTimeout("binaryize()", 1000);
  }