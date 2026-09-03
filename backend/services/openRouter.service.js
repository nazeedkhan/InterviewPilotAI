import axios from "axios";

// yaha par hum AI model ko la rahe hai jisse->
// 1. Resume read karwayenge
// 2. interview questions generate karwayenge.
// 3. Sara feedback lenge including scores, feedback, confidence level etc.. (see interview model for more details)
// or iska use phir controllers me karenge with upload file or wahi se messages bhejenge.

const askAI = async (messages) => {
  try {
    // jo message aa raha hai wo array hi hona chahiye warna error dedo.
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message array is empty.");
    }
    // jo model hum use kar rahe hai wo input me array hi leta hai.
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free", //not unlimited and too slow BTW.
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_APIKEY}`,
          "Content-Type": "application/json",
        },
      },
    );


    // itni lambi line kaise pata doesn't matter (inki site par mil jayega ya research chatgpt par.)
    const aiResponse = response?.data?.choices?.[0]?.message?.content;

    // normally questions.trim() karne se ek string se front or back se unnecessary blank spaces remove kar deta hai.
    // yaha par !questions.trim() pehle bekaar ke spaces ko remove karega or phir check krega kya ab string empty hai agar haa to true karega ! ki wajah se. !questions(empty)=> !(false)=>true.
    if (!aiResponse || !aiResponse.trim()) {
      throw new Error("AI returned empty string.");
    }
    return aiResponse;
  } catch (error) {
  console.log(
    "STATUS:",
    error.response?.status
  );

  console.log(
    "DATA:",
    error.response?.data
  );

  throw error;
}
};

export default askAI;
