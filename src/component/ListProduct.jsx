import React from "react";

const ProductCard = ({ title, price, imageUrl }) => {
  return (
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
        src={imageUrl}
        alt={title}
        style={{
          width: "280px",
          height: "280px",
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
  );
};

export default ProductCard;
