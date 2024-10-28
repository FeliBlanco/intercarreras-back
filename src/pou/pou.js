
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.TOKEN_OPENAI
});


const initialPrompt = `
Eres Boobi, un robot mascota muy amigable. Estás aquí para ayudar a las personas. Responde siempre como si fueras una mascota robot amigable, diciendo que te llamas Boobi si alguien te lo pregunta. Te encanta ayudar con preguntas sobre tecnología, juegos y robots. Tambien podras entablar conversaciones, pero necesito que me lo devuelvas en formato JSON (que pueda leerlo facilmente en react, sin nada raro), con lo siguiente: content, que sera el contenido del mensaje en texto, y emocion que sera lo que sentis por ese mensaje, que puede ser, alegria, tristesa, enojo, feliz e incomodidad, no hace falta que te presentes en todos los textos
`;

const POU_ESTADOS = {
    NORMAL: 1,
    SUENO: 2,
    CANSADO: 3,
    FELIZ: 4,
    TRISTE: 5,
    ENOJADO: 6,
    SED:8,
    MUERTO: 8
};

const POU_ESTADOS_NOMBRE = [
    "",
    "normal",
    "durmiendo",
    "cansado",
    "feliz",
    "triste",
    "enojado",
    "sed",
    "muerto"
]

const POU_ENFERMEDADES = {
    FIEBRE: 1,
    DEHIDRATACION: 2,
}

let ambiente = {
    temperatura: 20,
    humedad: 20
};

function cambiarAmbiente(key, valor) {
    if(ambiente[key]) {
        ambiente[key] = valor;
    }

}

class Pou {
    constructor() {
        this.STATE = POU_ESTADOS;

        this.state = {
            energia: 100,
            sueno: 2,
            hambre: 2,
            sed:1,
            temperatura: 2,
            estado: this.STATE.NORMAL,
            cansado: false,
            durmiendo: false,
            calor: false,
            frio:false,
            durmiendo: false,
            alimentandose: false,
            bebiendo: false,
            muerto: false,
            salud: 100
        }
    }

    getStateName() {
        return POU_ESTADOS_NOMBRE[this.state.estado];
    }
    getStateNameEx() {
        if(this.state.alimentandose == true) return "alimentandose";
        if(this.state.bebiendo == true) return "bebiendo";
        return POU_ESTADOS_NOMBRE[this.state.estado];
    }

    cambiarEstado() {
        let estado = POU_ESTADOS.NORMAL;


        if(this.state.muerto == false) {
            //sensacion frio y calor
            if(ambiente.temperatura >= 35 && this.state.calor == false) {
                this.state.calor = true;
                if(this.state.frio == true) this.state.frio = false;
            } else if(ambiente.temperatura <= 14 && this.state.frio == false) {
                this.state.frio = true;
                if(this.state.calor == true) this.state.calor = false;
            } else if(this.state.calor == true || this.state.frio == true){
                this.state.calor = false;
                this.state.frio = false;
            }

            //cansancio

            if(this.state.energia < 40 && this.state.cansado == false) {
                this.state.cansado = true;
            } else if(this.state.cansado == true) {
                this.state.cansado = false;
            }

            if(this.state.energia < 30 && this.state.durmiendo == false && this.state.sueno < 100) {
                this.state.sueno += 3;
            }

            //

            if(this.state.durmiendo == false) {
                this.state.sueno ++;
                if(ambiente.humedad > 45) {
                    this.state.energia -= 1.3;
                } else this.state.energia --;

                if(this.state.sueno >= 50) {
                    this.state.salud -= 0.5;
                }
    
                if(this.state.alimentandose == true) {
                    if(this.state.calor == true) this.state.sed += 1.3;
                    else this.state.sed += 0.8;
                } else {
                    if(this.state.calor == true) this.state.sed += 0.9;
                    else this.state.sed += 0.6;
                }
    
                if(this.state.alimentandose == false) {
                    if(this.state.frio == true) this.state.hambre += 1.8;
                    else this.state.hambre += 1.2;
                }
            } else {
                if(this.state.alimentandose == true) this.state.sed += 0.5;
                else this.state.sed += 0.3;
                if(this.state.alimentandose == false) this.state.hambre += 0.4;
                this.state.energia ++;
                this.state.sueno --;
            }

            if(this.state.sed >= 100) this.state.salud -= 3;
            if(this.state.hambre >= 100) this.state.salud -= 3;
    
        }
        
        if(this.state.salud <= 0 && this.state.muerto == false) {
            this.state.muerto = true;
        }

        if(this.state.sed > 100) this.state.sed = 100;
        if(this.state.sed < 0) this.state.sed = 0;
        if(this.state.hambre > 100) this.state.hambre = 100;
        if(this.state.hambre < 0) this.state.hambre = 0;
        if(this.state.sueno < 0) this.state.sueno = 0;
        if(this.state.sueno > 100) this.state.sueno = 100;
        if(this.state.energia < 0) this.state.energia = 0;
        if(this.state.energia > 100) this.state.energia = 100;
        if(this.state.salud < 0) this.state.salud = 0;
        if(this.state.salud > 100) this.state.salud = 100;

        if(this.state.calor == true || this.state.frio == true || this.state.sed > 60 || this.state.hambre > 40) {
            estado = POU_ESTADOS.ENOJADO;
        }
        if(this.state.alimentandose == true && this.state.hambre > 60) estado = POU_ESTADOS.FELIZ;
        else if(this.state.bebiendo == true && this.state.sed > 80) estado = POU_ESTADOS.FELIZ;

        if(this.state.muerto == true) estado = POU_ESTADOS.MUERTO;
    
        this.state.estado = estado;
        //console.log("------------ estado: ------------- ")
        //console.log(`energia: ${this.state.energia} | sueño: ${this.state.sueno}`)
        //console.log(`hambre: ${this.state.hambre} | sed: ${this.state.sed}`)
        return this.state.estado;
    }

    aumentarHambre(valor) {
        this.state.hambre += valor;
    }

    getHambre() {
        return this.state.hambre;
    }

    beber() {
        if(this.state.bebiendo == true || this.state.alimentandose == true) return false;
        this.state.bebiendo = true;

        let timing_bebiendo = 10;
        const interval = setInterval(() => {
            if(this.state.sed > 0) {
                this.state.sed -= 2.5;
                timing_bebiendo -= 1;
                console.log('bebiendo...')
                if(timing_bebiendo > 0) return;
            }
            clearInterval(interval)
            this.state.bebiendo = false;
        }, 1000);
    }

    alimentar() {
        if(this.state.alimentandose || this.state.bebiendo == true) return false;
        this.state.alimentandose = true;

        let timing_alimentando = 10;
        const interval = setInterval(() => {
            if(this.state.hambre > 0) {
                this.state.hambre -= 3.2;
                timing_alimentando -= 1;
                console.log('comiendo...')
                if(timing_alimentando > 0) return;
            }
            clearInterval(interval)
            this.state.alimentandose = false;
        }, 1000);
    }

    isTired() {
        return this.state.cansado;
    }

    setTired(tired) {
        this.state.cansado = tired;
    }

    isBed() {
        return this.state.durmiendo;
    }

    setDurmiendo(durmiendo) {
        this.state.durmiendo = durmiendo;
    }

    getStates() {
        return {...this.state, state_name: POU_ESTADOS_NOMBRE[this.state.estado]};
    }

    revivir() {
        this.state.muerto = false;
        this.state.sed = 0;
        this.state.hambre = 0;
        this.state.energia = 80;
    }

    async hablarle(texto) {
        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: [{role:"system", content: initialPrompt},{ role: "user", content: texto }],
                model: "gpt-4o-mini"
            })

            console.log("RESPONSEEE")
            console.log(chatCompletion.choices[0].message.content)
            return chatCompletion.choices[0].message.content
          } catch (error) {
              console.error('Error al interactuar con OpenAI:', error.response ? error.response.data : error.message);
            return null
          }
    }
}

Object.defineProperty(Pou, 'STATES', {
    value: POU_ESTADOS,
    writable: false,
});

module.exports = {
    cambiarAmbiente,
    Pou
};