import OpenAI from "openai";

let openai:null|OpenAI = null;

export default defineEventHandler(async (event) => {
  if(!openai) {
    const config = useRuntimeConfig(event);
    const openAiKey = config.openAiKey;
    openai = new OpenAI({
      apiKey: openAiKey,
    });
  }

  event.context.openai = openai as OpenAI;
});
