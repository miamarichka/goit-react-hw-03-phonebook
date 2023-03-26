import React from 'react';
import { Form } from './Form/Form';
import { Filter } from './Filter/Filter';
import { ContactsList } from './ContactList/ContactsList';

const STORAGE_KEY = 'contacts';

export class App extends React.Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contactsFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (contactsFromStorage) {
      this.setState({
        contacts: contactsFromStorage,
      });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.contacts));
    }
  }

  formSubmitHandler = data => {
    const { name, number } = data;
    this.checkNewContact(name, number);
  };

  checkNewContact = (name, number) => {
    const isContactNameExist = this.state.contacts.some(
      contact => contact.name === name
    );
    const isContactNumberExist = this.state.contacts.some(
      contact => contact.number === number
    );

    isContactNameExist
      ? alert(`${name} is already in contacts`)
      : isContactNumberExist
      ? alert(`${number} is already in contacts`)
      : this.addContact(name, number);
  };

  addContact = (contactName, contactNumber) => {
    const contact = {
      name: contactName,
      number: contactNumber,
    };
    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(
        contact => contactId !== contact.name
      ),
    }));
  };

  render() {
    const { filter, contacts } = this.state;
    const filteredConctacts = this.getFilteredContacts();

    return (
      <>
        <div className="container">
          <h1 className="phonebook__title title">PhoneBook</h1>
          <Form onSubmit={this.formSubmitHandler} />
          <h2 className="contact-list__title title">Contacts</h2>
          <Filter filter={filter} onChange={this.changeFilter} />
          {!!contacts.length && (
            <ContactsList
              contactsList={filteredConctacts}
              onDeleteContact={this.deleteContact}
            />
          )}
        </div>
      </>
    );
  }
}
