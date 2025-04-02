import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// Composant ProductDetail
// Affiche les détails d'un produit spécifique récupéré depuis la BDD
// en utilisant l'ID fourni dans les paramètres d'URL

const ProductDetail = () => {
  const { id_products } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Édition sélectionnée (Standard / Deluxe)
  const [selectedEdition, setSelectedEdition] = useState("Edition standard");

  // Plateforme sélectionnée (s'il y en a plusieurs)
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Affichage de la popup "ajouté au panier"
  const [showPopup, setShowPopup] = useState(false);

  // Récupération des données depuis Supabase
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
        const { data: platformsData, error: platformsError } = await supabase
          .from("v_platforms_products")
          .select("*")
          .eq("id_products", id_products);

        if (platformsError) throw platformsError;

        // Récupérer les éditeurs associés (studios de dev)
        const { data: editorsData, error: editorsError } = await supabase
          .from("v_editors_products")
          .select("*")
          .eq("id_products", id_products);

        if (editorsError) throw editorsError;

        // Récupérer les genres associés
        const { data: genresData, error: genresError } = await supabase
          .from("v_genres_products")
          .select("*")
          .eq("id_products", id_products);

        if (genresError) throw genresError;

        // Combiner toutes les données
        const combinedData = {
          ...productData,
          platforms: platformsData || [],
          editors: editorsData || [],
          genres: genresData || [],
        };

        setProduct(combinedData);

        // Par défaut, on sélectionne la première plateforme si elle existe
        if (platformsData && platformsData.length > 0) {
          setSelectedPlatform(platformsData[0].name);
        }
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id_products]);

  // Affichage de la popup d'ajout au panier pendant 3 secondes
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  // Gère le changement d'édition (Standard / Deluxe)
  const handleEditionChange = (e) => {
    setSelectedEdition(e.target.value);
  };

  // Gère le changement de plateforme si plusieurs sont disponibles
  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  // Ajout au panier + popup
  const handleAddToCart = () => {
    setShowPopup(true);
  };

  // Calcul du prix en fonction de l'édition choisie
  const displayedPrice = product
    ? selectedEdition === "Edition Deluxe" && product.price_deluxe
      ? product.price_deluxe
      : product.price
    : 0;

  return (
    <div
      className="container"
      style={{ position: "relative", width: "100%", margin: 0, padding: 0 }}
    >
      {/* Bouton de retour à l'accueil */}
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

      {/* Gestion du chargement et des erreurs */}
      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Affichage du produit quand les données sont disponibles */}
      {product && (
        <>
          {/* Image de fond */}
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
            {/* Zone principale (visuel + infos) */}
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
              {/* Affiche l'image du produit */}
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

              {/* Informations + actions */}
              <div style={{ flex: "1", minWidth: "300px" }}>
                <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                  {product.title}
                </h1>

                {/* Sélecteur de plateforme, stock et téléchargement digital */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {product.platforms && product.platforms.length > 0 && (
                    <select
                      style={{
                        padding: "10px",
                        backgroundColor: "#333",
                        color: "white",
                        border: "1px solid #555",
                        borderRadius: "5px",
                      }}
                      onChange={handlePlatformChange}
                      value={selectedPlatform}
                    >
                      {product.platforms.map((platform) => (
                        <option
                          key={platform.id_platforms}
                          value={platform.name}
                        >
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div style={{ fontSize: "14px" }}>
                    <b style={{ color: "#4CAF50" }}>✓</b> En stock
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    <b style={{ color: "#4CAF50" }}>✓</b> Téléchargement digital
                  </div>
                </div>

                {/* Nombre d'utilisateurs sur la page */}
                <div style={{ marginBottom: "15px" }}>
                  <span>267 utilisateurs sur cette page</span>
                </div>

                {/* Sélecteur d'édition (Standard / Deluxe) */}
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

                {/* Prix en fonction de l'édition choisie */}
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
                      Veuillez nous excusez, mais l'édition Deluxe de "
                      {product.title}" n'est pas disponible
                    </span>
                  ) : (
                    <span style={{ fontSize: "28px", fontWeight: "bold" }}>
                      {displayedPrice.toFixed(2)}€
                    </span>
                  )}
                </div>

                {/* Boutons Favoris + Ajouter au panier */}
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

                {/* Note / avis (exemple statique) */}
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

                {/* Informations complémentaires (Plateforme, Développé par, etc.) */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {/* Plateforme choisie */}
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Plateforme :
                    </h3>
                    <p>{selectedPlatform}</p>
                  </div>

                  {/* Développé par (éditeurs) */}
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Développé par :
                    </h3>
                    {product.editors && product.editors.length > 0 ? (
                      product.editors.map((editor) => (
                        <p key={editor.id_editors}>{editor.name}</p>
                      ))
                    ) : (
                      <p>Aucun éditeur renseigné.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section "À propos" + description + genres */}
            <div style={{ maxWidth: "1200px", margin: "40px auto 0" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "24px" }}>À propos</h2>
              </div>

              {/* Description du jeu */}
              <p style={{ marginBottom: "20px" }}>{product.description}</p>

              {/* Genres liés au produit */}
              <div>
                <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Genre(s) :
                </h3>
                {product.genres && product.genres.length > 0 ? (
                  product.genres.map((genre) => (
                    <p key={genre.id_genres}>{genre.name}</p>
                  ))
                ) : (
                  <p>Aucun genre renseigné.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Animation pour la popup */}
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
