import { useEffect, useRef, useState } from "react";
import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function PurchaseModal({ producto, onClose, refetchProductos }) {
    const backdropRef = useRef(null);
    const [visible, setVisible] = useState(false);

    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
    }, []);

    const handleClickOutside = (e) => {
        if (e.target === backdropRef.current) {
            handleClose();
        }
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onClose(), 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const fechaId = `${day}-${month}-${year}-${hours}${minutes}`;

        const fecha = new Intl.DateTimeFormat('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(now);

        const nombreNormalizado = nombre.trim().toLowerCase().replace(/\s+/g, "-");
        const tituloNormalizado = producto.titulo.trim().toLowerCase().replace(/\s+/g, "-");
        const docId = `${tituloNormalizado}-${nombreNormalizado}-${fechaId}`;
        const productoRef = doc(db, "productos", tituloNormalizado);

        try {
            const productoSnap = await getDoc(productoRef);

            if (productoSnap.exists()) {
                const data = productoSnap.data();
                const cantidad = data.cantidad ?? 0;
                const reservados = data.reservados ?? 0;

                if (cantidad !== 0 && reservados >= cantidad) {
                    alert("Este producto ya no está disponible.");
                    refetchProductos(); // 🔁 actualiza la lista global
                    handleClose();
                    return;
                }

                await setDoc(doc(db, "pedidos", docId), {
                    producto: producto.titulo,
                    cliente: nombre,
                    telefono,
                    correo,
                    fecha,
                });

                await updateDoc(productoRef, {
                    reservados: increment(1),
                });

                alert("Nos comunicaremos a la brevedad. ¡Gracias por elegirnos!");
                refetchProductos(); // 🔁 vuelve a consultar productos
                handleClose();
            } else {
                alert("El producto ya no existe.");
                refetchProductos();
                handleClose();
            }
        } catch (error) {
            console.error("Error al enviar consulta:", error);
            alert("Hubo un error al enviar la consulta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`modal-backdrop ${visible ? "visible" : ""}`}
            ref={backdropRef}
            onClick={handleClickOutside}
        >
            <div className={`modal ${visible ? "fade-in" : "fade-out"}`}>
                <button className="close" onClick={handleClose}>X</button>
                <div className="modal-content">
                    <h2 className="modalTitle">{producto.titulo} ({producto.categoria})</h2>
                    <span className="modalPrice">${producto.precio}</span>
                    <img className="modalImg" src={producto.imagen} alt={producto.titulo} />
                    <p className="modalText">Una vez enviado el formulario nos comunicaremos a la brevedad.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/\D/g, '');
                                setTelefono(onlyNums);
                            }}
                            required
                            disabled={loading}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar consulta"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PurchaseModal;
