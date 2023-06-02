require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

class ChatGPTClass {
    openai = undefined;

    constructor() {
        this.init();
    }

    init = () => {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.openai = new OpenAIApi(configuration);
    };

    /**
     * Manejador de los mensajes
     * sun funcion es enviar un mensaje a wahtsapp
     * @param {*} ctx
     */
    handleMsgChatGPT = async (body) => {
        const completion = await this.openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: "colo colo tiene la camiseta blanca",
            temperature: 0,
            max_tokens: 500,
        });
        const interaccionChatGPT = completion.data.data[0].embedding;
        console.log(interaccionChatGPT);
        return interaccionChatGPT
    };
}

module.exports = ChatGPTClass;
