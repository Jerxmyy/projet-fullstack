import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import GameLibNavbar from "./NavBar";
import Lister from "./Lister";
import { BackButton } from "./ButtonComponents";

function PlatformProducts() {
  const { id_platforms } = useParams();
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
        flexDirection: "column",
        alignItems: "start",
        gap: "20px",
        backgroundColor: "#191F40",
      }}
    >
      <GameLibNavbar />
      <div style={{ paddingLeft: "20px" }}>
        <Link to="/">
          <BackButton>Accueil</BackButton>
        </Link>
      </div>
      <h1 style={{ paddingLeft: "40px" }}>
        Produits pour la plateforme {id_platforms.name}
      </h1>
      {products.length > 0 ? (
        <Lister products={products} />
      ) : (
        <p>Aucun produit trouvé pour cette plateforme.</p>
      )}
    </div>
  );
}

export default PlatformProducts;
