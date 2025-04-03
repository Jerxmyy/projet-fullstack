import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import GameLibNavbar from "./NavBar";
import ProductCard from "./CardProduct";

function PlatformProducts() {
  const { id_platforms } = useParams(); // Récupère l'ID de la plateforme depuis l'URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("v_products_platforms")
          .select("*")
          .eq("id_platforms", id_platforms);

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [id_platforms]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-danger">Erreur: {error}</div>;

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        backgroundColor: "#191F40",
      }}
    >
      <GameLibNavbar></GameLibNavbar>
      <h1 className="platform-title">
        Produits pour la plateforme {id_platforms}
      </h1>
      {products.length ? (
        <div className="products-container">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id_products={product.id}
              title={product.title || "Sans titre"}
              price={Number(product.price) || 0}
              img_url={product.img_url}
            />
          ))}
        </div>
      ) : (
        <p>Aucun produit trouvé pour cette plateforme.</p>
      )}
    </div>
  );
}

export default PlatformProducts;
