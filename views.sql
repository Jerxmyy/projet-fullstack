DROP VIEW IF EXISTS v_products;

CREATE VIEW v_products AS

SELECT 
  products.*,
  creators.name AS creators_name,
  editors.name AS editors_name

FROM products
  
  LEFT JOIN creators ON creators.id_creators = products.id_creators
  LEFT JOIN editors ON editors.id_editors = products.id_editors
  ;


DROP VIEW IF EXISTS v_platforms_products ;
CREATE VIEW v_platforms_products AS
	SELECT 
    platforms_products.id_products, 
    platforms.*
	FROM platforms_products
		LEFT JOIN platforms ON (platforms.id_platforms = platforms_products.id_platforms);


DROP VIEW IF EXISTS v_products_platforms ;
CREATE VIEW v_products_platforms AS
	SELECT 
    platforms_products.id_platforms, 
    products.*
	FROM platforms_products
		LEFT JOIN products ON (products.id_products = platforms_products.id_products);

