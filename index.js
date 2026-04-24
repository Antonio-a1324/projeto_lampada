
let clienteWeb = null;
const clientId = "Esp32MFOF_"
clienteWeb = new Paho.MQTT.Client(
    "broker.hivemq.com",
    8884,
    clientId
);

clienteWeb.connect({
    onSuccess: function () {
        alert("Conectado ao broker MQTT");
    },
    onFailure: function () {
       alert("Falha na conexão");
    }
});


function ligarLampadaSala() {
    document.getElementById("lp-sala").classList.add("acesa");

    const msg = new Paho.MQTT.Message("ON");
    msg.destinationName = "senai510/lampada/sala/ligar";
    clienteWeb.send(msg);
}

function desligarLampadaSala() {
    document.getElementById("lp-sala").classList.remove("acesa");

    const msg = new Paho.MQTT.Message("OFF");
    msg.destinationName = "senai510/lampada/sala/desligar";
    clienteWeb.send(msg);
}

// ================= COZINHA =================
function ligarLampadaCozinha() {
    document.getElementById("lp-cozinha").classList.add("acesa");

    const msg = new Paho.MQTT.Message("ON");
    msg.destinationName = "senai510/lampada/cozinha/ligar";
    clienteWeb.send(msg);
}

function desligarLampadaCozinha() {
    document.getElementById("lp-cozinha").classList.remove("acesa");

    const msg = new Paho.MQTT.Message("OFF");
    msg.destinationName = "senai510/lampada/cozinha/desligar";
    clienteWeb.send(msg);
}


function ligarLampadaQuarto1() {
    document.getElementById("lp-quarto1").classList.add("acesa");

    const msg = new Paho.MQTT.Message("ON");
    msg.destinationName = "senai510/lampada/quarto1/ligar";
    clienteWeb.send(msg);
}

function desligarLampadaQuarto1() {
    document.getElementById("lp-quarto1").classList.remove("acesa");

    const msg = new Paho.MQTT.Message("OFF");
    msg.destinationName = "senai510/lampada/quarto1/desligar";
    clienteWeb.send(msg);
}


function ligarLampadaQuarto2() {
    document.getElementById("lp-quarto2").classList.add("acesa");

    const msg = new Paho.MQTT.Message("ON");
    msg.destinationName = "senai510/lampada/quarto2/ligar";
    clienteWeb.send(msg);
}

function desligarLampadaQuarto2() {
    document.getElementById("lp-quarto2").classList.remove("acesa");

    const msg = new Paho.MQTT.Message("OFF");
    msg.destinationName = "senai510/lampada/quarto2/desligar";
    clienteWeb.send(msg);
}

function ligarTodasLampadas() {
    document.getElementById("lp-sala").classList.add("acesa");
    document.getElementById("lp-cozinha").classList.add("acesa");
    document.getElementById("lp-quarto1").classList.add("acesa");
    document.getElementById("lp-quarto2").classList.add("acesa");

    const msg = new Paho.MQTT.Message("ON");
    msg.destinationName = "senai510/lampada/ligar";
    clienteWeb.send(msg);
}

function desligarTodasLampadas() {
    document.getElementById("lp-sala").classList.remove("acesa");
    document.getElementById("lp-cozinha").classList.remove("acesa");
    document.getElementById("lp-quarto1").classList.remove("acesa");
    document.getElementById("lp-quarto2").classList.remove("acesa");

    const msg = new Paho.MQTT.Message("OFF");
    msg.destinationName = "senai510/lampada/desligar";
    clienteWeb.send(msg);
}