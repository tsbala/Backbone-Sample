(function($) {
	var options = {
		consumerKey: 'XZCxv4S5uh9B5DDpQS8g',
		consumerSecret: 'YeggmYQAPANS73GFEIwOyRnnEE1bhPXUtD3yPsbxA',
		callbackUrl: 'tsbala.github.com/Backbone-sample/'
	};
	
	var oAuth = OAuth(options);

	oAuth.get('https://twitter.com/oauth/request_token',
			  function(data) {
				console.dir(data);
			  },
			  function(data) {
				console.dir(data);
			  });

	var Tweet = Backbone.Model.extend({
		initialize: function() {
			console.log('initialize called');
			this.on('change', function() {
				console.log('model has changed');
			});
		}
	});
	
	var TweetCollection = Backbone.Collection.extend({
		model: Tweet
	});

	var tweet = new Tweet({text: 'This is a test tweet', handle: '@bala__iyer'});
	console.log(tweet.toJSON());
})(jQuery);