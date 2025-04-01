import React from "react";
import { Link } from "react-router-dom";

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
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "translateY(-5px)")
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
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
          <div
            style={{
              backgroundColor: "#007bff",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold" }}>
              {price.toFixed(2)}€
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
