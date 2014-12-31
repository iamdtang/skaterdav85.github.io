function Autocomplete() {
	this.timeout = null;
}

Autocomplete.prototype.search = function(searchTerm) {
	var self = this;
	var deferred = new $.Deferred();

	if (this.timeout) {
    clearTimeout(this.timeout);
  }

  this.timeout = setTimeout(function() {
  	self.request(searchTerm).then(function(results) {
  		deferred.resolve(results);
  	});
  	self.timeout = null;
  }, 300);

  return deferred.promise();
};

function ItunesAutocomplete() {
	Autocomplete.apply(this, arguments);
}

ItunesAutocomplete.prototype = Object.create(Autocomplete.prototype);
ItunesAutocomplete.prototype.constructor = ItunesAutocomplete;

ItunesAutocomplete.prototype.request = function(searchTerm) {	
	var url = 'https://itunes.apple.com/search?' + $.param({
		term: encodeURIComponent(searchTerm)
	});

	url += '&callback=?';

	return $.getJSON(url).then(function(response) {
		return response.results;
	});
};


var itunesAutocomplete = new ItunesAutocomplete();

$('input').on('keyup', function() {
	var searchTerm = this.value;

	itunesAutocomplete.search(searchTerm).then(function(results) {
		console.log(results);
	});
});