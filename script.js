/* Jesús Basallote Gallardo 3r GEINF */

//Definicions de les cartes
const TIPUS_CARTES = ['♠', '♣', '♥', '♦'];
const NOM_VALOR_CARTES = [
    { nom: '1', valor: 1 },
    { nom: '2', valor: 2 },
    { nom: '3', valor: 3 },
    { nom: '4', valor: 4 },
    { nom: '5', valor: 5 },
    { nom: '6', valor: 6 },
    { nom: '7', valor: 7 },
    { nom: 'J', valor: 0.5 },
    { nom: 'Q', valor: 0.5 },
    { nom: 'K', valor: 0.5 }
];
class Carta{
    //Classe contenidor per a definir una carta
    constructor(nom,tipus,valor) {
        this.nom=nom;
        this.tipus=tipus;
        this.valor=valor;
    }
}
class Participant{
    //Classe amb les dades i lògiques comunes a jugadors i crupiers
    constructor(tipusJugador=1,nom='ANONIM',saldo=0,aposta=0,puntuacio=0) {
        this.tipus=tipusJugador;
        this.nom=nom;
        this.saldo=saldo;
        this.aposta=aposta;
        this.puntuacio=puntuacio;
    }
    establirAposta(novaAposta){
        this.aposta=novaAposta;
    }
    modificarPuntuacio(carta){
        this.puntuacio= this.puntuacio+carta.valor;
        if(this.tipus===0){
            document.getElementById("puntCrupier").innerText=this.puntuacio;
        }
        else{
            document.getElementById("puntJuga").innerText=this.puntuacio;
        }
    }
}
//Variables globals per al Jugador, el Crupier i la baralla que faran servir
var jugador=new Participant();
var crupier=new Participant(0);
var baralla=[];

function crearBoto(zona,id,classe, text, funcio){
    //Funció auxiliar per a crear un botó
    var contenidor = document.getElementById(zona);
    var btReinici = document.createElement('button');
    btReinici.classList.add(classe);
    btReinici.id=id;
    btReinici.innerText=text;
    btReinici.onclick = funcio;
    contenidor.appendChild(btReinici);
}
    
function carregarJoc(){
    //Funció inicial per establir els valors del joc
    var nomUsuari=document.getElementById("nomIntro").value;
    var saldoUsuari=parseInt(document.getElementById("dinerIntro").value);
    if(nomUsuari === ''){
        alert("Error, non valid name!");
    }
    else{
        document.getElementById("puntJugaNom").innerText=nomUsuari;
        jugador.nom=nomUsuari;
        if (isNaN(saldoUsuari) || saldoUsuari<=0){
            alert("Error, non valid balance value!");
            cancelarcarregarJoc();
        }
        else{            
            document.getElementById("balance").innerText=saldoUsuari;
            jugador.saldo=saldoUsuari;
            iniciarVariablesJoc();
            document.getElementById("menuInici").style.display="none";
            crearBoto("btAccions","demanaCarta","btn","Take Card",ferJoc);
            crearBoto("btAccions","paraCarta","btn","Stand",pararJoc); 
            crearBoto("zonaBtAposta","botoAposta","dinerConfirma","Bet",ferAposta);
            crearBoto("zonaBtAposta","botoCancelaAposta","dinerCancela","Cancel",cancelarApostaEntrant); 
            setTimeout(function() {
                document.getElementById("taulaJoc").style.visibility="visible";
            }, 750)
        }
    }
}
function cancelarcarregarJoc(){
    //Cancel·la la càrrega del joc
    document.getElementById("dinerIntro").value="";
}
function acabarJoc(){
    //Finalitza el joc 
    if(jugador.saldo>0){
        alert("You have received: "+jugador.saldo+"€");
    }
    alert(jugador.nom+". See you next time!");
    location.reload();
}
function reiniciar(){
    //Reinicia el joc per a tornar a jugar
    document.getElementById("taulaJoc").style.visibility="hidden";
    setTimeout(function() {
        //Fer temps...
        console.log();
    }, 500);

    //Restaurem valors dels botons i textos
    var boto = document.getElementById('reinicia');
    boto.parentNode.removeChild(boto);
    boto = document.getElementById('acabar');
    boto.parentNode.removeChild(boto);
    boto = document.getElementById('demanaCarta');
    boto.parentNode.removeChild(boto);
    boto = document.getElementById('paraCarta');
    boto.parentNode.removeChild(boto);
    boto = document.getElementById('botoAposta');
    boto.parentNode.removeChild(boto);
    boto = document.getElementById('botoCancelaAposta');
    boto.parentNode.removeChild(boto);
    
    //Creem cartes falses auxiliars
    var dummy = document.createElement("div");
    dummy.className = "carta";
    dummy.id = "dummyCarta";
    dummy.style.visibility = "hidden";
    //Eliminem i substituim les cartes de les taules
    var element = document.getElementById("taulaCartesCrupier");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    element.appendChild(dummy);

    var dummy = document.createElement("div");
    dummy.className = "carta";
    dummy.id = "dummyCarta";
    dummy.style.visibility = "hidden";
    element = document.getElementById("taulaCartesJuga");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    element.appendChild(dummy);

    //Restablim la finestra de log
    element = document.getElementById("log");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    //Iniciem les variables comunes del joc
    iniciarVariablesJoc();
    //Creem els botons
    crearBoto("btAccions","demanaCarta","btn","Take Card",ferJoc);
    crearBoto("btAccions","paraCarta","btn","Stand",pararJoc); 
    crearBoto("zonaBtAposta","botoAposta","dinerConfirma","Bet",ferAposta);
    crearBoto("zonaBtAposta","botoCancelaAposta","dinerCancela","Cancel",cancelarApostaEntrant); 
    setTimeout(function() {
        document.getElementById("taulaJoc").style.visibility="visible";
    }, 500)
     
}
function mostrarMissatge(missatge) {
    //Funció auxiliar per a mostrar un missatge a la finestra del log
    const log = document.getElementById("log");
    log.innerHTML += `<p>${missatge}</p>`;
    log.scrollTop = log.scrollHeight;
}
function crearBaralla(){
    //Crea la baralla de cartes i dona la benvinguda al jugador
    mostrarMissatge("Welcome to Seven and a Half, "+jugador.nom+"!")
    let aux = [];
    for (let tipus of TIPUS_CARTES) {
        for (let valor of NOM_VALOR_CARTES) {
            aux.push(new Carta(valor.nom, tipus, valor.valor ));
        }
    }
    return aux;
}
function iniciarVariablesJoc(){
    //Inicia les variables comunes del joc
    baralla=crearBaralla();
    jugador.puntuacio=0;
    crupier.puntuacio=0;
    document.getElementById("puntJuga").innerText=0;
    document.getElementById("puntCrupier").innerText=0;
}
function ferAposta(){
    //Permet fer les apostes del joc
    var aposta=parseInt(document.getElementById("introAposta").value);
    if(! isNaN(aposta) && aposta>0){
        if(aposta>jugador.saldo){
            alert("Error, money bet is greater than account balance!")
        } 
        else{
            console.log(Math.floor(0.1*jugador.saldo))
            if(jugador.saldo>=10 && Math.floor(0.1*jugador.saldo)>=aposta){
                var resposta = confirm("Come on, you can bet more money. Why not take a chance?");
                if (resposta) {
                    document.getElementById("introAposta").value="";
                    return;
                }
            }
            document.getElementById("apostaActual").innerText=aposta;
            document.getElementById("botoAposta").disabled = true;
            document.getElementById("botoCancelaAposta").disabled = true;
            jugador.aposta=aposta;
            if(aposta==jugador.saldo){
                mostrarMissatge(jugador.nom+", bets everything!");
            }
            else{
                mostrarMissatge(jugador.nom+", bets "+aposta+"€!");
            }
        }
    }
    else{
        alert("Non valid value!");
    }
    document.getElementById("introAposta").value="";
}
function cancelarApostaEntrant(){
    //Cancel·la l'aposta entrada
    document.getElementById("introAposta").value="";
}
function agafarCarta(participant){
    //Funció per a que el jugador o Crupier puguin agafar una carta
    const index = Math.floor(Math.random() * baralla.length);
    var cartaAgafada=baralla.splice(index, 1)[0];
    participant.modificarPuntuacio(cartaAgafada);
    var tipus=(participant.tipus===0?"taulaCartesCrupier":"taulaCartesJuga");
    var contenidor = document.getElementById(tipus);

    //Fem temps per a que sembli que agafem la carta
    setTimeout(function() {
        var dummy = contenidor.querySelector('#dummyCarta');
        if (dummy) {
            dummy.remove();
        }
        var novaCarta = document.createElement('div');
        novaCarta.classList.add('carta');
        novaCarta.textContent = `${cartaAgafada.tipus} ${cartaAgafada.nom}`;
        if(cartaAgafada.tipus==='♥' || cartaAgafada.tipus==='♦'){
            novaCarta.style.color = 'red';
        }
        contenidor.appendChild(novaCarta);
    }, 500)
}
function ferJoc(){
    //El jugador fa les accions del joc
    if(jugador.aposta!=0){
        agafarCarta(jugador);
        mostrarMissatge(jugador.nom+" takes a card...");
        if(jugador.puntuacio>7.5){
            setTimeout(function() {
                document.getElementById("demanaCarta").disabled = true;
                document.getElementById("paraCarta").disabled = true;
                evaluarResultatJoc();
            }, 750)
        }
    }
    else{
        alert("You cannot play without making a bet!");
    }
}

function ferJocCrupier(){
    //El crupier fa les accions del joc
    return new Promise((resolve) => {
        function pasAPas() {
            if (crupier.puntuacio < 6 && jugador.puntuacio>crupier.puntuacio) {
                mostrarMissatge("Dealer takes a card...");
                agafarCarta(crupier);
                setTimeout(pasAPas, 1000); 
            } 
            else {
                resolve();
            }
        }
        pasAPas();
    });
}
function pararJoc(){
    //El jugador decideix deixar d'agafar cartes
    mostrarMissatge(jugador.nom+" stands...");
    document.getElementById("demanaCarta").disabled = true;
    document.getElementById("paraCarta").disabled = true;
    setTimeout(function() {
        ferJocCrupier().then(() => {
            mostrarMissatge("Dealer stands...");
            evaluarResultatJoc();
        });
    }, 500);
}
function evaluarResultatJoc(){
    //Funcio per a comprovar el guanyador de la partida
    if(jugador.puntuacio>7.5 || (crupier.puntuacio<=7.5 && crupier.puntuacio>=jugador.puntuacio)){
        mostrarMissatge("Sorry, you have lost... The Bank wins "+jugador.aposta+"€!");
        jugador.saldo=jugador.saldo-jugador.aposta;
    }
    else{
        mostrarMissatge("Congratulations "+jugador.nom+". You have won "+jugador.aposta+"€!");
        jugador.saldo=jugador.saldo+jugador.aposta;
    }
    document.getElementById("balance").innerText=jugador.saldo;
    document.getElementById("apostaActual").innerText=0;
    jugador.aposta=0;
    if(jugador.saldo>0){
        crearBoto("btAccions","reinicia","btn","Restart Game",reiniciar);
    }
    else{
        mostrarMissatge("Oh no, you have gone bankrupt. Better luck next time...")
    }
    crearBoto("btAccions","acabar","btn","End Game",acabarJoc);
}
