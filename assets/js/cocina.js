document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("kitchen-orders");
    const allCards = Array.from(document.querySelectorAll(".order-card"));

    //Función para ordenar y reinsertar los cards
    function ordenarCards() {
        const cards = Array.from(container.querySelectorAll(".order-card"));
        cards.sort((a, b) => {
            const estadoOrden = { "pendiente": 1, "en preparación": 2 };
            const estadoA = a.dataset.estado || "pendiente";
            const estadoB = b.dataset.estado || "pendiente";

            //Ordenar primero por estado
            if (estadoOrden[estadoA] !== estadoOrden[estadoB]) {
                return estadoOrden[estadoA] - estadoOrden[estadoB];
            }

            //Si estado es el mismo, ordenar por hora
            const dateA = new Date(a.dataset.fecha);
            const dateB = new Date(b.dataset.fecha);
            return dateB - dateA;
        });

        //Reinsertar en el contenedor
        cards.forEach(card => container.appendChild(card));
    }

    //Ordenamos los cards
    ordenarCards();

    //Función para mover a lista "Listo"
    function moverOrdenATablaListas(ordenId, cliente, mesa, hora) {
        const tbody = document.querySelector("#tabla-listas tbody");
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${ordenId}</td>
            <td>${cliente}</td>
            <td>${mesa}</td>
            <td>${hora}</td>
            <td><span class="badge bg-success">Listo</span></td>
        `;
        tbody.appendChild(fila);
    }

    //Función para mover a lista "Rechazadas"
    function moverOrdenATablaRechazadas(card, ordenId, cliente, mesa, hora) {
        const tbody = document.querySelector("#tabla-rechazadas tbody");
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${ordenId}</td>
            <td>${cliente}</td>
            <td>${mesa}</td>
            <td>${hora}</td>
            <td>Rechazada por cocina</td>
            <td><button class="btn btn-warning btn-sm restaurar">Restaurar</button></td>
        `;

        fila.querySelector(".restaurar").addEventListener("click", () => {
            restaurarOrden(card.cloneNode(true), ordenId);
            fila.remove();
        });

        tbody.appendChild(fila);
    }

    //Restaurar orden rechazada
    function restaurarOrden(card, ordenId) {
        card.dataset.estado = "pendiente";

        const badge = card.querySelector(".estado");
        badge.textContent = "Pendiente";
        badge.className = "badge bg-warning estado";

        const footer = card.querySelector(".botones-acciones");
        footer.innerHTML = `
            <button class="btn btn-success btn-sm iniciar">Iniciar Preparación</button>
            <button class="btn btn-danger btn-sm rechazar">Rechazar</button>
        `;

        container.appendChild(card);
        asignarEventos(card);
        ordenarCards();
    }

    //Asignar eventos a un card
    function asignarEventos(card) {
        const iniciarBtn = card.querySelector(".iniciar");
        const rechazarBtn = card.querySelector(".rechazar");
        const estadoBadge = card.querySelector(".estado");
        const footer = card.querySelector(".botones-acciones");

        const ordenId = card.querySelector(".card-title").textContent;
        const cliente = card.querySelectorAll("p")[0].textContent.replace("Cliente:", "").trim();
        const mesa = card.querySelectorAll("p")[1].textContent.replace("Mesa:", "").trim();
        const hora = card.querySelectorAll("p")[2].textContent.replace("Hora:", "").trim();

        if (iniciarBtn) {
            iniciarBtn.addEventListener("click", () => {
                card.dataset.estado = "en preparación";
                estadoBadge.textContent = "En preparación";
                estadoBadge.className = "badge bg-info estado";

                footer.innerHTML = `<button class="btn btn-primary btn-sm entregar">Listo para entregar</button>`;

                footer.querySelector(".entregar").addEventListener("click", () => {
                    moverOrdenATablaListas(ordenId, cliente, mesa, hora);
                    card.remove();
                });

                ordenarCards();
            });
        }

        if (rechazarBtn) {
            rechazarBtn.addEventListener("click", () => {
                const confirmar = confirm("¿Está seguro que desea rechazar esta orden?");
                if (!confirmar) return;

                moverOrdenATablaRechazadas(card, ordenId, cliente, mesa, hora);
                card.remove();
                ordenarCards();
            });
        }
    }

    //Inicializar todos los cards
    allCards.forEach(card => asignarEventos(card));
});
