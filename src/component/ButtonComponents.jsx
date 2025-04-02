import React from "react";
// Coucou Richnouuu c'est externalisé !!

// CTA acceuil
export const BackButton = ({ children, onClick }) => {
  return (
    <button
      className="back-button"
      onClick={onClick}
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        position: "relative",
        zIndex: 2,
        margin: "20px",
      }}
    >
      {children}
    </button>
  );
};

// Choix Edition/Plateforme
export const SelectionButton = ({ isSelected, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 15px",
        backgroundColor: isSelected ? "#706ad5" : "#333",
        color: "white",
        border: isSelected ? "2px solid white" : "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

// CTA Fav/Whislist
export const IconButton = ({ onClick, children }) => {
  return (
    <button
      style={{
        padding: "10px",
        backgroundColor: "#706ad5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// CTA ajouter au panier
export const PrimaryButton = ({ onClick, children }) => {
  return (
    <button
      style={{
        flex: "1",
        padding: "10px 20px",
        backgroundColor: "#706ad5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
