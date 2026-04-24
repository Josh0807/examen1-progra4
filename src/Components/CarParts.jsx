import { useEffect, useState } from "react";

export default function CarParts() {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCarParts() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const accessKey = import.meta.env.VITE_JSONBIN_ACCESS_KEY;

        if (!apiUrl || apiUrl.includes("PEGAR_AQUI")) {
          throw new Error("Configura VITE_API_URL en el archivo .env");
        }

        const response = await fetch(apiUrl, {
          headers: {
            "X-Access-Key": accessKey,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los repuestos");
        }

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error("La respuesta del API no es JSON");
        }

        const data = await response.json();
        const apiItems = data.record?.items;
        const apiArticles = data.record?.articles;

        if (Array.isArray(apiItems)) {
          setItems(apiItems);
          return;
        }

        if (Array.isArray(apiArticles)) {
          const normalizedItems = apiArticles.map((article) => ({
            id: article.articleId,
            name: article.articleProductName,
            brand: article.supplierName,
            code: article.articleNo,
            image: article.s3image,
          }));

          setItems(normalizedItems);
          return;
        }

        throw new Error("El API no devolvio una lista de repuestos valida");
      } catch (err) {
        setError(err.message || "Ocurrio un error al cargar los repuestos");
      } finally {
        setLoading(false);
      }
    }

    fetchCarParts();
  }, []);

  if (loading) return <p>Cargando repuestos...</p>;

  if (error) return <p>Error: {error}</p>;

  if (items.length === 0) return <p>No hay repuestos disponibles.</p>;

  const visibleItems = items.slice(0, visibleCount);

  return (
    <section>
      <h1>Repuestos</h1>
      <p>
        Mostrando {visibleItems.length} de {items.length} repuestos
      </p>

      <div>
        {visibleItems.map((item) => (
          <article key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.brand}</p>
            <p>{item.code}</p>
            {item.image && <img src={item.image} alt={item.name} width="120" />}
          </article>
        ))}
      </div>

      {visibleCount < items.length && (
        <button onClick={() => setVisibleCount((count) => count + 10)}>
          Ver mas
        </button>
      )}
    </section>
  );
}
