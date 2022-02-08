// helper function to set todays date and date 7 days ago
// used for api news call

function getDates(){
    let todaysDate = new Date().toJSON().slice(0,10).replace(/-/g,'-');

    let date = new Date();
    date.setDate(date.getDate() - 7);

    let earliestDate = date.getFullYear()+'-'+ (date.getMonth()+1) +'-'+date.getDate();

    return{todaysDate, earliestDate}
}

module.exports = { getDates };