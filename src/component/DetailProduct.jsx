import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setProduct(data);
        } else {
          setError("Produit non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="container">
      <h1>Détails du Produit</h1>
      <Link to="/">
        <button
          className="back-button"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "5%",
          }}
        >
          Retour à l'accueil
        </button>
      </Link>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {product && (
        <div className="product-detail" style={{ padding: "20px" }}>
          <div className="product-card">
            <img
              src={product.img_url}
              alt={product.title || "Product image"}
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                marginBottom: "20px",
              }}
            />
            <h2 style={{ color: "#000" }}>{product.title || "Sans titre"}</h2>
            <p style={{ color: "#000" }}>
              {product.description || "Aucune description disponible"}
            </p>
            <p style={{ color: "#000" }}>
              <strong>Date de sortie :</strong>{" "}
              {product.release_date
                ? new Date(product.release_date).toLocaleDateString()
                : "Date non disponible"}
            </p>
            <div
              style={{
                backgroundColor: "#007bff",
                padding: "10px 20px",
                borderRadius: "4px",
                display: "inline-block",
                marginTop: "20px",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold" }}>
                {product.price ? Number(product.price).toFixed(2) : "0.00"}€
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
