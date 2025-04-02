import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// Composant ProductDetail
// Affiche détails produit spécifique récupéré depuis BDD
// en utilisant l'ID fourni dans les paramètres d'URL

const ProductDetail = () => {
  const { id_products } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Edition sélectionnée
  const [selectedEdition, setSelectedEdition] = useState("Edition standard");
  // affichage de la popup
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Récupérer le produit de base
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id_products", id_products)
          .single();

        if (productError) throw productError;

        // Récupérer les plateformes associées
        const { data: platformsData } = await supabase
          .from("v_platforms_products")
          .select("*")
          .eq("id_products", id_products);

        // Récupérer les genres associés
        const { data: genresData } = await supabase
          .from("v_genres_products")
          .select("*")
          .eq("id_products", id_products);

        // Récupérer les éditeurs associés
        const { data: editorsData } = await supabase
          .from("v_editors_products")
          .select("*")
          .eq("id_products", id_products);

        // Combiner les données
        const data = {
          ...productData,
          platforms: platformsData,
          genres: genresData,
          editors: editorsData,
        };

        setProduct(data);
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id_products]);

  // Voir Pop up pendant 3 sec
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  // Changer d'édition
  const handleEditionChange = (e) => {
    setSelectedEdition(e.target.value);
  };

  // Ajout panier + Popup
  const handleAddToCart = () => {
    setShowPopup(true);
  };

  // Calcul du prix à afficher en fonction de l'édition
  const priceDeluxe = product
    ? selectedEdition === "Edition Deluxe" && product.price_deluxe
      ? product.price_deluxe
      : product.price
    : 0;

  // Rendu Visuel composant
  return (
    <div
      className="container"
      style={{ position: "relative", width: "100%", margin: 0, padding: 0 }}
    >
      {/* CTA pour retour acceuil */}
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
            position: "relative",
            zIndex: 2,
            margin: "20px",
          }}
        >
          Retour à l'accueil
        </button>
      </Link>

      {/* Popup d'ajout au panier */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px" }}>✓</span>
            <div>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Produit ajouté au panier
              </p>
              {product && (
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                  {product.title} ({selectedEdition})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* États de chargement et d'erreur */}
      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Affichage des détails du produit */}
      {product && (
        <>
          {/* Bg avec product.img_url */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${product.img_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "20px",
              color: "white",
            }}
          >
            {/* Info jeu */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                maxWidth: "1200px",
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              {/* Img jeu */}
              <div style={{ flex: "1", minWidth: "300px" }}>
                <img
                  src={product.img_url}
                  alt={product.title}
                  style={{
                    width: "300px",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Informations et actions pour le produit */}
              <div style={{ flex: "1", minWidth: "300px" }}>
                <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                  {product.title}
                </h1>

                {/* plateforme, stock + téléchargement */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontSize: "14px" }}>
                    <p>{product.platform}</p>
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    <p>
                      <b style={{ color: "#4CAF50" }}>✓</b> En stock
                    </p>
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    <p>
                      <b style={{ color: "#4CAF50" }}>✓</b> Téléchargement
                      digital
                    </p>
                  </div>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <span>267 utilisateurs sur cette page</span>
                </div>

                {/* Choix de l'édition */}
                <div style={{ marginBottom: "15px" }}>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#333",
                      color: "white",
                      border: "1px solid #555",
                      borderRadius: "5px",
                    }}
                    onChange={handleEditionChange}
                    value={selectedEdition}
                  >
                    <option>Edition standard</option>
                    <option>Edition Deluxe</option>
                  </select>
                </div>

                {/* Prix */}
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedEdition === "Edition Deluxe" &&
                  !product.price_deluxe ? (
                    <span style={{ fontSize: "28px" }}>
                      Veuilez nous excusez, mais l'edition Deluxe de "
                      {product.title}" n'est pas disponible
                    </span>
                  ) : (
                    <span style={{ fontSize: "28px", fontWeight: "bold" }}>
                      {(selectedEdition === "Edition Deluxe"
                        ? product.price_deluxe
                        : product.price
                      ).toFixed(2)}
                      €
                    </span>
                  )}
                </div>

                {/* CTA pour mettre en favoris et ajouter au panier */}
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
                >
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "#E91E63",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    ❤️
                  </button>
                  <button
                    style={{
                      flex: "1",
                      padding: "10px 20px",
                      backgroundColor: "#E91E63",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={handleAddToCart}
                  >
                    Ajouter au panier
                  </button>
                </div>

                {/* Note et avis */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#43A047",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                    }}
                  >
                    8,5
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      Basé sur
                    </div>
                    <div>190 avis</div>
                  </div>
                </div>

                {/* Indication de la plateforme + studio de dev */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Plateforme :
                    </h3>
                    <p>{product.platform}</p>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Développé par :
                    </h3>
                    <p>{product.editor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* À propos et description */}
            <div style={{ maxWidth: "1200px", margin: "40px auto 0" }}>
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ fontSize: "24px" }}>À propos</h2>
              </div>

              {/* Description jeux */}
              <p style={{ marginBottom: "20px" }}>{product.description}</p>
            </div>
          </div>
        </>
      )}

      {/* animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetail;
