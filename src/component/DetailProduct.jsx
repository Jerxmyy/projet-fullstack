import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  BackButton,
  SelectionButton,
  IconButton,
  PrimaryButton,
} from "./ButtonComponents";
import "./DetailProduct.css";

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

        // Récupération du produit via vue "v_products"
        const { data: productData, error: productError } = await supabase
          .from("v_products")
          .select("*")
          .eq("id_products", id_products)
          .single();

        if (productError) throw productError;

        // Récup plateforme dispo via vue "v_platforms_products"
        const { data: platformsData, error: platformsError } = await supabase
          .from("v_platforms_products")
          .select("*")
          .eq("id_products", id_products);

        if (platformsError) throw platformsError;

        // Récup genres du jeux via vue "v_genres_products"
        const { data: genresData, error: genresError } = await supabase
          .from("v_genres_products")
          .select("*")
          .eq("id_products", id_products);

        if (genresError) throw genresError;

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
        // Message pour quand ca plante
        setError("Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id_products]);

  // Popup panier : affichage 3 sec
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => setShowPopup(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  // Popup wishlist : affichage 3 sec
  useEffect(() => {
    let timer;
    if (showWishlistPopup) {
      timer = setTimeout(() => setShowWishlistPopup(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showWishlistPopup]);

  const handleEditionChange = (edition) => setSelectedEdition(edition);
  const handlePlatformChange = (platform) => setSelectedPlatform(platform);
  const handleAddToCart = () => setShowPopup(true);
  const handleAddToWishlist = () => setShowWishlistPopup(true);

  const displayedPrice = product
    ? selectedEdition === "Edition Deluxe" && product.price_deluxe
      ? product.price_deluxe
      : product.price
    : 0;

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
    <div className="product-detail-container">
      <Link to="/">
        <BackButton>Accueil</BackButton>
      </Link>

      {/* Popup d'ajout au panier */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="popup-icon">✓</span>
            <div>
              <p className="popup-title">Produit ajouté au panier</p>
              {product && (
                <p className="popup-subtitle">
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
          className="popup popup-wishlist"
          style={{ top: showPopup ? "110px" : "20px" }}
        >
          <div className="popup-content">
            <span className="popup-icon">❤️</span>
            <div>
              <p className="popup-title">Produit ajouté à votre wishlist</p>
              {product && (
                <p className="popup-subtitle">
                  {product.title}, {selectedPlatform} ({selectedEdition})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {product && (
        <>
          {/* Bg-img */}
          <div
            className="background-image"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${product.img_url})`,
            }}
          ></div>
          <div className="content-wrapper">
            <div className="main-zone">
              {/* img jeux */}
              <div className="image-container">
                <img
                  src={product.img_url}
                  alt={product.title}
                  className="product-img"
                />
              </div>

              {/* Info jeux */}
              <div className="product-info">
                <h1 className="product-title">{product.title}</h1>

                {/* Choix plateforme */}
                {product.platforms && product.platforms.length > 0 && (
                  <div className="platform-selection">
                    <div className="platform-buttons">
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

                {/* Infos stock et téléchargement */}
                <div className="stock-info">
                  <div>
                    <b className="checkmark">✓</b> En stock
                  </div>
                  <div>
                    <b className="checkmark">✓</b> Téléchargement digital
                  </div>
                </div>

                {/* Choix édition */}
                {product.price_deluxe && (
                  <div className="editions">
                    <h3 className="editions-title">Éditions :</h3>
                    <div className="editions-buttons">
                      {getAvailableEditions().map((edition) => (
                        <SelectionButton
                          key={edition.id}
                          isSelected={selectedEdition === edition.name}
                          onClick={() => handleEditionChange(edition.name)}
                        >
                          {edition.name}
                          {edition.priceIncrease && (
                            <span className="price-increase">
                              (+{edition.priceIncrease}€)
                            </span>
                          )}
                        </SelectionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prix */}
                <div className="price-container">
                  <span className="price">{displayedPrice}€</span>
                </div>

                {/* Boutons CTA */}
                <div className="cta-container">
                  <IconButton onClick={handleAddToWishlist}>❤️</IconButton>
                  <PrimaryButton onClick={handleAddToCart}>
                    Ajouter au panier
                  </PrimaryButton>
                </div>

                {/* Note / Metacritique */}
                <div className="rating-container">
                  <div className="rating-circle">8,5</div>
                  <div className="rating-details">
                    <div className="rating-label">Basé sur</div>
                    <div>190 avis</div>
                  </div>
                </div>

                {/* Infos développeur, éditeur et genres */}
                <div className="info-grid">
                  <div className="info-item">
                    <h3 className="info-title">Développé par :</h3>
                    {product.creators_name ? (
                      <p>{product.creators_name}</p>
                    ) : (
                      <p>Studio de dev non renseigné.</p>
                    )}
                  </div>

                  <div className="info-item">
                    <h3 className="info-title">Edité par :</h3>
                    {product.editors_name ? (
                      <p>{product.editors_name}</p>
                    ) : (
                      <p>Aucun éditeur renseigné.</p>
                    )}
                  </div>

                  <div className="info-item">
                    <h3 className="info-title">Genre(s) :</h3>
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

            {/* Description jeux */}
            <div className="description-section">
              <h1 className="description-title">Description</h1>
              <div
                className="description-content"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></div>
            </div>
          </div>
        </>
      )}

      {/* Anim popup */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
