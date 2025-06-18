import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import ProductList from "./components/ProductList";
import "./styles/styles.css";

import logo from '../assets/img/logoConNombre.png';
import logoFooter from '../assets/img/eStockFavicon.png';

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(producto => {
          const cantidad = producto.cantidad;
          const reservas = producto.reservados ?? 0;
          return cantidad === undefined || reservas < cantidad;
        });
      setProductos(docs);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="app-container">
      <div className="headerContainer">
        <img src={logo} alt="eStock" />
      </div>
      <h1>Lista de Productos</h1>
      <ProductList
        productos={productos}
        loading={loading}
        refetchProductos={fetchProductos}
      />
      <div className="footerContainer">
        <img src={logoFooter} alt="" />
      </div>
    </div>
  );
}

export default App;
