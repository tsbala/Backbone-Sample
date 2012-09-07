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
	
SearchTwitter.TweetListView = Backbone.View.extend({
	template: '#tweet',
	tagName: 'ul',
	initialize: function() {
		this.template = $(this.template);
		this.collection.bind('add', this.renderTweet, this);
		this.collection.bind('reset', this.clearTweets, this);
	},
	
	renderTweet: function(tweet) {
		var html = _.template(this.template.html(), tweet.toJSON());
		$(this.el).append(html);
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
		
	},
	
	searchTermChanged : function(e) {
		var value = $(e.currentTarget).val();
		this.model.set({searchTerm: value});
	},
	
	searchTwitter : function() {
		var searchTerm = $('input').val();
		var twitterSearchUrl = 'http://search.twitter.com/search.json?q=';
		var tweetCollection = this.collection;
		tweetCollection.reset();
		if (searchTerm) {
			$.getJSON(twitterSearchUrl + encodeURIComponent(this.model.get('searchTerm')) + '&callback=?', function(data) {
				for (var tweet in data.results) {
					tweetCollection.add(data.results[tweet]);
				} 
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
	var tweetListView = new SearchTwitter.TweetListView({ collection: tweets });
	var searchTwitter = new SearchTwitter.SearchTwitterView({ model: searchTerm, collection: tweets });
	searchTwitter.render();
	$(searchTwitter.el).appendTo($('div.container'));
	$(tweetListView.el).appendTo($('div.container'));
})(jQuery);