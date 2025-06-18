import { useState } from "react";
import ProductItem from "./ProductItem";
import ProductSkeleton from "./ProductSkeleton";
import Filters from "./Filters";

const ProductList = ({ productos, loading, refetchProductos }) => {
    const [filtroTexto, setFiltroTexto] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    const productosFiltrados = productos.filter((producto) => {
        const coincideTexto = producto.titulo.toLowerCase().includes(filtroTexto.toLowerCase());
        const coincideCategoria =
            categoriaSeleccionada === "" || producto.categoria === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

    if (loading) {
        return (
            <div className="product-list">
                {[1, 2, 3].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
        );
    }

    if (productosFiltrados.length === 0) {
        return (
            <div className="product-list">
                <Filters
                    filtroTexto={filtroTexto}
                    setFiltroTexto={setFiltroTexto}
                    categoriaSeleccionada={categoriaSeleccionada}
                    setCategoriaSeleccionada={setCategoriaSeleccionada}
                />
                <div className="product-item no-results">
                    <div className="info">
                        <h2>Ups!</h2>
                        <p>Seguinos en redes para enterarte cuando haya stock disponible</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Filters
                filtroTexto={filtroTexto}
                setFiltroTexto={setFiltroTexto}
                categoriaSeleccionada={categoriaSeleccionada}
                setCategoriaSeleccionada={setCategoriaSeleccionada}
            />
            <div className="product-list">
                {productosFiltrados.map((producto) => (
                    <ProductItem
                        key={producto.id}
                        producto={producto}
                        refetchProductos={refetchProductos} // 🔁 pasamos refetch
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
