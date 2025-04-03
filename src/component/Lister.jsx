import ProductCard from "./CardProduct";

function Lister({ products }) {
  return (
    <div className="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.id_products}
          id_products={product.id_products}
          title={product.title || "Sans titre"}
          price={Number(product.price) || 0}
          img_url={product.img_url}
        />
      ))}
    </div>
  );
}

export default Lister;
