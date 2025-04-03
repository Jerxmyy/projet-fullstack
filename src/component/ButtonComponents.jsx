import React from "react";
import "./Buttons.css";

// Bouton de retour
export const BackButton = ({ children, onClick }) => {
  return (
    <button className="back-button" onClick={onClick}>
      {children}
    </button>
  );
};

// Choix edition (si dispo)
export const SelectionButton = ({ isSelected, onClick, children }) => {
  return (
    <button
      className={`selection-button ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// CTA Favoris/Wishlist
export const IconButton = ({ onClick, children }) => {
  return (
    <button className="icon-button" onClick={onClick}>
      {children}
    </button>
  );
};

// CTA Panier
export const PrimaryButton = ({ onClick, children }) => {
  return (
    <button className="primary-button" onClick={onClick}>
      {children}
    </button>
  );
};
