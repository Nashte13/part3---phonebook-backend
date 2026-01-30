import React from 'react';
const Filter = ({searchQuery, handleSearchChange}) => {
    return (
        <div>
            filter shown with:{" "}
            <input value={searchQuery} onChange={handleSearchChange} />
        </div>

    );
};
export default Filter;