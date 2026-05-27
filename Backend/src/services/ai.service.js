import { ChatGoogle } from "@langchain/google";

const model = new ChatGoogle({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
});

// export async function testai() {
//     model.invoke("What is the capital of france?").then((response) => {
//         console.log("AI Response:", response.text);
//     })
// }