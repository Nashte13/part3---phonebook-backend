import React from "react";
export default function Persons({ contactsToShow, handleDelete }) {
  return (
    <div>
      {contactsToShow.map((person) => (
        <p key={person.id}>
          {person.name}: {person.number}
          <button onClick={() => handleDelete(person.id)} >Delete</button>
        </p>
      ))}
    </div>
  );
}
