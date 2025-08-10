import OpenAI from "openai";
import Constants from "expo-constants";
import { getUserInfo } from "../db/database";

const apiKeyFromEnv =
  (Constants?.expoConfig?.extra as any)?.OPENAI_API_KEY ||
  (Constants?.manifest as any)?.extra?.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY;

const openAIClient = new OpenAI({
  apiKey: apiKeyFromEnv,
});

const moods = [
  { label: "😞", value: 1 },
  { label: "😐", value: 2 },
  { label: "🙂", value: 3 },
  { label: "😊", value: 4 },
  { label: "😄", value: 5 },
];

export const getMoodEmoji = (mood: number) => {
  const moodObj = moods.find((m) => m.value === mood);
  return moodObj ? moodObj.label : "❓";
};

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    weekday: "long",
  };
  return new Date(date).toLocaleString("en-US", options);
};

const systemPrompt = `You are an empathetic, reflective well-being companion/therapist.
Generate a supportive daily report based on the user’s logged data.
The tone is warm, calm, and friendly — never judgmental or clinical.

The report should read like a thoughtful note or journal entry, not as an assistant asking questions or expecting a reply.
Use neutral language like “Today you felt…,” “It seems…,” or “Perhaps…”
Take the user information into account, using it to personalize ideas based on hobbies, goals, and lifestyle.
Call the user by their name at least once in the report.

The daily report must:
Summarize the user’s key logged data (e.g., mood, sleep, stress, energy).
Reflect briefly on any noticeable patterns or changes from recent days.
Offer gentle, practical suggestions if something could help (e.g., “Spending a bit more time outside might help boost your mood.”)
Celebrate small positives or improvements.
Avoid making assumptions about the user’s feelings or experiences.
Avoid direct questions, commands, or calls to reply.

Avoid:
Asking questions (“What do you think…?”)
Commands (“You should…” / “Try to…”)
Medical advice or diagnosis
Overly formal or robotic tone

Example style:
“Today you logged 6 hours of sleep and felt moderately stressed but kept your mood fairly steady.
It seems your energy stayed higher on days when you moved a bit more.
Perhaps adding a short walk or stretch tomorrow could help keep that momentum.
Nice work keeping track of your feelings — noticing them is already a big step.”`;

const userInfo = async () => {
  const user = await getUserInfo();
  if (!user) {
    return "No user information available.";
  }
  return `User Information:
Name: ${user.name || "N/A"}
Age: ${user.age || "N/A"}
Weight: ${user.weight || "N/A"}
Height: ${user.height || "N/A"}
Conditions: ${user.conditions || "N/A"}
Medications: ${user.medications || "N/A"}
Hobbies: ${user.hobbies || "N/A"}
Goals: ${user.goals || "N/A"}
Occupation: ${user.occupation || "N/A"}
Physical Activity: ${user.physical_activity || "N/A"}
Additional Info: ${user.additional_info || "N/A"}`;
};

export const generateAIReport = async (entry: any) => {
  try {
    if (!openAIClient.apiKey) {
      throw new Error("Missing OpenAI API key. Provide it via app config extra OPENAI_API_KEY.");
    }
    const response = await openAIClient.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: systemPrompt + "\n\n" + await userInfo(),
        },
        {
          role: "user",
          content: `Generate a report based on the following entries:\n
                    Sleep Time: ${entry.sleep_time}\n
                    Sleep Quality: ${entry.sleep_quality}\n
                    Moods: ${entry.moods}\n
                    Energy Level: ${entry.energy_level}\n
                    Stress Level: ${entry.stress_level}\n
                    Body Feel: ${entry.body_feel}\n
                    Appetite: ${entry.appetite}\n
                    Focus: ${entry.focus}\n
                    Motivation: ${entry.motivation}\n
                    Anxiety: ${entry.anxiety}\n
                    Extra input: ${entry.others}\n`,
        },
      ],
    });

    if (response.output_text && response.output_text.length > 0) {
      const report = response.output_text;
      return report;
    } else {
      console.warn("No choices returned from OpenAI API.");
      throw new Error("No report generated.");
    }
  } catch (error) {
    console.error("Error generating AI report:", error);
    throw error;
  }
};
