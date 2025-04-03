import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import GameLibNavbar from "./NavBar";
import Lister from "./Lister";
import { BackButton } from "./ButtonComponents";

function PlatformProducts() {
  const { id_platforms } = useParams();
  const [products, setProducts] = useState([]);
  const [platformName, setPlatformName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Récupérer les informations de la plateforme
        const { data: platformData, error: platformError } = await supabase
          .from("v_platforms_products")
          .select("name")
          .eq("id_platforms", id_platforms);

        if (platformError) throw platformError;

        // Si des données sont retournées, prendre le premier élément
        if (platformData && platformData.length > 0) {
          setPlatformName(platformData[0].name);
        }

        // Récupérer les produits
        const { data: productsData, error: productsError } = await supabase
          .from("v_products_platforms")
          .select("*")
          .eq("id_platforms", id_platforms);

        if (productsError) throw productsError;
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
        Jeux disponible pour {platformName || id_platforms}
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
