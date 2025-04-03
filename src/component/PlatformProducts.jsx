import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function PlatformProducts() {
  const { id_platforms } = useParams(); // Récupère l'ID depuis l'URL
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

        console.log(data);

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
    <div>
      <h1>Produits pour la plateforme {id}</h1>
      {products.length ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun produit trouvé pour cette plateforme.</p>
      )}
    </div>
  );
}

export default PlatformProducts;
