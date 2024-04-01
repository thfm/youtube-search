let searchbarElement = document.getElementById('searchbar');

searchbarElement.addEventListener('input', function(event) {
    let youtubeScriptElement = document.getElementById('youtubeScript');
    let parentElement = youtubeScriptElement.parentElement;

    youtubeScriptElement.remove();
    youtubeScriptElement = document.createElement('script');
    youtubeScriptElement.src = suggestionsURLForQuery(searchbarElement.value);
    youtubeScriptElement.id = 'youtubeScript';

    parentElement.appendChild(youtubeScriptElement);
});

searchbarElement.addEventListener('keypress', function(event) {
    if(event.key !== 'Enter') return;
    window.location.href = searchResultsURLForQuery(searchbarElement.value);
});

let suggestionsURLForQuery = function(query) {
    let encoded = encodeURIComponent(query);
    return `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encoded}`;
};

let searchResultsURLForQuery = function(query) {
    let encoded = encodeURIComponent(query);
    return `https://youtube.com/results?search_query=${encoded}`;
};

window.google = {};
window.google.ac = {};
window.google.ac.h = function(rawResponse) {
    let parsedResponse = parseYouTubeAPIResponse(rawResponse)

    let suggestionsElement = document.getElementById('suggestions');
    let parentElement = suggestionsElement.parentElement;
    suggestionsElement.remove();
    suggestionsElement = document.createElement('ol');
    suggestionsElement.id = 'suggestions';

    parentElement.appendChild(suggestionsElement);

    if(parsedResponse.query === '') return;

    parsedResponse.suggestions.forEach(suggestion => {
        let itemElement = document.createElement('li');
        itemElement.appendChild(document.createTextNode(suggestion));
        suggestionsElement.appendChild(itemElement);
    });
}

let parseYouTubeAPIResponse = function(response) {
    let [query, suggestionsData] = response;
    let suggestions = suggestionsData.map(suggestion => suggestion[0]).slice(0, 6);

    return { query, suggestions };
};
