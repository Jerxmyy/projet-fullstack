import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "./component/ListProduct";
import ProductDetail from "./component/DetailProduct";
import { supabase } from "./supabaseClient";
import GameLibNavbar from "./component/NavBar";
import PlatformProducts from "./component/PlatformProducts";

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
          backgroundColor: "#191F40",
        }}
      >
        <GameLibNavbar></GameLibNavbar>
        <h1 style={{ width: "100%", textAlign: "start", marginBottom: "30px" }}>
          Votre prochaine aventure commence ici !
        </h1>
        {products.length === 0 ? (
          <p>Aucun produit disponible</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id_products}
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
          <Route
            path="/product/platform/:id_platforms"
            element={<PlatformProducts />}
          />
          <Route path="/product/:id_products" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
