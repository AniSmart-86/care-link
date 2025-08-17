 "use server"

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, 
// });

// export async function recommendSpecialtyAI(symptoms:string) {
//   try {
//     const prompt = `
//     A patient is describing their symptoms. Based on the description, recommend the MOST relevant medical specialty.
//     If symptoms are unclear, say "General Practitioner".
//     Reply ONLY with the specialty name and a short explanation.

//     Symptoms: "${symptoms}"
//     `;

//    const completion = await openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages: [{ role: "user", content: prompt }],
//   max_tokens: 150,
//   temperature: 0.3,
// });

// const messageContent = completion.choices[0]?.message?.content;

// if (!messageContent) {
//   throw new Error("No response received from AI");
// }

// const reply = messageContent.trim();

//     return {
//       success: true,
//       message: `Based on your symptoms: ${reply}`
//     };
//   } catch (error) {
//     console.error("AI Error:", error);
//     return {
//       success: false,
//       message: "Sorry, your request could not be processed at the moment."
//     };
//   }
// }




import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

export async function recommendSpecialtyAI(symptoms:string) {
  try {
    const prompt = `
    A patient is describing their symptoms. Based on the description, sympathize them and recommend the MOST relevant medical specialty.
    If symptoms are unclear, say "General Practitioner".
    Reply ONLY with the specialty name and a short explanation and appreciation them for using DocLink Healthcare.

    Symptoms: "${symptoms}"
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.3,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "See General Practitioner";

    return {
      success: true,
      message: `Based on your symptoms: i recommend ${reply}`
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      success: false,
      message: "Sorry, I could not process your request at the moment."
    };
  }
}
