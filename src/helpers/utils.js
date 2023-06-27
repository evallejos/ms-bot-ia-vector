const fs = require("fs");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate
} = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");
const str = require('@supercharge/strings');
const fetch = require("node-fetch");
const { oneLine, codeBlock } = require("common-tags");
const Utils = {};
const chat = new ChatOpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY, maxTokens: 1024 });


Utils.readJson = (path) => {
    return JSON.parse(fs.readFileSync(`${__dirname}/json/${path}`, 'utf8'));
}

Utils.randomJWT = () => { return str.random(100) }

Utils.checkEmptyKeyValue = (params) => {
    const baseParentalFilter = Object.keys(params).filter(key => params[key] == undefined || params[key] == '');
    return baseParentalFilter.length != 0 ? true : false;
}

Utils.OpenAIStream = async (prompt, contextText) => {

    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `Eres un asistente IA útil que responde con precisión a las consultas del equipo.
            Dada la siguiente informacion, responda la pregunta del usuario usando solo esa informacion.
            Sea útil y claro.`
        ),
        SystemMessagePromptTemplate.fromTemplate(
            `Incluya siempre la informacion en formato markdown.
            si la respuesta no está explícitamente escrita en la documentación, No entregues link de referencias
            y tampoco informacion de donde buscar. digamos
            "Lo siento, no sé cómo ayudar con esa pregunta."`
        ),
        SystemMessagePromptTemplate.fromTemplate(
            `Si el usuario te saluda, presentate con el nombre de Robo-Z un agente IA de apoyo, se amable y coordial.`
        ),
        SystemMessagePromptTemplate.fromTemplate(
            `Si pregunta por las guias que tienes disponibles genera una lista las cuales estan separadas por coma.
             esta es la lista:
             como instalar angular,
             como instalar sprint boot,
             como instalar angular js,
             clean code.
             no es necesario que menciones quien eres nuevamente.`
        ),
        HumanMessagePromptTemplate.fromTemplate("Aquí está la informacion {contextText}"),
        HumanMessagePromptTemplate.fromTemplate(`Responda mi siguiente pregunta usando solo la informacion anterior.
        También debe seguir las siguientes reglas al responder:`),
        HumanMessagePromptTemplate.fromTemplate("- No invente respuestas que no estén proporcionadas en la informacion entregada."),
        HumanMessagePromptTemplate.fromTemplate("Aqui esta mi pregunta: {prompt}"),
    ]);

    const chain = new LLMChain({
        prompt: translationPrompt,
        llm: chat,
    });

    const responseB = await chain.call({
        contextText: contextText,
        prompt: prompt,
    });

    console.log("respuesta openIA >>", responseB)
    return responseB.text;
}
module.exports = Utils;