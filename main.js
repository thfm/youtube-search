const maxSuggestionCount = 6;
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

    currentSelectedSuggestion = -1;
});

searchbarElement.addEventListener('keydown', event => {
    let suggestionsElement = document.getElementById('suggestions');
    if(suggestionsElement === null) return;

    let itemElements = Array.from(suggestionsElement.children);

    if(event.key === 'Enter') {
        if(currentSelectedSuggestion === -1) {
            window.location.href = searchResultsURLForQuery(searchbarElement.value);
        } else {
            let selectedItemElement = itemElements[currentSelectedSuggestion];
            window.location.href = searchResultsURLForQuery(selectedItemElement.textContent);
        }
    } else if(event.key === 'ArrowUp') {
        event.preventDefault();
        currentSelectedSuggestion--;
        if(currentSelectedSuggestion <= -2) {
            currentSelectedSuggestion = itemElements.length - 1;
        }
        updateItemElementClasses(suggestionsElement);
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        currentSelectedSuggestion++;
        if(currentSelectedSuggestion >= itemElements.length) {
            currentSelectedSuggestion = -1;
        }
        updateItemElementClasses(suggestionsElement);
    } else if(event.key == 'Escape') {
        currentSelectedSuggestion = -1;
        updateItemElementClasses(suggestionsElement);
    }
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
    let parsedResponse = parseYouTubeAPIResponse(rawResponse);

    let suggestionsElement = document.getElementById('suggestions');
    if(suggestionsElement !== null) suggestionsElement.remove();

    if(parsedResponse.query === '' || parsedResponse.suggestions.length === 0) return;

    suggestionsElement = document.createElement('ol');
    suggestionsElement.id = 'suggestions';

    for(let suggestion of parsedResponse.suggestions) {
        let itemElement = document.createElement('li');
        itemElement.textContent = suggestion;
        suggestionsElement.appendChild(itemElement);
    };

    let interfaceElement = document.getElementById('interface');
    interfaceElement.appendChild(suggestionsElement);
};

let parseYouTubeAPIResponse = response => {
    let [query, suggestionsData] = response;
    let suggestions = suggestionsData.map(suggestion => suggestion[0]).slice(0, maxSuggestionCount);

    return { query, suggestions };
};

let updateItemElementClasses = suggestionsElement => {
    for(let [index, itemElement] of Array.from(suggestionsElement.children).entries()) {
        itemElement.className = (index == currentSelectedSuggestion) ? 'selected' : '';
    }
};
