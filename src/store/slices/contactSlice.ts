import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '../../types';

interface ContactState {
  contacts: Contact[];
  selectedContact: string | null;
}

const initialState: ContactState = {
  contacts: [],
  selectedContact: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<Contact[]>) {
      state.contacts = action.payload;
    },
    
    addContact(state, action: PayloadAction<Contact>) {
      state.contacts.push(action.payload);
    },
    
    updateContact(state, action: PayloadAction<Contact>) {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    
    removeContact(state, action: PayloadAction<string>) {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
    
    setSelectedContact(state, action: PayloadAction<string | null>) {
      state.selectedContact = action.payload;
    },
  },
});

export const { setContacts, addContact, updateContact, removeContact, setSelectedContact } = contactSlice.actions;
export default contactSlice.reducer;