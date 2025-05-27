// context/UIContext.js
import React, { createContext, useReducer, useContext } from 'react';

const UIContext = createContext();

const initialState = { sidebarOpen: false, modalOpen: false };

function uiReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true };
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false };
    default:
      return state;
  }
}

export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
export const useUIActions = () => {
  const { dispatch } = useUI();
  return {
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    openModal: () => dispatch({ type: 'OPEN_MODAL' }),
    closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
  };
};