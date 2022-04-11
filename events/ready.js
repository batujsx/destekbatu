const chalk = require('chalk');
const moment = require('moment');


module.exports = client => {
var oyun = [
        `www.SunucuİP.com`
    ];

    setInterval(function() {

        var random = Math.floor(Math.random()*(oyun.length-0+1)+0);

        client.user.setActivity(oyun[random], "" );
      }, 2 * 1000);
  
  client.user.setStatus("dnd");
}; 