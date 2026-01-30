import { useState, useEffect } from "react";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import phonebookService from "./services/phonebook.js";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({message: null, type: null});

  //fetching data from json server
  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  console.log("render", persons.length, "persons");

  //handle input change
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  //handle number change
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  //searh change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  //handle form submission
  const addPerson = (events) => {
    events.preventDefault();
    //check duplicate ame
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );
      if (confirmUpdate) {
        updateContact(existingPerson.id);
        setNotification({message: `Updated ${newName}'s number`, type: 'success'});
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 3000);
      }
      return;
    }
    //sending data to server
    phonebookService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotification({message: `Added ${newName}`, type: 'success'});
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 3000);
      })
      .catch((error) => {
        console.error('Error adding contact;', error);
        setNotification({message: error.response.data.error, type: 'error'});
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 3000);
      });
  };

//handle update contact
  const updateContact = (id) => {
    const person = persons.find((p) => p.id === id);
    const changedPerson = {...person, number: newNumber};

    phonebookService
      .update(id, changedPerson)
      .then(returnedPerson => {
        if (!returnedPerson || !returnedPerson.id) {
          throw new Error('Contact not found on server server');
        }
        setPersons(persons.map(p => p.id !== id ? p : returnedPerson));
        setNotification({message: `Updated ${returnedPerson.name}'s number successfully`, type: 'success'});
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 3000);


      })
      .catch(error => {
        console.error('Error updating contact:', error);
        setNotification({message: `Information of ${person.name} has already been removed from server`, type: 'error'});
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 3000);
        setPersons(persons.filter((person) => person.id !== id));

      });
  };

   //handle delete contact
  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)) {
      console.log("Deleting contact with id:", id);
      console.log("Current persons:", persons);
      phonebookService
        .remove(id) //targeting the id of contact
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({message: `${persons.find(p => p.id === id).name} deleted successfully`, type: 'success'});
          setTimeout(() => {
            setNotification({message: null, type: null});
          }, 3000);
        })
        .catch((error) => {
          console.error('Error deleting contact:', error);
          alert('This contact was already removed. Refreshing the list...');
        });
    }
  };


  const contactsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <h2>PhoneBook</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        <Filter
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
      </div>
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons contactsToShow={contactsToShow} handleDelete={handleDelete} />
    </div>
  );
};
export default App;
