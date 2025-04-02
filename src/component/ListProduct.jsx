import React from "react";
import { Link } from "react-router-dom";

// Composant ProductCard -> carte cliquable
const ProductCard = ({ id_products, title, price, img_url }) => {
  return (
    <Link to={`/product/${id_products}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          width: "280px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          overflow: "hidden",
          transition: "transform 0.2s",
          flex: "0 0 auto",
        }}
        // hover
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "translateY(-5px)")
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {/* Image du produit */}
        <img
          src={img_url}
          alt={title}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Informations du produit */}
        <div style={{ padding: "10px" }}>
          <h6
            style={{
              color: "white",
              fontSize: "14px",
              marginBottom: "8px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h6>
          {/* Affichage du prix */}
          <div
            style={{
              backgroundColor: "#706ad5",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold" }}>{price}€</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
