import React from "react";
const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};
export default PersonForm;
