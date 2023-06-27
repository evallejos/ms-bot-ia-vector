
const PublicFanClan = {};
require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");
const { Configuration, OpenAIApi } = require("openai");
const { generateEmbeddings } = require("../../scripts/embed")
const Utils = require('../../helpers/utils');
const { encode } = require('gpt-3-encoder');
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

PublicFanClan.embedding = async (req, res) => {


  const resp = await generateEmbeddings();


  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-BCH-Authorization", "abc");
  res.setHeader("X_IBM_Client_Id", "714ce0f4575e988c4a05b5f9ceaf7c17");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST, OPTIONS, PUT, DELETE');
  res.setHeader('Allow', 'GET,POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.status(200);
  res.json({ test: "ok" });
};

PublicFanClan.search = async (req, res) => {

  const requestData = await req.body;

  if (!requestData) {
    throw new Error('Request Desconocido')
  }

  const { query } = requestData

  if (!query) {
    throw new Error('Parametro desconocido en query')
  }

  const sanitizedQuery = query.trim()

  const moderationResponse = await openai.createModeration({ input: sanitizedQuery })

  const [results] = moderationResponse.data.results

  if (results.flagged) {
    throw new Error('Error de contenido no autorizado con la pregunta', {
      flagged: true,
      categories: results.categories,
    })
  }

  console.log("query >>>>>>>", sanitizedQuery)
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: sanitizedQuery
  });

  if (embeddingResponse.status !== 200) {
    throw new Error('Error para crear la prengunta embedding', embeddingResponse)
  }
  const [{ embedding }] = embeddingResponse.data.data

  const { error: matchError, data } = await supabaseAdmin.rpc("cfk_search_question", {
    query_embedding: embedding,
    similarity_threshold: 0.78,
    match_count: 5
  });


  if (matchError) {
    throw new Error('Fallo el match con el contenido', matchError ?? undefined)
  }


  let tokenCount = 0;
  let contextText = '';

  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const information = data[i]
    const content = information.metadata
    const encoded = encode(content)
    tokenCount += encoded.length
    if (tokenCount >= 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }

  const respBot = await Utils.OpenAIStream(sanitizedQuery, contextText);
  const resp = data.length > 0 ? {metadata : respBot, isMarkdown : true} : {metadata : respBot, isMarkdown : false}
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-BCH-Authorization", "abc");
  res.setHeader("X_IBM_Client_Id", "714ce0f4575e988c4a05b5f9ceaf7c17");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST, OPTIONS, PUT, DELETE');
  res.setHeader('Allow', 'GET,POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

  res.status(200);
  res.json(resp);

};


module.exports = PublicFanClan;
