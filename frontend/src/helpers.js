// helper functions


// changes date format from iso
function changeDateFormat(isoDate){
    let d = new Date(isoDate);
    let newDate = d.toLocaleString(undefined, {
        day:    'numeric',
        month:  'long',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
    });
    return newDate;
}

// remove possible html tags
function removeHtml(str){
    let cleanText = str.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanText;
}

export {changeDateFormat, removeHtml}