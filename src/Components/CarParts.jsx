import { useEffect, useState } from "react";

export default function CarParts() {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCarParts() {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL, {
          headers: {
            "X-Access-Key": import.meta.env.VITE_JSONBIN_ACCESS_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los repuestos");
        }

        const data = await response.json();
        const apiItems = data.record?.items;
        const apiArticles = data.record?.articles;

        if (Array.isArray(apiItems)) {
          setItems(apiItems);
          return;
        }

        if (Array.isArray(apiArticles)) {
          setItems(
            apiArticles.map((article) => ({
              id: article.articleId,
              name: article.articleProductName,
              brand: article.supplierName,
              code: article.articleNo,
            }))
          );
          return;
        }

        throw new Error("El API no devolvio una lista valida de repuestos");
      } catch (err) {
        setError(err.message || "Ocurrio un error al cargar los repuestos");
      } finally {
        setLoading(false);
      }
    }

    fetchCarParts();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleItems = filteredItems.slice(0, visibleCount);

  if (loading) return <p>Cargando repuestos...</p>;

  if (error) return <p>Error: {error}</p>;

  if (items.length === 0) return <p>No hay repuestos disponibles.</p>;

  return (
    <section>
      <h1>Repuestos</h1>

      <input
        type="text"
        placeholder="Buscar repuesto..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setVisibleCount(10);
        }}
      />

      <p>
        Mostrando {visibleItems.length} de {filteredItems.length} repuestos
      </p>

      {filteredItems.length === 0 ? (
        <p>No hay repuestos que coincidan con la busqueda.</p>
      ) : (
        <div>
          {visibleItems.map((item) => (
            <article key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.brand}</p>
              <p>{item.code}</p>
            </article>
          ))}
        </div>
      )}

      {visibleCount < filteredItems.length && (
        <button onClick={() => setVisibleCount((count) => count + 10)}>
          Ver mas
        </button>
      )}
    </section>
  );
}
