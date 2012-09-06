(function($) {
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
	
	var TweetView = Backbone.View.extend({
		template: '#tweet',
		
		initialize: function() {
			this.template = $(this.template);
			_.bindAll(this, 'renderTweet');
		},
		
		renderTweet: function(tweet) {
			var html = _.template(this.template.html(), tweet.toJSON());
			$(this.el).prepend(html);
		},
		
		render: function() {
			this.collection.each(this.renderTweet);
		}
	});
	
	var SearchTwitterView = Backbone.View.extend({
		template: '#search-twitter-form',
		events: {
			'submit form': 'searchTwitter'
		},
		
		searchTwitter : function() {
			console.log('in here');
			var searchTerm = $('input').val();
			var twitterSearchUrl = 'http://search.twitter.com/search.json?q=';
		
			if (searchTerm) {
				$.getJSON(twitterSearchUrl + searchTerm + '&callback=?', function(data) {
					searchResults = new TweetCollection(data.results);
					var tweetView = new TweetView({
						collection: searchResults 
					});
					
					tweetView.render();
					$(tweetView.el).appendTo($('div.container'));
				});
			}
			
			return false;		
		},
		
		render: function() {
			var html = _.template($(this.template).html());
			$(this.el).html(html);
		}
	});

	var searchTwitter = new SearchTwitterView();
	searchTwitter.render();
	$('div.container').html(searchTwitter.el);
})(jQuery);