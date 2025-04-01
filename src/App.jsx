import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ProductCard from "./component/ListProduct";
import ProductDetail from "./component/DetailProduct";
// import SupabaseClient from "@supabase/supabase-js";

// Création du client Supabase
export const supabase = createClient(
  "https://qvonhyxawuzkqaaihsbs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b25oeXhhd3V6a3FhYWloc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NzMsImV4cCI6MjA1ODk4ODc3M30.T8_69hU42d03wlhhBo8VL4n2qSLxwQ87AIDg6xGksFw"
);

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*");

        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Page d'accueil qui affiche la liste des produits
  const HomePage = () => {
    if (loading) return <div>Chargement des produits...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <h1 style={{ width: "100%", textAlign: "start", marginBottom: "30px" }}>
          Jeux qui peuvent vous plaire : ({products.length})
        </h1>
        {products.length === 0 ? (
          <p>Aucun produit disponible</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id_products={product.id_products}
              title={product.title || "Sans titre"}
              price={Number(product.price) || 0}
              img_url={product.img_url}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id_products" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
