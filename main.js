const suggestionCount = 6;
let currentSelectedSuggestion = -1;

let searchbarElement = document.getElementById('searchbar');

searchbarElement.addEventListener('input', event => {
    let youtubeScriptElement = document.getElementById('youtubeScript');
    let parentElement = youtubeScriptElement.parentElement;

    youtubeScriptElement.remove();
    youtubeScriptElement = document.createElement('script');
    youtubeScriptElement.src = suggestionsURLForQuery(searchbarElement.value);
    youtubeScriptElement.id = 'youtubeScript';

    parentElement.appendChild(youtubeScriptElement);
});

searchbarElement.addEventListener('keydown', event => {
    let suggestionsElement = document.getElementById('suggestions');

    if(event.key === 'Enter') {
        if(currentSelectedSuggestion === -1) {
            window.location.href = searchResultsURLForQuery(searchbarElement.value);
        } else {
            let selectedSuggestionElement = Array.from(suggestionsElement.children)[currentSelectedSuggestion];
            window.location.href = searchResultsURLForQuery(selectedSuggestionElement.textContent);
        }
    } else if(event.key === 'ArrowUp') {
        event.preventDefault();
        currentSelectedSuggestion--;
        if(currentSelectedSuggestion <= -2) {
            currentSelectedSuggestion = suggestionCount - 1;
        }
        updateItemElementClasses(suggestionsElement);
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        currentSelectedSuggestion++;
        if(currentSelectedSuggestion >= suggestionCount) {
            currentSelectedSuggestion = -1;
        }
        updateItemElementClasses(suggestionsElement);
    }

    console.log(currentSelectedSuggestion);
});

let suggestionsURLForQuery = query => {
    let encoded = encodeURIComponent(query);
    return `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encoded}`;
};

let searchResultsURLForQuery = query => {
    let encoded = encodeURIComponent(query);
    return `https://youtube.com/results?search_query=${encoded}`;
};

window.google = {};
window.google.ac = {};
window.google.ac.h = rawResponse => {
    let parsedResponse = parseYouTubeAPIResponse(rawResponse)

    let interfaceElement = document.getElementById('interface');
    let suggestionsElement = document.getElementById('suggestions');

    if(suggestionsElement !== null) suggestionsElement.remove();
    if(parsedResponse.query === '') return;

    suggestionsElement = document.createElement('ol');
    suggestionsElement.id = 'suggestions';
    interfaceElement.appendChild(suggestionsElement);

    for(let [index, suggestion] of parsedResponse.suggestions.entries()) {
        suggestionsElement.appendChild(itemElementForSuggestion(suggestion, index));
    };
};

let parseYouTubeAPIResponse = response => {
    let [query, suggestionsData] = response;
    let suggestions = suggestionsData.map(suggestion => suggestion[0]).slice(0, suggestionCount);

    return { query, suggestions };
};

let itemElementForSuggestion = (suggestion, index) => {
    let itemElement = document.createElement('li');
    itemElement.textContent = suggestion;

    return itemElement;
};

let updateItemElementClasses = suggestionsElement => {
    for(let [index, itemElement] of Array.from(suggestionsElement.children).entries()) {
        itemElement.className = (index == currentSelectedSuggestion) ? 'selected' : '';
    }
};
