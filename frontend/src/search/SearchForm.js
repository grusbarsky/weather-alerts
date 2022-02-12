import React, { useState, useEffect } from "react";

// show search form and pass props

function SearchForm({ onSearchSubmit, clearResults }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [updatedTerm, setUpdatedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(updatedTerm), 500);
    return () => clearTimeout(timer);
  }, [updatedTerm])

  useEffect(() => {
    if (searchTerm !== '') {
      onSearchSubmit(searchTerm);
    }
    else {
      clearResults();
    }
  }, [searchTerm]);

  return (
    <form className="d-flex justify-content-center pt-2 mt-3">
      <input
        className="form-control form-control-p-2 m-2 form-control-lg w-25"
        name="searchTerm"
        placeholder="Search"
        value={updatedTerm}
        onChange={e => setUpdatedTerm(e.target.value)}
      />
    </form>
  );
}

export default SearchForm;
