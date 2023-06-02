
const fs = require("fs");
require('dotenv').config();
const { encode } = require('gpt-3-encoder');
const { readDocumentMarkdown } = require("../resources")
const { Configuration, OpenAIApi } = require("openai");
const { createClient } = require("@supabase/supabase-js");

const generateEmbeddings = async () => {

  const information = readDocumentMarkdown();

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  for (let index in information) {

    const { metadata, name } = information[index];
    const encoded = encode(metadata)

    const embeddingSource = {
      metadata,
      name,
      tokens: encoded.length,
      content_length: metadata.length,
      date: new Date().toLocaleDateString(),
    }


    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: metadata
    });

    const [{ embedding }] = embeddingResponse.data.data;

    const { data, error } = await supabase
      .from("cfk_chatbot")
      .insert({
        embedding,
        ...embeddingSource
      })
      .select("*");

    if (error) {
      console.log("error", error);
    } else {
      console.log("saved", data);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

};


module.exports = {
  generateEmbeddings
}
