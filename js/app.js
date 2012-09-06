var SearchTwitter = {};

SearchTwitter.Tweet = Backbone.Model.extend({
});

SearchTwitter.SearchTerm = Backbone.Model.extend({
	defaults: {
		searchTerm: ''
	}
});
	
SearchTwitter.TweetCollection = Backbone.Collection.extend({
});
	
SearchTwitter.TweetView = Backbone.View.extend({
	template: '#tweet',
	tagName: 'ul',
	initialize: function() {
		this.template = $(this.template);
		_.bindAll(this, 'renderTweet');
	},
	
	renderTweet: function(tweet) {
		var html = _.template(this.template.html(), tweet.toJSON());
		$(this.el).append(html);
	},
	
	render: function() {
		$(this.el).remove();
		$(this.el).addClass('pills');
		this.collection.each(this.renderTweet);
	}
});
	
SearchTwitter.SearchTwitterView = Backbone.View.extend({
	template: '#search-twitter-form',
	events: {
		'submit form': 'searchTwitter',
		'change input': 'searchTermChanged'
	},
	
	initialize: function() {
	},
	
	searchTermChanged : function(e) {
		var value = $(e.currentTarget).val();
		this.model.set({searchTerm: value});
	},
	
	searchTwitter : function() {
		var searchTerm = $('input').val();
		var twitterSearchUrl = 'http://search.twitter.com/search.json?q=';
	
		if (searchTerm) {
			$.getJSON(twitterSearchUrl + this.model.get('searchTerm') + '&callback=?', function(data) {
				this.collection = new SearchTwitter.TweetCollection(data.results);
				var tweetView = new SearchTwitter.TweetView({
					collection: searchResults,
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

(function($) {
    var searchTerm = new SearchTwitter.SearchTerm();
	var tweets = new SearchTwitter.TweetCollection();
	var searchTwitter = new SearchTwitter.SearchTwitterView({ model: searchTerm, collection: tweets });
	searchTwitter.render();
	$(searchTwitter.el).appendTo($('div.container'));
})(jQuery);