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

SearchTwitter.vent = _.extend({}, Backbone.Events);
	
SearchTwitter.TweetListView = Backbone.View.extend({
	template: '#tweet',
	id: 'tweets',
	initialize: function() {
		this.template = $(this.template);
		_.bindAll(this, 'renderTweet');
		this.collection.bind('add', this.renderTweet, this);
		this.collection.bind('reset', this.clearTweets, this);
	},
	
	renderTweet: function(tweet) {
		var html = _.template(this.template.html(), tweet.toJSON());
		$(this.el).append(html);
	},
	
	render: function() {
		this.clearTweets();
		this.collection.each(this.renderTweet);
	},
	
	clearTweets: function() {
		$(this.el).html('');
	}
});
	
SearchTwitter.SearchTwitterView = Backbone.View.extend({
	template: '#search-twitter-form',
	events: {
		'submit form': 'searchTwitter',
		'change input': 'searchTermChanged'
	},
	
	initialize: function() {
		_.bindAll(this, 'searchTwitter');
	},
	
	searchTermChanged : function(e) {
		var value = $(e.currentTarget).val();
		this.model.set({searchTerm: value});
	},
	
	searchTwitter : function() {
		var twitterSearchUrl = 'http://search.twitter.com/search.json?q=';
		var searchTerm = this.model.get('searchTerm');
		if (searchTerm) {
			$.getJSON(twitterSearchUrl + encodeURIComponent(searchTerm) + '+exclude:retweets&callback=?', function(data) {
				SearchTwitter.vent.trigger('tweetsFound', data, searchTerm);
			});
		}
		return false;		
	},
	
	render: function() {
		var html = _.template($(this.template).html());
		$(this.el).html(html);
	}
});

SearchTwitter.Router = Backbone.Router.extend({
	routes: {
		"searchTwitter/:searchTerm" :  "searchTwitter"
	},
	
	searchTwitter: function(searchTerm) {
		var modelForTwitterSearch = new SearchTwitter.SearchTerm({ searchTerm: searchTerm});
		new SearchTwitter.SearchTwitterView({ model: modelForTwitterSearch});
	}
});

(function($) {
    var searchTerm = new SearchTwitter.SearchTerm();
	var tweets = new SearchTwitter.TweetCollection();
	var searchTwitter = new SearchTwitter.SearchTwitterView({ model: searchTerm });
	searchTwitter.render();
	
	var tweetListView = new SearchTwitter.TweetListView({collection: tweets});
	
	SearchTwitter.vent.bind('tweetsFound', function(data, searchTerm) {
		var tweetsFound = new SearchTwitter.TweetCollection();
		router.navigate("SearchTerm/" + searchTerm);
		for (var tweet in data.results) {
			tweetsFound.add(data.results[tweet]);
		} 
		tweetListView.collection = tweetsFound;
		tweetListView.render();
		$(tweetListView.el).appendTo($('div.container'));
	});
	
	$(searchTwitter.el).appendTo($('div.container'));
	
	var router = new SearchTwitter.Router();
	
	Backbone.history.start();
})(jQuery);