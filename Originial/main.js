let port;
let writer;

let encoder = new TextEncoder();

async function Conectar(boton) {
    if (document.getElementById("metodo").value.includes("Cable")) {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            writer = await port.writable.getWriter();

        }
        catch (e) {
            console.log(e)
        }
    }

    /* ------------------------------ Deshabilitar ------------------------------ */

    boton.value = "Conectado"
    boton.disabled = true
    boton.setAttribute("style", "color: grey;")
    document.getElementById("metodo").disabled = true
    document.getElementById("metodo").setAttribute("style", "color: grey;")

    /* -------------------------------- Habilitar ------------------------------- */

    document.querySelector("#Desconectar").removeAttribute("style")
    document.querySelector("#Desconectar").removeAttribute("disabled")
    document.querySelector("#mode").removeAttribute("style")
    document.querySelector("#mode").removeAttribute("disabled")
    document.querySelector("#Color").removeAttribute("style")
    document.querySelector("#Color").removeAttribute("disabled")
}

async function Desconectar() {

    let boton = document.getElementById("conectar")

    if (document.getElementById("metodo").value.includes("Cable")) {

        await writer.releaseLock()
        await port.close()

        port = undefined
        writer = undefined

    }

    /* ------------------------------ Deshabilitar ------------------------------ */

    document.getElementById("Color").setAttribute("disabled", true)
    document.getElementById("Color").setAttribute("style", "color: grey;")
    document.getElementById("mode").setAttribute("disabled", true)
    document.getElementById("mode").setAttribute("style", "color: grey;")

    /* -------------------------------- Habilitar ------------------------------- */

    boton.value = "Conectar"
    boton.disabled = false
    boton.removeAttribute("style")
    document.getElementById("metodo").disabled = false
    document.getElementById("metodo").removeAttribute("style")

}

async function Color(color) {
    const r = parseInt(color.value.substr(1, 2), 16)
    const g = parseInt(color.value.substr(3, 2), 16)
    const b = parseInt(color.value.substr(5, 2), 16)
    console.log(r, g, b)
    await writer.write(encoder.encode(`rgb ${r} ${g} ${b}`))
}

async function CambiarModo(boton) {
    await writer.write(encoder.encode(`mode hue`))
    if (boton.value.includes("Color")) {
        document.querySelector("#Color").setAttribute("style", "color: grey;")
        document.querySelector("#Color").setAttribute("disabled", true)
        document.querySelector("#Color").disabled = true
        boton.value = "Modo: Rotacion Hue"
    }
    else {
        document.querySelector("#Color").removeAttribute("style")
        document.querySelector("#Color").disabled = false
        document.querySelector("#Color").removeAttribute("disabled")
        boton.value = "Modo: Color solido"
    }
}

async function CambiarConexion(boton) {
    boton.value = boton.value == "Metodo: Cable" ? "Metodo: Bluetooth" : "Metodo: Cable"
}