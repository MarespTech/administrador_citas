// Campos del formulario
const Mascota_input = document.getElementById("mascota"),
    Propietario_input = document.getElementById("propietario"),
    Telefono_input = document.getElementById("telefono"),
    Fecha_input = document.getElementById("fecha"),
    Hora_input = document.getElementById("hora"),
    Sintomas_input = document.getElementById("sintomas");

// User Interface
const Formulario = document.getElementById("nueva-cita");
const Contenedor_citas = document.getElementById("citas");

let editando;

class Citas {
    constructor() {
        this.citas = [];
    }

    agregar_cita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminar_cita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editar_cita(cita_editada) {
        this.citas = this.citas.map(cita => cita.id === cita_editada.id ? cita_editada : cita);
    }

    verificar_disponibilidad(cita_actual) {
        //Funcion para validar que no haya otra cita a la misma hora
        const { fecha, hora } = cita_actual;
        let flag = 0;

        this.citas.forEach(cita => {
            if (cita.fecha === fecha) {
                if (cita.hora === hora) {
                    if (editando) {
                        flag = cita.id === cita_actual.id ? 0 : 1;
                    } else {
                        flag = 1;
                    }
                }
            }
            if (flag !== 0) // A la primera que encuentra un duplicado saca del forEach
                return flag;
        })

        return flag;

    }

}

class UI {
    imprimir_alerta(mensaje, tipo) {
        //Crear div
        const Div_mensaje = document.createElement("div");
        Div_mensaje.classList.add("text-center", "alert", "d-block", "col-12");

        // Agregar Clase en base al tipo de error
        if (tipo === "error") {
            Div_mensaje.classList.add("alert-danger");
        } else {
            Div_mensaje.classList.add("alert-success");
        }

        // Agregar mensaje al div
        Div_mensaje.textContent = mensaje;
        document.querySelector("#contenido").insertBefore(Div_mensaje, document.querySelector(".agregar-cita"));

        // Quitar mensaje en 5 segundos
        setTimeout(() => {
            Div_mensaje.remove();
        }, 5000);
    }

    imprimir_citas({ citas }) {
        this.limpiar_HTML();
        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const Div_cita = document.createElement("div");
            Div_cita.classList.add("cita", "p-3");
            Div_cita.dataset.id = id;

            // Scripting de los elementos de la cita
            const Mascota_parrafo = document.createElement("h2");
            Mascota_parrafo.classList.add("card-title", "font-weight-bolder");
            Mascota_parrafo.textContent = mascota;

            const Propietario_parrafo = document.createElement("p");
            Propietario_parrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const Telefono_parrafo = document.createElement("p");
            Telefono_parrafo.innerHTML = `
                <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const Fecha_parrafo = document.createElement("p");
            Fecha_parrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const Hora_parrafo = document.createElement("p");
            Hora_parrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const Sintomas_parrafo = document.createElement("p");
            Sintomas_parrafo.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            // Boton para editar la cita
            const Btn_editar = document.createElement("button");
            Btn_editar.classList.add("btn", "btn-info", "mr-2");
            Btn_editar.innerHTML = `Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;
            Btn_editar.onclick = () => cargar_edicion(cita);

            // Boton para eliminar la cita
            const Btn_eliminar = document.createElement("button");
            Btn_eliminar.classList.add("btn", "btn-danger", "mr-2");
            Btn_eliminar.innerHTML = `Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            Btn_eliminar.onclick = () => eliminar_cita(id);

            // Agregar los parrafos al Div_cita
            Div_cita.append(Mascota_parrafo);
            Div_cita.append(Propietario_parrafo);
            Div_cita.append(Telefono_parrafo);
            Div_cita.append(Fecha_parrafo);
            Div_cita.append(Hora_parrafo);
            Div_cita.append(Sintomas_parrafo);
            Div_cita.append(Btn_editar);
            Div_cita.append(Btn_eliminar);

            // Agregar citas al HTML
            Contenedor_citas.appendChild(Div_cita);
        });
    }

    limpiar_HTML() {
        while (Contenedor_citas.firstChild) {
            Contenedor_citas.removeChild(Contenedor_citas.firstChild);
        }
    }
}

const ui = new UI();
const administrar_citas = new Citas();

// Objeto con informacion de la cita
const cita_obj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
}

// Registrar eventos
eventlisteners();

function eventlisteners() {
    Mascota_input.addEventListener("input", datos_cita);
    Propietario_input.addEventListener("input", datos_cita);
    Telefono_input.addEventListener("input", datos_cita);
    Fecha_input.addEventListener("input", datos_cita);
    Hora_input.addEventListener("input", datos_cita);
    Sintomas_input.addEventListener("input", datos_cita);

    Formulario.addEventListener("submit", nueva_cita);
}

// Agrega datos al objeto de cita
function datos_cita(e) {
    e.preventDefault();
    cita_obj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de citas
function nueva_cita(e) {
    e.preventDefault();

    // Extraer informacion del objeto de citas
    const { mascota, propietario, telefono, fecha, hora, sintomas } = cita_obj;

    // Validar entradas que no esten vacias
    if (mascota === "" && propietario === "" && telefono === "" && fecha === "" && hora === "" && sintomas === "") {
        ui.imprimir_alerta("Todos los campos son obligatorios", "error");
        return;
    }

    let validar = administrar_citas.verificar_disponibilidad({...cita_obj });
    console.log(validar)
    if (validar === 1) {
        // Mensaje de fecha no disponible
        ui.imprimir_alerta("Horario no disponible, favor de elegir otro horario.", "error");
        return;
    }

    if (editando) {
        // Pasar el objeto de la cita a edicion
        administrar_citas.editar_cita({...cita_obj });

        // Mensaje de editado correctamente
        ui.imprimir_alerta("Se editó correctamente");

        Formulario.querySelector("button[type='submit']").textContent = "Crear cita";
        editando = false;
    } else {
        // Crear cita
        cita_obj.id = Date.now();

        // Agregar cita
        administrar_citas.agregar_cita({...cita_obj });

        // Mensaje de agregado correctamente
        ui.imprimir_alerta("Se agregó correctamente");
    }

    // Limpiar formulario y objeto
    Formulario.reset();
    reiniciar_objeto();

    // Mostrar cita en el DOM
    ui.imprimir_citas(administrar_citas);
}

function reiniciar_objeto() {
    cita_obj.mascota = "";
    cita_obj.propietario = "";
    cita_obj.telefono = "";
    cita_obj.fecha = "";
    cita_obj.hora = "";
    cita_obj.sintomas = "";
}

function eliminar_cita(id) {
    //Eliminar la cita
    administrar_citas.eliminar_cita(id);
    // Muestra un mensaje
    ui.imprimir_alerta("La cita se eliminó correctamente");
    // Refrescar las citas
    ui.imprimir_citas(administrar_citas);
}

function cargar_edicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
    //Llenar campos con informacion de cita
    Mascota_input.value = mascota;
    Propietario_input.value = propietario;
    Telefono_input.value = telefono;
    Fecha_input.value = fecha;
    Hora_input.value = hora;
    Sintomas_input.value = sintomas;

    // Llenar el objeto
    cita_obj.mascota = mascota;
    cita_obj.propietario = propietario;
    cita_obj.telefono = telefono;
    cita_obj.fecha = fecha;
    cita_obj.hora = hora;
    cita_obj.sintomas = sintomas;
    cita_obj.id = id;

    // Cambiar el texto del boton
    Formulario.querySelector("button[type='submit']").textContent = "Guardar Cambios";
    editando = true;
}