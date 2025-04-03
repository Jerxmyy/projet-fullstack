import React from "react";
import { Link } from "react-router-dom";
import "./ListProduct.css";

// Composant ProductCard -> carte cliquable
const ProductCard = ({ id_products, title, price, img_url }) => {
  return (
    <Link to={`/product/${id_products}`} className="product-card-link">
      <div className="product-card">
        {/* Image du produit */}
        <img src={img_url} alt={title} className="product-image" />
        {/* Informations du produit */}
        <div className="product-info">
          <h6 className="product-title">{title}</h6>
          {/* Affichage du prix */}
          <div className="product-price">
            <span>{price}€</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
