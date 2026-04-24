import CarParts from "./CarParts";

function Home() {
  return (
    <main className="home" id="inicio">
      <section className="intro">
        <h1>Listado de repuestos</h1>
        <p>Consulta los resultados disponibles y carga mas elementos cuando lo necesites.</p>
      </section>
      <CarParts />
    </main>
  );
}

export default Home;
