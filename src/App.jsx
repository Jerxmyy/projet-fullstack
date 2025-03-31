import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
import ListProduct from "./component/ListProduct";

// Commenté pour tester les composants uniquement
// const supabase = createClient(
//   "https://qvonhyxawuzkqaaihsbs.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b25oeXhhd3V6a3FhYWloc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NzMsImV4cCI6MjA1ODk4ODc3M30.T8_69hU42d03wlhhBo8VL4n2qSLxwQ87AIDg6xGksFw"
// );

const staticProducts = [
  {
    id: 1,
    name: "The Legend of Zelda: Tears of the Kingdom",
    price: 299.99,
    image_url:
      "https://www.closeupshop.fr/media/oart_0/oart_t/oart_100708/1222069_G881960.JPG",
  },
  {
    id: 2,
    name: "Super Mario Bros Wonder",
    price: 59.99,
    image_url:
      "https://image.jeuxvideo.com/medias/170317/1703166833-1293-jaquette-avant.jpg",
  },
  {
    id: 3,
    name: "Elden Ring",
    price: 59.99,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukje44kyOmrirl8gx8_EzdiTZiEBPTW8GHIb370Fd-x524HqWy8xpb8wHTEZLCuj4W_w&usqp=CAU",
  },
];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un délai de chargement pour reproduire une requête API
    const timer = setTimeout(() => {
      setProducts(staticProducts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);

    // Code original commenté
    // async function fetchProducts() {
    //   try {
    //     setLoading(true);
    //     const { data, error } = await supabase.from("products").select();
    //
    //     if (error) {
    //       throw error;
    //     }
    //
    //     console.log("Données récupérées:", data);
    //     setProducts(data || []);
    //   } catch (err) {
    //     console.error("Erreur lors de la récupération des produits:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    //
    // fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center p-4">Chargement des produits...</div>;

  return (
    <>
      <h1 className="h2 mb-4 ms-4">
        Jeux pouvant vous interesser ({products.length})
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "0 20px",
          overflowX: "auto",
        }}
      >
        {products.map((product) => (
          <ListProduct
            key={product.id}
            title={product.name}
            price={product.price}
            imageUrl={product.image_url}
          />
        ))}
      </div>
    </>
  );
}

export default App;
