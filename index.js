var telegram = require('node-telegram-bot-api'),
    giphy    = require('giphy')(process.env.GIPHY_API_KEY),
    request  = require('request');

var bot = new telegram(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', function(message){

  var chatId = message.chat.id;
  var arguments = message.text.split(' ');
  var command = arguments[0].substring(1);
  var searchTerms = arguments.splice(1).join(' ').toLowerCase();

  var giphyRatings = ['y', 'g', 'pg', 'pg-13', 'r'];
  var giphyRating = giphyRatings[1];

  if (command === 'gifxxx') {
    giphyRating = giphyRatings[4];

    bot.sendMessage(chatId, "🚨 WARNING " + message.from.first_name.toUpperCase() + " THE GOBLIN HAS GONE XXX 🚨");
  }

  console.log(message);
  // console.log(command);
  // console.log(searchTerms);

  if (searchTerms.length <= 0) {
    // send back error
    bot.sendMessage(chatId, "Ya didn't give a keyword son.");
    return false;
  }

  // send message that it's upping a photo
  bot.sendChatAction(chatId, 'upload_photo');

  giphy.search({ q: searchTerms, rating: giphyRating }, function(err, search, res) {
    if (err) {
      console.log('Error ', err);
      bot.sendMessage(chatId, "Giphy is fucked");
      return false;
    }

    if (!search.data || typeof search.data === 'undefined' || search.data.length <= 0) {
      // send back error saying no image avail
      bot.sendMessage(chatId, ":dog: No images with them keywords son.");
      return false;
    }

    // get random image
    var randMin = 0;
    var randMax = search.data.length - 1;
    var randomIndex = Math.floor(Math.random() * (randMax - randMin + 1)) + randMin;

    var imageUrl = search.data[randomIndex].images.fixed_width_downsampled.url;

    bot.sendDocument(chatId, request(imageUrl))
      .catch(function (err) {
        if (err) {
          // send message saying it didn't work
          console.log('Error ', err);
          bot.sendMessage(chatId, "Something went wrong sending yo the goods");
          return false;
        }
      });

  });

});
