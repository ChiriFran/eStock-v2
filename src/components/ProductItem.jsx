import { useState } from "react";
import PurchaseModal from "./PurchaseModal";

function ProductItem({ producto, refetchProductos }) {
    const [mostrarModal, setMostrarModal] = useState(false);

    return (
        <div className="product-item">
            <div className="image">
                <img src={producto.imagen} alt={producto.titulo} />
            </div>

            <div className="info">
                <h2 className="productTitle">{producto.titulo}</h2>
                <p className="price">${producto.precio}</p>
                <p className="description">{producto.descripcion}</p>
            </div>

            <div className="cta">
                <div className="cta-content">
                    <div className="categoria">{producto.categoria}</div>
                    <button className="reservarBtn" onClick={() => setMostrarModal(true)}>Reservar</button>
                    <div className="stock">Stock: {producto.cantidad} - Reservados: {producto.reservados ?? 0}</div>
                </div>
            </div>

            {mostrarModal && (
                <PurchaseModal
                    producto={producto}
                    onClose={() => setMostrarModal(false)}
                    refetchProductos={refetchProductos} // ✅ lo pasamos acá
                />
            )}
        </div>
    );
}

export default ProductItem;
