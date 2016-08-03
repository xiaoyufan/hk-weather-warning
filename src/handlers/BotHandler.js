var topics = ['current', 'warning'];

module.exports = function(bot, client) {
  bot.getMe().then(function(me) {
    console.info(me.username + " is listening!");
  });

  bot.on('inline_query', function(inlineQuery) {
    var id = inlineQuery.id;
    var query = inlineQuery.query;
    if (query === 'topics') {
      bot.answerInlineQuery(id, [{type: 'article', id: id, title: 'Topics', input_message_content: {message_text: 'current'}}]);
    }
  });
};
