const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const str = require('@supercharge/strings');
const fetch = require("node-fetch");
const { oneLine, codeBlock } = require("common-tags");
const Utils = {};

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

Utils.readJson = (path) => {
    return JSON.parse(fs.readFileSync(`${__dirname}/json/${path}`, 'utf8'));
}

Utils.randomJWT = () => { return str.random(100) }

Utils.checkEmptyKeyValue = (params) => {
    const baseParentalFilter = Object.keys(params).filter(key => params[key] == undefined || params[key] == '');
    return baseParentalFilter.length != 0 ? true : false;
}

Utils.OpenAIStream = async (prompt, contextText) => {

    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: codeBlock`
                ${oneLine`
                  Eres un asistente IA útil que responde con precisión a las consultas del equipo.
                  Dada la siguiente informacion, responda la pregunta del usuario usando solo esa informacion.
                  Sea útil y claro.
                 `}
                ${oneLine`
                  si la respuesta no está explícitamente escrita en la documentación, digamos
                  "Lo siento, no sé cómo ayudar con esa pregunta."
                `}
                ${oneLine`
                  Incluya siempre la informacion en formato markdown.
                `}
                 `
            },
            {
                role: "user",
                content: codeBlock`
                Aquí está la informacion
                ${contextText}
                `
            },
            {
                role: "user",
                content: codeBlock`
                ${oneLine`
                Responda mi siguiente pregunta usando solo la informacion anterior.
                También debe seguir las siguientes reglas al responder:
                `}
                ${oneLine`
                - No invente respuestas que no estén proporcionadas en la informacion entregada.
                `}
                ${oneLine`
                - Responda siempre en formato markdown.
                `}
                ${oneLine`
                - Si la respuesta no está escrita explícitamente
                en el contexto de la documentación, digamos
                "Lo siento, no sé cómo ayudar con esa pregunta."
                `}

                `
            },
            {
                role: "user",
                content: codeBlock`
                Aqui esta mi pregunta:
                ${oneLine`${prompt}`}
                `
            },
        ],
        max_tokens: 1024,
        temperature: 0,
    });

    return completion.data.choices[0].message;
}
module.exports = Utils;