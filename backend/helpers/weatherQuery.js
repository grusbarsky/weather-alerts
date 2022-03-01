// helper function to create a query string of weather related terms to get related articles from news api


function weatherTerms(){
    // an array of weather related terms to search by
    const weatherKeywords = ["weather", "natural", "disaster", "hurricane", "tornado", "tsunami", "cyclone", "snow", "storm", "evacuation", "earthquake", "wildfire", "drought", "flood", "mudslide", "hail"]
    // join by " OR " to match api syntax
    const joinKeywords = weatherKeywords.join(" OR ")
    // encode string for url
    let encoded = encodeURI(joinKeywords);
   
    return encoded;
}

module.exports = { weatherTerms };