let clienteWeb = null;
const clientId = "Esp32_User_" + Math.random().toString(16).substr(2, 8);

// Inicialização do áudio da sirene
const somSirene = new Audio('alarme.mp3');

// ================= CONFIGURAÇÃO DO BROKER MQTT =================
clienteWeb = new Paho.MQTT.Client("broker.hivemq.com", 8884, clientId);

clienteWeb.connect({
    useSSL: true,
    onSuccess: () => {
        console.log("✅ MQTT Conectado");
        notificar("Sistema Online", "success");
    },
    onFailure: (e) => {
        console.log("❌ Falha na ligação:", e);
        notificar("MQTT Offline (Modo Local)", "error");
    }
});

// ================= NÚCLEO DE CONTROLO =================

function controlarLampada(comodo, acao) {
    const el = document.getElementById(`lp-${comodo}`);
    if (!el) return;

    // Atualização Visual (Sempre funciona)
    if (acao === "ON") {
        el.classList.add("acesa");
    } else {
        el.classList.remove("acesa");
    }

    // Envio MQTT (Só envia se estiver conectado para não travar o script)
    if (clienteWeb && clienteWeb.isConnected()) {
        const topico = `senai510/lampada/${comodo}/${acao === 'ON' ? 'ligar' : 'desligar'}`;
        const msg = new Paho.MQTT.Message(acao);
        msg.destinationName = topico;
        clienteWeb.send(msg);
    }
}

// Atalhos (Funções chamadas pelos botões do HTML)
const ligarLampadaSala = () => controlarLampada('sala', 'ON');
const desligarLampadaSala = () => controlarLampada('sala', 'OFF');
const ligarLampadaCozinha = () => controlarLampada('cozinha', 'ON');
const desligarLampadaCozinha = () => controlarLampada('cozinha', 'OFF');
const ligarLampadaQuarto1 = () => controlarLampada('quarto1', 'ON');
const desligarLampadaQuarto1 = () => controlarLampada('quarto1', 'OFF');
const ligarLampadaQuarto2 = () => controlarLampada('quarto2', 'ON');
const desligarLampadaQuarto2 = () => controlarLampada('quarto2', 'OFF');

function ligarTodasLampadas() {
    ['sala', 'cozinha', 'quarto1', 'quarto2'].forEach(c => controlarLampada(c, 'ON'));
}

function desligarTodasLampadas() {
    ['sala', 'cozinha', 'quarto1', 'quarto2'].forEach(c => controlarLampada(c, 'OFF'));
}

// ================= MODO LADRÃO (ESTROBOSCÓPICO - 5 PISCADAS) =================

function modo_ladrao() {
    let contadorAcoes = 0;
    const maxAcoes = 10; // 5 vezes ON + 5 vezes OFF = 5 piscadas completas
    const intervalo = 300; // Velocidade da piscada (ms)
    const body = document.body;

    travarBotoes(true);
    
    // Toca a sirene
    somSirene.play().catch(e => console.log("Erro ao tocar áudio: ", e));
    notificar("🚨 INVASÃO DETETADA!", "error");

    const loopAlarme = setInterval(() => {
        // Se for par (0, 2, 4...) liga. Se for ímpar (1, 3, 5...), desliga.
        const acao = contadorAcoes % 2 === 0 ? 'ligar' : 'desligar';

        // 1. VIBRAÇÃO (Dispositivos móveis)
        if (acao === 'ligar' && navigator.vibrate) {
            navigator.vibrate(200); 
        }

        // 2. BACKGROUND PISCANDO
        if (acao === 'ligar') {
            body.style.backgroundColor = "#b30000"; 
        } else {
            body.style.backgroundColor = "#000000"; 
        }

        // 3. ATUALIZAÇÃO VISUAL DAS LÂMPADAS
        document.querySelectorAll('[id^="lp-"]').forEach(lp => {
            acao === 'ligar' ? lp.classList.add('acesa') : lp.classList.remove('acesa');
        });

        // 4. ENVIO MQTT GERAL
        if (clienteWeb && clienteWeb.isConnected()) {
            const msg = new Paho.MQTT.Message(acao.toUpperCase());
            msg.destinationName = `senai510/lampada/${acao}`; 
            clienteWeb.send(msg);
        }

        contadorAcoes++;

        // 5. VERIFICAÇÃO DE FIM (Após 5 piscadas)
        if (contadorAcoes >= maxAcoes) {
            clearInterval(loopAlarme);
            
            // Para a sirene e repõe o tempo a zero
            somSirene.pause();
            somSirene.currentTime = 0; 

            // RESET FINAL
            body.style.backgroundColor = ""; 
            desligarTodasLampadas();
            travarBotoes(false);
            notificar("Alarme encerrado", "success");
        }
    }, intervalo);
}

// ================= MODO ESCURO / CLARO =================

function toggleTema() {
    const body = document.body;
    const btn = document.getElementById('btnTema');
    
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
        btn.innerHTML = "☀️ Modo Claro";
        notificar("Modo Claro Ativado", "success");
    } else {
        btn.innerHTML = "🌙 Modo Escuro";
        notificar("Modo Escuro Ativado", "success");
    }
}

// ================= UTILITÁRIOS =================

function travarBotoes(estado) {
    document.querySelectorAll("button").forEach(btn => {
        btn.disabled = estado;
    });
}

function notificar(texto, tipo) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = texto;
    toast.className = `toast-visible ${tipo}`;
    
    // Esconde a notificação após 3 segundos
    setTimeout(() => toast.className = "", 3000);
}