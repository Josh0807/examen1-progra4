import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import "./App.css";

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
