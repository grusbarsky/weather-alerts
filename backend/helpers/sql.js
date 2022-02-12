const { BadRequestError } = require("../expressError");


//  helper function to make selective update queries

//  creates the SET clause of an SQL UPDATE statement

//  params:
//  dataToUpdate:  {Object} {field1: newVal, field2: newVal, ...}
//  jsToSql: {Object} maps js-style data fields to database column names,
//    ex. { firstName: "first_name", age: "age" }

//  returns: {sqlSetCols, dataToUpdate}

//  ex. {firstName: 'John', lastName: Smith} =>
//       { setCols: '"first_name"=$1, "last_name"=$2',
//       values: ['John', "smith"] }

function partialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'John', lastName: "Smith"} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { partialUpdate };