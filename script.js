"use strict";

/* =========================================
   ATELIER MANAGER
   GENERADOR DE COTIZACIONES PDF
========================================= */


/* =========================================
   ELEMENTOS DEL HTML
========================================= */

const cliente =
    document.getElementById("cliente");

const numeroCliente =
    document.getElementById("numeroCliente");

const vestido =
    document.getElementById("vestido");

const cantidad =
    document.getElementById("cantidad");

const precio =
    document.getElementById("precio");

const abonado =
    document.getElementById("abonado");

const anticipo =
    document.getElementById("anticipo");

const imagen =
    document.getElementById("imagen");

const logo =
    document.getElementById("logo");

const empresa =
    document.getElementById("empresa");

const direccion =
    document.getElementById("direccion");

const telefono =
    document.getElementById("telefono");

const previewImagen =
    document.getElementById("previewImagen");

const subtotalElemento =
    document.getElementById("subtotal");

const anticipoMontoElemento =
    document.getElementById("anticipoMonto");

const abonadoMontoElemento =
    document.getElementById("abonadoMonto");

const pendienteAnticipoElemento =
    document.getElementById("pendienteAnticipo");

const saldoElemento =
    document.getElementById("saldo");

const generarBtn =
    document.getElementById("generarBtn");

const limpiarBtn =
    document.getElementById("limpiarBtn");


/* =========================================
   FORMATO DE MONEDA
========================================= */

function formatoMoneda(numero) {

    return new Intl.NumberFormat(
        "es-GT",
        {
            style: "currency",
            currency: "GTQ",
            minimumFractionDigits: 2
        }
    ).format(numero || 0);

}


/* =========================================
   OBTENER NÚMERO
========================================= */

function obtenerNumero(elemento) {

    const numero =
        parseFloat(elemento.value);

    return isNaN(numero)
        ? 0
        : numero;

}


/* =========================================
   CALCULAR RESUMEN
========================================= */

function calcular() {

    const cantidadValor =
        obtenerNumero(cantidad);

    const precioValor =
        obtenerNumero(precio);

    const abonadoValor =
        obtenerNumero(abonado);

    const anticipoValor =
        obtenerNumero(anticipo);


    const subtotal =
        cantidadValor *
        precioValor;


    const anticipoMonto =
        subtotal *
        (anticipoValor / 100);


    const pendienteAnticipo =
        Math.max(
            anticipoMonto -
            abonadoValor,
            0
        );


    const saldo =
        Math.max(
            subtotal -
            abonadoValor,
            0
        );


    subtotalElemento.textContent =
        formatoMoneda(subtotal);

    anticipoMontoElemento.textContent =
        formatoMoneda(anticipoMonto);

    abonadoMontoElemento.textContent =
        formatoMoneda(abonadoValor);

    pendienteAnticipoElemento.textContent =
        formatoMoneda(
            pendienteAnticipo
        );

    saldoElemento.textContent =
        formatoMoneda(saldo);

}


/* =========================================
   ACTUALIZACIÓN AUTOMÁTICA
========================================= */

[
    cantidad,
    precio,
    abonado,
    anticipo

].forEach(elemento => {

    elemento.addEventListener(
        "input",
        calcular
    );

});


/* =========================================
   PREVISUALIZACIÓN DE IMAGEN
========================================= */

imagen.addEventListener(
    "change",
    function () {

        previewImagen.innerHTML = "";

        const archivo =
            imagen.files[0];

        if (!archivo) {
            return;
        }


        const lector =
            new FileReader();


        lector.onload =
            function (evento) {

                const img =
                    document.createElement(
                        "img"
                    );

                img.src =
                    evento.target.result;

                img.alt =
                    "Imagen del vestido";

                previewImagen.appendChild(
                    img
                );

            };


        lector.readAsDataURL(
            archivo
        );

    }
);


/* =========================================
   CONVERTIR ARCHIVO A DATA URL
========================================= */

function archivoADataURL(
    archivo
) {

    return new Promise(
        (resolve, reject) => {

            if (!archivo) {

                resolve(null);

                return;
            }


            const lector =
                new FileReader();


            lector.onload =
                () => resolve(
                    lector.result
                );


            lector.onerror =
                () => reject(
                    new Error(
                        "No se pudo leer la imagen."
                    )
                );


            lector.readAsDataURL(
                archivo
            );

        }
    );

}


/* =========================================
   FECHA
========================================= */

function obtenerFecha() {

    const fecha =
        new Date();


    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");


    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");


    const año =
        fecha.getFullYear();


    return `${dia}/${mes}/${año}`;

}


/* =========================================
   FECHA PARA EL NOMBRE DEL ARCHIVO
========================================= */

function obtenerFechaArchivo() {

    const fecha =
        new Date();


    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");


    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");


    const año =
        fecha.getFullYear();


    return `${dia}-${mes}-${año}`;

}


/* =========================================
   LIMPIAR NOMBRE DEL ARCHIVO
========================================= */

function limpiarNombreArchivo(
    nombre
) {

    return nombre
        .trim()
        .replace(
            /[<>:"/\\|?*]/g,
            ""
        )
        .replace(
            /\s+/g,
            "_"
        );

}


/* =========================================
   TEXTO EN VARIAS LÍNEAS
========================================= */

function textoEnLineas(
    doc,
    texto,
    ancho
) {

    return doc.splitTextToSize(
        texto || "",
        ancho
    );

}


/* =========================================
   GENERAR PDF
========================================= */

generarBtn.addEventListener(
    "click",
    async function () {


        /* =========================
           VALIDACIONES
        ========================== */

        if (
            !cliente.value.trim()
        ) {

            alert(
                "Ingrese el nombre del cliente."
            );

            cliente.focus();

            return;
        }


        if (
            !vestido.value.trim()
        ) {

            alert(
                "Ingrese la descripción del vestido."
            );

            vestido.focus();

            return;
        }


        if (
            obtenerNumero(precio) <= 0
        ) {

            alert(
                "Ingrese un precio válido."
            );

            precio.focus();

            return;
        }


        /* =========================
           COMPROBAR jsPDF
        ========================== */

        if (
            !window.jspdf ||
            !window.jspdf.jsPDF
        ) {

            alert(
                "No se pudo cargar jsPDF.\n\n" +
                "Compruebe que tenga conexión " +
                "a Internet y vuelva a cargar " +
                "la página."
            );

            return;
        }


        /* =========================
           DATOS
        ========================== */

        const cantidadValor =
            obtenerNumero(cantidad);

        const precioValor =
            obtenerNumero(precio);

        const abonadoValor =
            obtenerNumero(abonado);

        const anticipoValor =
            obtenerNumero(anticipo);


        const subtotal =
            cantidadValor *
            precioValor;


        const anticipoMonto =
            subtotal *
            (anticipoValor / 100);


        const pendienteAnticipo =
            Math.max(
                anticipoMonto -
                abonadoValor,
                0
            );


        const saldo =
            Math.max(
                subtotal -
                abonadoValor,
                0
            );


        /* =========================
           CARGAR IMÁGENES
        ========================== */

        let logoData = null;

        let vestidoData = null;


        try {

            logoData =
                await archivoADataURL(
                    logo.files[0]
                );


            vestidoData =
                await archivoADataURL(
                    imagen.files[0]
                );

        } catch (error) {

            console.error(error);

            alert(
                "No se pudo cargar una de las imágenes."
            );

            return;
        }


        /* =========================
           CREAR DOCUMENTO
        ========================== */

        const jsPDF =
            window.jspdf.jsPDF;


        const doc =
            new jsPDF({

                orientation: "portrait",

                unit: "mm",

                format: "a4"

            });


        const anchoPagina =
            210;

        const altoPagina =
            297;

        const margen =
            18;

        const anchoContenido =
            anchoPagina -
            (margen * 2);


        let y =
            18;


        /* =========================
           ENCABEZADO
        ========================== */

        doc.setFillColor(
            25,
            25,
            25
        );


        doc.roundedRect(
            margen,
            y,
            anchoContenido,
            34,
            4,
            4,
            "F"
        );


        /* LOGO */

        if (logoData) {

            try {

                doc.addImage(
                    logoData,
                    "AUTO",
                    margen + 6,
                    y + 7,
                    20,
                    20
                );

            } catch (error) {

                console.log(
                    "No se pudo colocar el logo."
                );

            }

        }


        /* EMPRESA */

        doc.setTextColor(
            255,
            255,
            255
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            16
        );


        doc.text(
            empresa.value.trim() ||
            "ATELIER",
            margen + 32,
            y + 13
        );


        /* DIRECCIÓN Y TELÉFONO */

        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            8
        );


        let informacion =
            "";


        if (
            direccion.value.trim()
        ) {

            informacion =
                direccion.value.trim();

        }


        if (
            telefono.value.trim()
        ) {

            if (informacion) {

                informacion +=
                    "  •  ";

            }

            informacion +=
                telefono.value.trim();

        }


        doc.text(
            informacion,
            margen + 32,
            y + 20
        );


        /* COTIZACIÓN */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            "COTIZACIÓN",
            anchoPagina -
            margen -
            6,
            y + 12,
            {
                align: "right"
            }
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            8
        );


        doc.text(
            obtenerFecha(),
            anchoPagina -
            margen -
            6,
            y + 20,
            {
                align: "right"
            }
        );


        y += 45;


        /* =========================
           INFORMACIÓN DEL CLIENTE
        ========================== */

        doc.setTextColor(
            30,
            30,
            30
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            11
        );


        doc.text(
            "Información del cliente",
            margen,
            y
        );


        y += 7;


        doc.setDrawColor(
            220,
            220,
            220
        );


        doc.line(
            margen,
            y,
            anchoPagina - margen,
            y
        );


        y += 8;


        doc.setFontSize(
            8
        );


        doc.text(
            "CLIENTE",
            margen,
            y
        );


        doc.text(
            "NÚMERO DE CLIENTE",
            margen + 95,
            y
        );


        y += 5;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            cliente.value.trim(),
            margen,
            y
        );


        doc.text(
            numeroCliente.value.trim() ||
            "—",
            margen + 95,
            y
        );


        y += 15;


        /* =========================
           DETALLES DEL VESTIDO
        ========================== */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            11
        );


        doc.text(
            "Detalles del vestido",
            margen,
            y
        );


        y += 7;


        doc.setDrawColor(
            220,
            220,
            220
        );


        doc.line(
            margen,
            y,
            anchoPagina - margen,
            y
        );


        y += 8;


        doc.setFontSize(
            8
        );


        doc.text(
            "DESCRIPCIÓN",
            margen,
            y
        );


        y += 5;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            9
        );


        const descripcion =
            textoEnLineas(
                doc,
                vestido.value.trim(),
                100
            );


        doc.text(
            descripcion,
            margen,
            y
        );


        /* =========================
           RESUMEN DEL PRECIO
        ========================== */

        const cajaX =
            margen + 110;


        const cajaAncho =
            anchoContenido - 110;


        doc.setFillColor(
            245,
            245,
            245
        );


        doc.roundedRect(
            cajaX,
            y - 5,
            cajaAncho,
            31,
            3,
            3,
            "F"
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            8
        );


        doc.text(
            "CANTIDAD",
            cajaX + 5,
            y + 3
        );


        doc.text(
            "PRECIO",
            cajaX + 5,
            y + 12
        );


        doc.text(
            "TOTAL",
            cajaX + 5,
            y + 22
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.text(
            String(cantidadValor),
            anchoPagina -
            margen -
            5,
            y + 3,
            {
                align: "right"
            }
        );


        doc.text(
            formatoMoneda(
                precioValor
            ),
            anchoPagina -
            margen -
            5,
            y + 12,
            {
                align: "right"
            }
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            formatoMoneda(
                subtotal
            ),
            anchoPagina -
            margen -
            5,
            y + 22,
            {
                align: "right"
            }
        );


        y += Math.max(
            descripcion.length * 4,
            31
        );


        y += 12;


        /* =========================
           IMAGEN DE REFERENCIA
        ========================== */

        if (vestidoData) {

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.setFontSize(
                11
            );


            doc.text(
                "Referencia del vestido",
                margen,
                y
            );


            y += 7;


            let anchoImagen =
                75;

            let altoImagen =
                65;


            try {

                const imagenTemporal =
                    new Image();


                imagenTemporal.src =
                    vestidoData;


                await new Promise(
                    resolve => {

                        imagenTemporal.onload =
                            resolve;

                        imagenTemporal.onerror =
                            resolve;

                    }
                );


                if (
                    imagenTemporal.naturalWidth &&
                    imagenTemporal.naturalHeight
                ) {

                    const proporcion =
                        imagenTemporal.naturalWidth /
                        imagenTemporal.naturalHeight;


                    altoImagen =
                        anchoImagen /
                        proporcion;


                    if (
                        altoImagen > 65
                    ) {

                        altoImagen =
                            65;

                        anchoImagen =
                            altoImagen *
                            proporcion;

                    }

                }

            } catch (error) {

                console.log(
                    "No se pudo calcular la imagen."
                );

            }


            if (
                y + altoImagen >
                altoPagina - 75
            ) {

                doc.addPage();

                y = 20;

            }


            try {

                doc.addImage(
                    vestidoData,
                    "AUTO",
                    margen,
                    y,
                    anchoImagen,
                    altoImagen
                );


                y +=
                    altoImagen +
                    12;

            } catch (error) {

                console.log(
                    "No se pudo agregar la imagen."
                );

            }

        }


        /* =========================
           RESUMEN DE PAGO
        ========================== */

        if (
            y + 60 >
            altoPagina - 15
        ) {

            doc.addPage();

            y = 20;

        }


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            11
        );


        doc.text(
            "Resumen de pago",
            margen,
            y
        );


        y += 7;


        doc.setFillColor(
            248,
            248,
            248
        );


        doc.roundedRect(
            margen,
            y,
            anchoContenido,
            48,
            4,
            4,
            "F"
        );


        const derecha =
            anchoPagina -
            margen -
            6;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            9
        );


        doc.setTextColor(
            70,
            70,
            70
        );


        /* SUBTOTAL */

        doc.text(
            "Subtotal",
            margen + 8,
            y + 10
        );


        doc.text(
            formatoMoneda(
                subtotal
            ),
            derecha,
            y + 10,
            {
                align: "right"
            }
        );


        /* ANTICIPO */

        doc.text(
            `Anticipo requerido (${anticipoValor}%)`,
            margen + 8,
            y + 20
        );


        doc.text(
            formatoMoneda(
                anticipoMonto
            ),
            derecha,
            y + 20,
            {
                align: "right"
            }
        );


        /* ABONADO */

        doc.text(
            "Abonado",
            margen + 8,
            y + 30
        );


        doc.text(
            formatoMoneda(
                abonadoValor
            ),
            derecha,
            y + 30,
            {
                align: "right"
            }
        );


        /* PENDIENTE */

        doc.text(
            "Pendiente de anticipo",
            margen + 8,
            y + 40
        );


        doc.text(
            formatoMoneda(
                pendienteAnticipo
            ),
            derecha,
            y + 40,
            {
                align: "right"
            }
        );


        /* =========================
           SALDO FINAL
        ========================== */

        y += 57;


        doc.setFillColor(
            25,
            25,
            25
        );


        doc.roundedRect(
            margen,
            y,
            anchoContenido,
            17,
            3,
            3,
            "F"
        );


        doc.setTextColor(
            255,
            255,
            255
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            "SALDO RESTANTE",
            margen + 7,
            y + 11
        );


        doc.text(
            formatoMoneda(
                saldo
            ),
            derecha,
            y + 11,
            {
                align: "right"
            }
        );


        /* =========================
           PIE DE PÁGINA
        ========================== */

        doc.setDrawColor(
            220,
            220,
            220
        );


        doc.line(
            margen,
            altoPagina - 20,
            anchoPagina - margen,
            altoPagina - 20
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            7
        );


        doc.setTextColor(
            120,
            120,
            120
        );


        doc.text(
            "Gracias por confiar en nuestro atelier.",
            margen,
            altoPagina - 12
        );


        doc.text(
            empresa.value.trim() ||
            "Atelier",
            anchoPagina - margen,
            altoPagina - 12,
            {
                align: "right"
            }
        );


        /* =========================
           GUARDAR PDF
        ========================== */

        const nombre =
            limpiarNombreArchivo(
                cliente.value
            ) ||
            "Cliente";


        const archivo =
            `${nombre}_${obtenerFechaArchivo()}.pdf`;


        doc.save(
            archivo
        );

    }
);


/* =========================================
   BOTÓN LIMPIAR
========================================= */

limpiarBtn.addEventListener(
    "click",
    function () {

        cliente.value = "";

        numeroCliente.value = "";

        vestido.value = "";

        cantidad.value = "1";

        precio.value = "";

        abonado.value = "0";

        anticipo.value = "50";

        empresa.value = "";

        direccion.value = "";

        telefono.value = "";

        imagen.value = "";

        logo.value = "";

        previewImagen.innerHTML = "";

        calcular();

    }
);


/* =========================================
   INICIO
========================================= */

calcular();