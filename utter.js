require('dotenv').load();

var telegram = require('node-telegram-bot-api'),
    request  = require('request'),
    stripEmoji   = require('emoji-strip');

var bot = new telegram(process.env.TELEGRAM_TOKEN, { polling: true });

console.log('utter started!');

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// matches /utter
bot.onText(/\/(utter) (.+)/, function (message, match) {
  console.log('/utter');

  var chatId = message.chat.id;
  var text = match[2];

  console.log('Text sent to utter: ', text);

  if (!text || text.trim().length <= 0) {
    bot.sendMessage(chatId, '✋ You need to add some text...');
    return false;
  }

  // send message that it's upping some audio
  bot.sendChatAction(chatId, 'upload_audio');

  var voices = [
    'usenglishfemale', 'usenglishfemale2', 'usenglishmale',
    'usenglishmale2', 'ukenglishfemale', 'ukenglishfemale2',
    'ukenglishmale', 'auenglishfemale', 'usspanishfemale',
    'usspanishmale', 'chchinesefemale', 'hkchinesefemale',
    'jpjapanesefemale', 'krkoreanfemale', 'caenglishfemale',
    'huhungarianfemale', 'brportuguesefemale', 'eurportuguesefemale',
    'eurportuguesemale', 'eurspanishfemale', 'eurspanishmale',
    'eurcatalanfemale', 'eurczechfemale', 'eurdanishfemale',
    'eurfinnishfemale', 'eurfrenchfemale', 'eurfrenchmale',
    'eurnorwegianfemale', 'eurdutchfemale', 'eurpolishfemale',
    'euritalianfemale', 'euritalianmale', 'eurturkishfemale',
    'eurturkishmale', 'eurgreekfemale', 'eurgermanfemale',
    'eurgermanmale', 'rurussianfemale', 'rurussianmale',
    'swswedishfemale', 'cafrenchfemale', 'cafrenchmale'
  ];

  var voice = 'ukenglishmale',
      speed = 0,
      pitch = 0;

  // if there's a flag set the relevant voice

  if ( text.indexOf('🇺🇸') !== -1 ) {
    voice = 'usenglishmale';
  } else if ( text.indexOf('🇯🇵') !== -1 || text.indexOf('🗾') !== -1 ) {
    voice = 'jpjapanesefemale';
  } else if ( text.indexOf('🇨🇳') !== -1 ) {
    voice = 'chchinesefemale';
  } else if ( text.indexOf('🇰🇷') !== -1 ) {
    voice = 'krkoreanfemale';
  } else if ( text.indexOf('🇨🇦') !== -1 || text.indexOf('🍁') !== -1 ) {
    voice = 'caenglishfemale';
  } else if ( text.indexOf('🇭🇺') !== -1) {
    voice = 'huhungarianfemale';
  } else if ( text.indexOf('🇧🇷') !== -1) {
    voice = 'brportuguesefemale';
  } else if ( text.indexOf('🇧🇷') !== -1) {
    voice = 'brportuguesefemale';
  } else if ( text.indexOf('🇵🇹') !== -1) {
    voice = 'eurportuguesefemale';
  } else if ( text.indexOf('🇪🇸') !== -1) {
    voice = 'eurspanishfemale';
  } else if ( text.indexOf('🇨🇿') !== -1) {
    voice = 'eurczechfemale';
  } else if ( text.indexOf('🇩🇰') !== -1) {
    voice = 'eurdanishfemale';
  } else if ( text.indexOf('🇫🇮') !== -1) {
    voice = 'eurfinnishfemale';
  } else if ( text.indexOf('🇫🇷') !== -1) {
    voice = 'eurfrenchfemale';
  } else if ( text.indexOf('🇳🇴') !== -1) {
    voice = 'eurnorwegianfemale';
  } else if ( text.indexOf('🇳🇱') !== -1) {
    voice = 'eurdutchfemale';
  } else if ( text.indexOf('🇵🇱') !== -1) {
    voice = 'eurpolishfemale';
  } else if ( text.indexOf('🇮🇹') !== -1) {
    voice = 'euritalianmale';
  } else if ( text.indexOf('🇹🇷') !== -1) {
    voice = 'eurturkishfemale';
  } else if ( text.indexOf('🇬🇷') !== -1) {
    voice = 'eurgreekfemale';
  } else if ( text.indexOf('🇩🇪') !== -1) {
    voice = 'eurgermanmale';
  } else if ( text.indexOf('🇷🇺') !== -1) {
    voice = 'rurussianfemale';
  } else if ( text.indexOf('🇸🇪') !== -1) {
    voice = 'swswedishfemale';
  }

  // check for snail or rabbit emoji for speeds
  if ( text.indexOf('🐇') !== -1 || text.indexOf('🐰') != -1) {
    speed = 5;
  } else if ( text.indexOf('🐌') != -1 ) {
    speed = -10;
  }

  // add sloppy
  if ( text.indexOf('💦') !== -1 ) {
    text = text.split(" ").map(function(word) {
      if ((Math.ceil(Math.random() * 5)) % 5 === 0) {
        return "sloppy " + word;
      }

      return word;
    }).join(" ");
  }

  if ( text.indexOf('😮') !== -1 ) {
    // replace all vowels with o
    text = replaceAll(text, '[aeiou]+', 'o');
  }

  var apiKey = '34b06ef0ba220c09a817fe7924575123';

  var url = 'https://api.ispeech.org/api/rest.mp3' +
            '?apikey=' + apiKey +
            '&action=convert' +
            '&voice=' + voice +
            '&speed=' + speed +
            '&pitch=' + pitch +
            '&text=' + stripEmoji(text);

  bot.sendVoice(chatId, request(url));
});
