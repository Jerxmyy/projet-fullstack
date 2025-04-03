import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

import {
  BackButton,
  SelectionButton,
  IconButton,
  PrimaryButton,
} from "./ButtonComponents";

// Composant ProductDetail
// Affiche détails produit récupéré depuis la BDD via l'ID

const ProductDetail = () => {
  const { id_products } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Choix édition
  const [selectedEdition, setSelectedEdition] = useState("Edition standard");

  // Choix plateforme
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Affichage popup panier
  const [showPopup, setShowPopup] = useState(false);

  // Affichage popup wishlist
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  // Récupération des données depuis Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Récupération du produit via la vue "v_products" pour inclure creators_name et editors_name
        const { data: productData, error: productError } = await supabase
          .from("v_products")
          .select("*")
          .eq("id_products", id_products)
          .single();

        if (productError) throw productError;

        // Récup plateforme dispo
        const { data: platformsData, error: platformsError } = await supabase
          .from("v_platforms_products")
          .select("*")
          .eq("id_products", id_products);

        if (platformsError) throw platformsError;

        // Récup genres du jeux
        const { data: genresData, error: genresError } = await supabase
          .from("v_genres_products")
          .select("*")
          .eq("id_products", id_products);

        if (genresError) throw genresError;

        // Combinaison des données
        const combinedData = {
          ...productData,
          platforms: platformsData || [],
          genres: genresData || [],
        };
        setProduct(combinedData);

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

  // Visibilité popup panier pendant 3 sec
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  // Visibilité popup wishlist pendant 3 sec
  useEffect(() => {
    let timer;
    if (showWishlistPopup) {
      timer = setTimeout(() => {
        setShowWishlistPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showWishlistPopup]);

  // Gère le changement d'édition (Standard / Deluxe)
  const handleEditionChange = (edition) => {
    setSelectedEdition(edition);
  };

  // Gère le changement de plateforme si plusieurs sont disponibles
  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  // Ajout au panier + popup
  const handleAddToCart = () => {
    setShowPopup(true);
  };

  // Ajout aux favoris + popup
  const handleAddToWishlist = () => {
    setShowWishlistPopup(true);
  };

  // Calcul du prix en fonction de l'édition choisie
  const displayedPrice = product
    ? selectedEdition === "Edition Deluxe" && product.price_deluxe
      ? product.price_deluxe
      : product.price
    : 0;

  // Editions disponibles - ne montre l'édition Deluxe que si elle existe
  const getAvailableEditions = () => {
    const editions = [{ id: 1, name: "Edition standard" }];

    if (product && product.price_deluxe) {
      editions.push({
        id: 2,
        name: "Edition Deluxe",
        priceIncrease: (product.price_deluxe - product.price).toFixed(2),
      });
    }

    return editions;
  };

  return (
    <div
      className="container"
      style={{ position: "relative", width: "100%", margin: 0, padding: 0 }}
    >
      {/* CTA accueil */}
      <Link to="/">
        <BackButton>Accueil</BackButton>
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
            animation: "fadeIn 0.3s",
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
                  {product.title}, {selectedPlatform} ({selectedEdition})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup d'ajout à la wishlist */}
      {showWishlistPopup && (
        <div
          style={{
            position: "fixed",
            top: showPopup ? "110px" : "20px", // Décalage si le popup panier est affiché
            right: "20px",
            backgroundColor: "#e91e63",
            color: "white",
            padding: "15px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            animation: "fadeIn 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px" }}>❤️</span>
            <div>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Produit ajouté à votre wishlist
              </p>
              {product && (
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                  {product.title}, {selectedPlatform} ({selectedEdition})
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
                maxWidth: "1800px",
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              {/* Affiche l'image du produit */}
              <div style={{ flex: "1", minWidth: "980px" }}>
                <img
                  src={product.img_url}
                  alt={product.title}
                  style={{
                    width: "600px",
                    height: "700px",
                    objectFit: "cover",
                    borderRadius: "20px",
                    marginLeft: "100px",
                  }}
                />
              </div>

              {/* Informations */}
              <div style={{ flex: "1", minWidth: "400px" }}>
                <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                  {product.title}
                </h1>

                {/* Choix plateforme */}
                {product.platforms && product.platforms.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {product.platforms.map((platform) => (
                        <SelectionButton
                          key={platform.id_platforms}
                          isSelected={selectedPlatform === platform.name}
                          onClick={() => handlePlatformChange(platform.name)}
                        >
                          {platform.name}
                        </SelectionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Infos stock et téléchargement digital */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "14px" }}>
                    <b style={{ color: "#4CAF50" }}>✓</b> En stock
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    <b style={{ color: "#4CAF50" }}>✓</b> Téléchargement digital
                  </div>
                </div>

                {/* Choix Edition UNIQUEMENT si Autre Edition Dispo */}
                {product.price_deluxe && (
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "10px" }}>Éditions :</h3>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {getAvailableEditions().map((edition) => (
                        <SelectionButton
                          key={edition.id}
                          isSelected={selectedEdition === edition.name}
                          onClick={() => handleEditionChange(edition.name)}
                        >
                          {edition.name}
                          {edition.priceIncrease && (
                            <span
                              style={{ marginLeft: "8px", fontSize: "14px" }}
                            >
                              (+{edition.priceIncrease}€)
                            </span>
                          )}
                        </SelectionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prix édition choisie */}
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: "28px", fontWeight: "bold" }}>
                    {displayedPrice}€
                  </span>
                </div>

                {/* CTA Favoris + Ajouter au panier */}
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
                >
                  <IconButton onClick={handleAddToWishlist}>❤️</IconButton>
                  <PrimaryButton onClick={handleAddToCart}>
                    Ajouter au panier
                  </PrimaryButton>
                </div>

                {/* Note / Metacritique */}
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

                {/* Plateforme + Développé par + Genres du jeux */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {/* Développé par : */}
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Développé par :
                    </h3>
                    {product.creators_name ? (
                      <p>{product.creators_name}</p>
                    ) : (
                      <p>Studio de dev non renseigné.</p>
                    )}
                  </div>

                  {/* Edité par : */}
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Edité par :
                    </h3>
                    {product.editors_name ? (
                      <p>{product.editors_name}</p>
                    ) : (
                      <p>Aucun éditeur renseigné.</p>
                    )}
                  </div>

                  {/* Genre(s) : */}
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Genre(s) :
                    </h3>
                    {product.genres && product.genres.length > 0 ? (
                      product.genres.map((genre) => (
                        <p key={genre.id_genres}>{genre.genre_name}</p>
                      ))
                    ) : (
                      <p>Aucun genre renseigné.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ maxWidth: "1200px", margin: "40px auto 0" }}>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "28px" }}>Description</h1>
              </div>

              {/* Description du jeu */}
              <div
                style={{ marginBottom: "20px" }}
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              ></div>
            </div>
          </div>
        </>
      )}

      {/* Anim popup */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetail;
