//TEST SCRIPT FOR OPENAI API
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

(async () => {
  const response = await openai.images.generate({
    prompt: "A cute baby sea otter",
    n: 1,
    size: "1024x1024",
  });

  console.log(response.data[0].url);
})();
