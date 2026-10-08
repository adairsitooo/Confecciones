"use strict";


/* =========================================
   ATELIER JASY
   GENERADOR DE COTIZACIONES
========================================= */


/* =========================================
   DATOS FIJOS DEL ATELIER
========================================= */

const DATOS_ATELIER = {

    nombre:
        "Atelier JASY",

    direccion:
        "16 AV. 3-43 ZONA 4 DE VILLA NUEVA, LOCAL 17 PLAZA OCTUBRE",

    telefono:
        "+502-41858879",

    banner:
        "recursos/banner.jpeg"

};


/* =========================================
   ELEMENTOS
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

const fechaTalle =
    document.getElementById("fechaTalle");

const fechaEntrega =
    document.getElementById("fechaEntrega");

const imagenes =
    document.getElementById("imagenes");

const previewImagenes =
    document.getElementById("previewImagenes");

const precioResumen =
    document.getElementById("precioResumen");

const cantidadResumen =
    document.getElementById("cantidadResumen");

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
   MONEDA
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
   NÚMEROS
========================================= */

function obtenerNumero(elemento) {

    const numero =
        parseFloat(elemento.value);

    return isNaN(numero)
        ? 0
        : numero;

}


/* =========================================
   FECHA LEGIBLE
========================================= */

function fechaLegible(valor) {

    if (!valor) {

        return "No especificada";

    }


    const partes =
        valor.split("-");


    if (partes.length !== 3) {

        return valor;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =========================================
   FECHA ACTUAL
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
   FECHA PARA ARCHIVO
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
   CALCULAR
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


    precioResumen.textContent =
        formatoMoneda(
            precioValor
        );


    cantidadResumen.textContent =
        cantidadValor;


    subtotalElemento.textContent =
        formatoMoneda(
            subtotal
        );


    anticipoMontoElemento.textContent =
        formatoMoneda(
            anticipoMonto
        );


    abonadoMontoElemento.textContent =
        formatoMoneda(
            abonadoValor
        );


    pendienteAnticipoElemento.textContent =
        formatoMoneda(
            pendienteAnticipo
        );


    saldoElemento.textContent =
        formatoMoneda(
            saldo
        );

}


/* =========================================
   ACTUALIZACIÓN
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
   PREVISUALIZAR IMÁGENES
========================================= */

imagenes.addEventListener(
    "change",
    function () {

        previewImagenes.innerHTML = "";


        const archivos =
            Array.from(
                imagenes.files
            ).slice(0, 5);


        if (
            imagenes.files.length > 5
        ) {

            alert(
                "Solo puede agregar hasta 5 imágenes."
            );

        }


        archivos.forEach(
            archivo => {

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
                            "Referencia";


                        previewImagenes.appendChild(
                            img
                        );

                    };


                lector.readAsDataURL(
                    archivo
                );

            }
        );

    }
);


/* =========================================
   ARCHIVO → DATA URL
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
   CARGAR BANNER DESDE RECURSOS
========================================= */

async function cargarBanner() {

    try {

        const respuesta =
            await fetch(
                DATOS_ATELIER.banner
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se encontró el banner."
            );

        }


        const blob =
            await respuesta.blob();


        return await archivoADataURL(
            blob
        );

    } catch (error) {

        console.error(
            "No se pudo cargar el banner:",
            error
        );


        return null;

    }

}


/* =========================================
   LIMPIAR NOMBRE DE ARCHIVO
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
   AÑADIR TEXTO AJUSTADO
========================================= */

function agregarTextoAjustado(
    doc,
    texto,
    x,
    y,
    ancho
) {

    const lineas =
        doc.splitTextToSize(
            texto || "",
            ancho
        );


    doc.text(
        lineas,
        x,
        y
    );


    return lineas.length;

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
            !numeroCliente.value.trim()
        ) {

            alert(
                "Ingrese el número de celular."
            );

            numeroCliente.focus();

            return;

        }


        if (
            !vestido.value.trim()
        ) {

            alert(
                "Ingrese la descripción del pedido."
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


        if (
            obtenerNumero(cantidad) <= 0
        ) {

            alert(
                "La cantidad debe ser mayor que 0."
            );

            cantidad.focus();

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
                "No se pudo cargar el generador PDF.\n\n" +
                "Compruebe la conexión a Internet " +
                "y vuelva a cargar la página."
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
           CARGAR BANNER
        ========================== */

        const bannerData =
            await cargarBanner();


        /* =========================
           CARGAR REFERENCIAS
        ========================== */

        const archivosReferencia =
            Array.from(
                imagenes.files
            ).slice(0, 5);


        const referencias = [];


        for (
            const archivo
            of archivosReferencia
        ) {

            try {

                const data =
                    await archivoADataURL(
                        archivo
                    );


                if (data) {

                    referencias.push(
                        data
                    );

                }

            } catch (error) {

                console.error(error);

            }

        }


        /* =========================
           CREAR PDF
        ========================== */

        const jsPDF =
            window.jspdf.jsPDF;


        const doc =
            new jsPDF({

                orientation:
                    "portrait",

                unit:
                    "mm",

                format:
                    "a4"

            });


        const ANCHO =
            210;

        const ALTO =
            297;

        const MARGEN =
            18;

        const ANCHO_CONTENIDO =
            ANCHO -
            (MARGEN * 2);


        let y = 15;


        /* =========================
           BANNER
        ========================== */

        if (bannerData) {

            try {

                const bannerImg =
                    new Image();


                bannerImg.src =
                    bannerData;


                await new Promise(
                    resolve => {

                        bannerImg.onload =
                            resolve;

                        bannerImg.onerror =
                            resolve;

                    }
                );


                let anchoBanner =
                    ANCHO_CONTENIDO;

                let altoBanner =
                    34;


                if (
                    bannerImg.naturalWidth &&
                    bannerImg.naturalHeight
                ) {

                    const proporcion =
                        bannerImg.naturalWidth /
                        bannerImg.naturalHeight;


                    altoBanner =
                        anchoBanner /
                        proporcion;


                    if (
                        altoBanner > 42
                    ) {

                        altoBanner = 42;

                    }

                }


                doc.addImage(
                    bannerData,
                    "JPEG",
                    MARGEN,
                    y,
                    anchoBanner,
                    altoBanner
                );


                y +=
                    altoBanner +
                    12;

            } catch (error) {

                console.error(
                    "No se pudo colocar el banner.",
                    error
                );

            }

        }


        /* =========================
           DATOS DEL ATELIER
        ========================== */

        doc.setTextColor(
            185,
            104,
            134
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            16
        );


        doc.text(
            DATOS_ATELIER.nombre,
            MARGEN,
            y
        );


        y += 6;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            8
        );


        doc.setTextColor(
            90,
            90,
            90
        );


        const datosAtelier =
            `${DATOS_ATELIER.direccion}  •  ${DATOS_ATELIER.telefono}`;


        const lineasAtelier =
            doc.splitTextToSize(
                datosAtelier,
                ANCHO_CONTENIDO
            );


        doc.text(
            lineasAtelier,
            MARGEN,
            y
        );


        y +=
            (lineasAtelier.length * 4) +
            8;


        /* =========================
           TÍTULO COTIZACIÓN
        ========================== */

        doc.setDrawColor(
            201,
            162,
            39
        );


        doc.setLineWidth(
            0.8
        );


        doc.line(
            MARGEN,
            y,
            ANCHO - MARGEN,
            y
        );


        y += 9;


        doc.setTextColor(
            185,
            104,
            134
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            17
        );


        doc.text(
            "COTIZACIÓN",
            MARGEN,
            y
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            8
        );


        doc.setTextColor(
            100,
            100,
            100
        );


        doc.text(
            `Fecha: ${obtenerFecha()}`,
            ANCHO - MARGEN,
            y,
            {
                align: "right"
            }
        );


        y += 12;


        /* =========================
           INFORMACIÓN DEL CLIENTE
        ========================== */

        doc.setTextColor(
            185,
            104,
            134
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
            MARGEN,
            y
        );


        y += 6;


        doc.setDrawColor(
            230,
            210,
            218
        );


        doc.setLineWidth(
            0.4
        );


        doc.line(
            MARGEN,
            y,
            ANCHO - MARGEN,
            y
        );


        y += 8;


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            8
        );


        doc.setTextColor(
            110,
            110,
            110
        );


        doc.text(
            "CLIENTE",
            MARGEN,
            y
        );


        doc.text(
            "CELULAR",
            MARGEN + 105,
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


        doc.setTextColor(
            45,
            45,
            45
        );


        doc.text(
            cliente.value.trim(),
            MARGEN,
            y
        );


        doc.text(
            numeroCliente.value.trim(),
            MARGEN + 105,
            y
        );


        y += 14;


        /* =========================
           DESCRIPCIÓN DEL PEDIDO
        ========================== */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            11
        );


        doc.setTextColor(
            185,
            104,
            134
        );


        doc.text(
            "Descripción del pedido",
            MARGEN,
            y
        );


        y += 6;


        doc.setDrawColor(
            230,
            210,
            218
        );


        doc.line(
            MARGEN,
            y,
            ANCHO - MARGEN,
            y
        );


        y += 8;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            9
        );


        doc.setTextColor(
            55,
            55,
            55
        );


        const lineasDescripcion =
            doc.splitTextToSize(
                vestido.value.trim(),
                ANCHO_CONTENIDO
            );


        doc.text(
            lineasDescripcion,
            MARGEN,
            y
        );


        y +=
            Math.max(
                lineasDescripcion.length * 4.5,
                10
            ) +
            8;


        /* =========================
           MONTOS DETALLADOS
        ========================== */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            11
        );


        doc.setTextColor(
            185,
            104,
            134
        );


        doc.text(
            "Detalle de montos",
            MARGEN,
            y
        );


        y += 7;


        const tablaX =
            MARGEN;

        const tablaY =
            y;

        const col1 =
            92;

        const col2 =
            32;

        const col3 =
            50;


        /* ENCABEZADO */

        doc.setFillColor(
            216,
            137,
            164
        );


        doc.roundedRect(
            tablaX,
            tablaY,
            ANCHO_CONTENIDO,
            10,
            2,
            2,
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
            8
        );


        doc.text(
            "CONCEPTO",
            tablaX + 5,
            tablaY + 6.5
        );


        doc.text(
            "CANT.",
            tablaX + col1 + 5,
            tablaY + 6.5
        );


        doc.text(
            "MONTO",
            tablaX + col1 + col2 + 5,
            tablaY + 6.5
        );


        y += 10;


        /* FILAS */

        const filas = [

            [
                "Precio unitario",
                String(cantidadValor),
                formatoMoneda(
                    precioValor
                )
            ],

            [
                "Subtotal",
                "",
                formatoMoneda(
                    subtotal
                )
            ],

            [
                `Anticipo requerido (${anticipoValor}%)`,
                "",
                formatoMoneda(
                    anticipoMonto
                )
            ],

            [
                "Abonado",
                "",
                formatoMoneda(
                    abonadoValor
                )
            ],

            [
                "Pendiente de anticipo",
                "",
                formatoMoneda(
                    pendienteAnticipo
                )
            ]

        ];


        filas.forEach(
            (fila, indice) => {

                const altura =
                    10;


                if (
                    indice % 2 === 0
                ) {

                    doc.setFillColor(
                        253,
                        248,
                        250
                    );

                } else {

                    doc.setFillColor(
                        255,
                        255,
                        255
                    );

                }


                doc.rect(
                    tablaX,
                    y,
                    ANCHO_CONTENIDO,
                    altura,
                    "F"
                );


                doc.setDrawColor(
                    235,
                    220,
                    226
                );


                doc.rect(
                    tablaX,
                    y,
                    ANCHO_CONTENIDO,
                    altura
                );


                doc.setTextColor(
                    70,
                    70,
                    70
                );


                doc.setFont(
                    "helvetica",
                    "normal"
                );


                doc.setFontSize(
                    8
                );


                doc.text(
                    fila[0],
                    tablaX + 5,
                    y + 6.5
                );


                if (fila[1]) {

                    doc.text(
                        fila[1],
                        tablaX + col1 + 12,
                        y + 6.5,
                        {
                            align: "center"
                        }
                    );

                }


                doc.text(
                    fila[2],
                    tablaX +
                    col1 +
                    col2 +
                    col3 -
                    5,
                    y + 6.5,
                    {
                        align: "right"
                    }
                );


                y += altura;

            }
        );


        /* SALDO */

        doc.setFillColor(
            201,
            162,
            39
        );


        doc.roundedRect(
            tablaX,
            y,
            ANCHO_CONTENIDO,
            13,
            2,
            2,
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
            9
        );


        doc.text(
            "SALDO RESTANTE",
            tablaX + 5,
            y + 8.5
        );


        doc.text(
            formatoMoneda(
                saldo
            ),
            ANCHO - MARGEN - 5,
            y + 8.5,
            {
                align: "right"
            }
        );


        y += 23;


        /* =========================
           FECHAS
        ========================== */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            11
        );


        doc.setTextColor(
            185,
            104,
            134
        );


        doc.text(
            "Fechas",
            MARGEN,
            y
        );


        y += 7;


        const anchoFecha =
            (ANCHO_CONTENIDO - 8) / 2;


        /* TALLE */

        doc.setFillColor(
            253,
            248,
            250
        );


        doc.roundedRect(
            MARGEN,
            y,
            anchoFecha,
            23,
            3,
            3,
            "F"
        );


        doc.setTextColor(
            110,
            110,
            110
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            8
        );


        doc.text(
            "FECHA DE TALLE",
            MARGEN + 6,
            y + 8
        );


        doc.setTextColor(
            55,
            55,
            55
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            fechaLegible(
                fechaTalle.value
            ),
            MARGEN + 6,
            y + 17
        );


        /* ENTREGA */

        const fecha2X =
            MARGEN +
            anchoFecha +
            8;


        doc.setFillColor(
            253,
            248,
            250
        );


        doc.roundedRect(
            fecha2X,
            y,
            anchoFecha,
            23,
            3,
            3,
            "F"
        );


        doc.setTextColor(
            110,
            110,
            110
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            8
        );


        doc.text(
            "ENTREGA FINAL",
            fecha2X + 6,
            y + 8
        );


        doc.setTextColor(
            55,
            55,
            55
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            fechaLegible(
                fechaEntrega.value
            ),
            fecha2X + 6,
            y + 17
        );


        y += 34;


        /* =========================
           REFERENCIAS
        ========================== */

        if (
            referencias.length > 0
        ) {

            if (
                y + 85 >
                ALTO - 20
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


            doc.setTextColor(
                185,
                104,
                134
            );


            doc.text(
                "Imágenes de referencia",
                MARGEN,
                y
            );


            y += 8;


            /*
                Las imágenes se acomodan
                automáticamente en una
                cuadrícula de 2 columnas.
            */

            const anchoCelda =
                (ANCHO_CONTENIDO - 8) / 2;


            const anchoImagen =
                anchoCelda - 6;


            for (
                let i = 0;
                i < referencias.length;
                i++
            ) {

                const columna =
                    i % 2;


                const fila =
                    Math.floor(i / 2);


                let x =
                    MARGEN +
                    columna *
                    (anchoCelda + 8);


                let imagenY =
                    y +
                    fila * 70;


                if (
                    imagenY + 60 >
                    ALTO - 20
                ) {

                    doc.addPage();

                    y = 20;

                    imagenY = y;

                }


                doc.setFillColor(
                    253,
                    248,
                    250
                );


                doc.roundedRect(
                    x,
                    imagenY,
                    anchoCelda,
                    62,
                    3,
                    3,
                    "F"
                );


                try {

                    const img =
                        new Image();


                    img.src =
                        referencias[i];


                    await new Promise(
                        resolve => {

                            img.onload =
                                resolve;

                            img.onerror =
                                resolve;

                        }
                    );


                    let imgAncho =
                        anchoImagen;

                    let imgAlto =
                        54;


                    if (
                        img.naturalWidth &&
                        img.naturalHeight
                    ) {

                        const proporcion =
                            img.naturalWidth /
                            img.naturalHeight;


                        imgAlto =
                            imgAncho /
                            proporcion;


                        if (
                            imgAlto > 54
                        ) {

                            imgAlto = 54;

                            imgAncho =
                                imgAlto *
                                proporcion;

                        }

                    }


                    const imgX =
                        x +
                        (
                            anchoCelda -
                            imgAncho
                        ) / 2;


                    const imgY =
                        imagenY +
                        4 +
                        (
                            54 -
                            imgAlto
                        ) / 2;


                    doc.addImage(
                        referencias[i],
                        "AUTO",
                        imgX,
                        imgY,
                        imgAncho,
                        imgAlto
                    );

                } catch (error) {

                    console.error(
                        "No se pudo colocar una referencia.",
                        error
                    );

                }

            }


            y +=
                Math.ceil(
                    referencias.length / 2
                ) * 70 +
                5;

        }


        /* =========================
           PIE DE PÁGINA
        ========================== */

        if (
            y + 25 >
            ALTO - 10
        ) {

            doc.addPage();

        }


        const pieY =
            ALTO - 16;


        doc.setDrawColor(
            201,
            162,
            39
        );


        doc.setLineWidth(
            0.5
        );


        doc.line(
            MARGEN,
            pieY - 5,
            ANCHO - MARGEN,
            pieY - 5
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            7
        );


        doc.setTextColor(
            130,
            130,
            130
        );


        doc.text(
            "Gracias por confiar en Atelier JASY.",
            MARGEN,
            pieY
        );


        doc.text(
            DATOS_ATELIER.telefono,
            ANCHO - MARGEN,
            pieY,
            {
                align: "right"
            }
        );


        /* =========================
           GUARDAR
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
   LIMPIAR
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

        fechaTalle.value = "";

        fechaEntrega.value = "";

        imagenes.value = "";

        previewImagenes.innerHTML = "";

        calcular();

    }
);


/* =========================================
   INICIO
========================================= */

calcular();
