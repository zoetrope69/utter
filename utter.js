require('dotenv').load();

var telegram = require('node-telegram-bot-api');
var request  = require('request');
var stripEmoji = require('emoji-strip');
var voices = require('./voices');

var headers = {
  'Pragma': 'no-cache',
  'Origin': 'https://acapela-box.com',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Cache-Control': 'no-cache',
  'X-Requested-With': 'XMLHttpRequest',
  'Connection': 'keep-alive',
  'Referer': 'https://acapela-box.com/AcaBox/index.php',
  'DNT': '1',
  'Cookie': '__utmt=1; __utma=221195784.1138614722.1462405107.1462405107.1462405107.1; __utmb=221195784.4.10.1462405107; __utmc=221195784; __utmz=221195784.1462405107.1.1.utmcsr=acapela-box.com|utmccn=(referral)|utmcmd=referral|utmcct=/AcaBox/index.php; acabox=vom76tou4nca012k3g317d3k71'
};

var bot = new telegram(process.env.TELEGRAM_TOKEN, { polling: true });

console.log('utter started!');

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getRandomVoice(voices) {
  return voices[Math.floor(Math.random() * voices.length)];
}

// matches /utter
bot.onText(/\/(utter) (.+)/, function (message, match) {
  console.log('/utter');

  var chatId = message.chat.id;
  var text = match[2].trim();

  console.log('Text sent to utter: ', text);

  if (!text || text.length <= 0) {
    return bot.sendMessage(chatId, '✋ You need to add some text...');
  }

  // send message that it's upping some audio
  bot.sendChatAction(chatId, 'upload_audio');

  var voice = 'will22k',
      speed = 180, // 120 - 240 | Default: 180
      pitch = 100; // 85 - 115 | Default: 100

  // if there's a flag set the relevant voice
  if ( text.indexOf('🇺🇸') !== -1 ) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'en-US')).id;
  } else if ( text.indexOf('🇯🇵') !== -1 || text.indexOf('🗾') !== -1 ) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'ja-JP')).id;
  } else if ( text.indexOf('🇨🇳') !== -1 ) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'zh-CN')).id;
  } else if ( text.indexOf('🇰🇷') !== -1 ) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'ko-KR')).id;
  } else if ( text.indexOf('🇨🇦') !== -1 || text.indexOf('🍁') !== -1 ) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'fr-CA')).id;
  } else if ( text.indexOf('🇧🇷') !== -1) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'pt-BR')).id;
  } else if ( text.indexOf('🇵🇹') !== -1) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'pt-PT')).id;
  } else if ( text.indexOf('🇪🇸') !== -1) {
    voice = getRandomVoice(voices.filter(voice => voice.lang === 'es-ES')).id;
  }

  // if its the crown, pound note or guard then it's the queen voice
  if (text.indexOf('👑') !== -1 || text.indexOf('💷') !== -1 || text.indexOf('💂') !== -1) {
    voice = voices.filter(voice => voice.special === 'thequeen')[0].id;
  }

  // if we get the scary masks use the bad guy voice
  if (text.indexOf('👺') !== -1 || text.indexOf('👹') !== -1) {
    voice = voices.filter(voice => voice.special === 'badguy')[0].id;
  }

  // if we get the old man then use the old man voice
  if (text.indexOf('👴') !== -1) {
    voice = voices.filter(voice => voice.special === 'oldman')[0].id;
  }

  // if we get the dragons or frog then use the yoda voice
  if (text.indexOf('🐲') !== -1 || text.indexOf('🐉') !== -1 || text.indexOf('🐸') !== -1) {
    voice = voices.filter(voice => voice.special === 'yoda')[0].id;
  }

  // check for snail or rabbit emoji for speeds
  if ( text.indexOf('🐇') !== -1 || text.indexOf('🐰') !== -1) {
    speed = 260;
  } else if ( text.indexOf('🐌') !== -1 ) {
    speed = 100;
  }

  // check for arrows for pitches
  if ( text.indexOf('⬆') !== -1 || text.indexOf('🔼') !== -1 || text.indexOf('⏫') !== -1 || text.indexOf('⤴️') !== -1) {
    pitch = 115;
  } else if ( text.indexOf('⬇') !== -1 || text.indexOf('🔽') !== -1 || text.indexOf('⏬') !== -1 || text.indexOf('⤵️') !== -1) {
    pitch = 85;
  }

  // add sloppy
  if ( text.indexOf('💦') !== -1 ) {
    text = text.split(" ").map(function(word) {
      if ((Math.ceil(Math.random() * 5)) % 5 === 0) {
        return "sloppy " + word;
      }

      // if no sloppy just return
      return word;
    }).join(" ");
  }

  // woll smoth
  if ( text.indexOf('😮') !== -1 ) {
    // replace all vowels with o
    text = replaceAll(text, '[aeiou]+', 'o');
  }

  // remove emojis
  text = stripEmoji(text);

  // uri encode
  text = encodeURIComponent(text);

  console.log(speed);
  console.log(text.indexOf('⬇') !== -1);
  console.log(pitch);

  var dataString = `text=%5Cvct%3D${pitch}%5C%20%5Cspd%3D${speed}%5C ${text}&voice=${voice}&listen=1&format=MP3&codecMP3=1&spd=${speed}&vct=${pitch}`;

  var options = {
    url: 'https://acapela-box.com/AcaBox/dovaas.php',
    method: 'POST',
    headers: headers,
    body: dataString
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);
      var url = result.snd_url;
      console.log(url);
      bot.sendVoice(chatId, request(url));
    }
  });

});
