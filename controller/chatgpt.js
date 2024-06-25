import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OpenAi, // defaults to process.env["OPENAI_API_KEY"]
});

async function main(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    console.log(completion.choices);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    throw error;
  }
}

export const handlerequest = async (req, res) => {
  console.log("Request Body:", req.body);

  try {
    const prompt = `client want to develop a ${req.body.projectname} with ${req.body.apps} please generate a technical documentation to explain the project to developers, Include suggested tech stack and sdk needed. Phase wise target, 500 words please.`;
    console.log("Generated Prompt:", prompt);

    const msg = await main(prompt);
    console.log("Initial Response from OpenAI:", msg);

    const filter = `${msg} convert this into html format`;
    const final = await main(filter);
    console.log("Final HTML Response from OpenAI:", final);

    res.status(200).json({ message: final });
  } catch (err) {
    console.error("Error in handlerequest:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};
