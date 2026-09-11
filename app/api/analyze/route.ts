import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    // Read data sent from the frontend
    const body = await request.json();

    const {
      bricks = [],
      caption = "",
      hashtags = [],
      audioTranscript = "",
    } = body;

    // Make sure there is at least one brick
    if (!Array.isArray(bricks) || bricks.length === 0) {
      return NextResponse.json(
        { error: "At least one brick is required." },
        { status: 400 }
      );
    }

    // Convert the bricks into something Gemini can understand
    const brickSummary = bricks
      .map((brick: any, index: number) => {
        const concepts = [
          ...(brick.concepts || []),
          ...(brick.customConcept ? [brick.customConcept] : []),
        ];

        return `Brick ${index + 1}: ${concepts.join(", ")}`;
      })
      .join("\n");

    // Our AI instructions
    const prompt = `
You are the AI behind a humorous website called "Brick by Brick".

The website turns a person's Instagram Reel habits into a fictional
"algorithm personality".

Your job is to analyze the ENTIRE COLLECTION of bricks together.

Do NOT analyze each brick as an isolated personality.

Look for patterns, contradictions, and combinations across the
entire collection.

The humor should feel like an extremely sarcastic Malayalam friend
roasting someone's Instagram feed.

IMPORTANT LANGUAGE RULE:

The roast MUST be written in natural Malayalam / Manglish-style
Malayalam internet language.

Do NOT write formal textbook Malayalam.

Use Malayalam expressions, slang, sarcasm and comedic exaggeration
where appropriate.

The roast should be:

- sarcastic
- witty
- playful
- specific to the supplied Reel information
- short enough to be funny
- not hateful
- not genuinely abusive
- not discriminatory
- not sexually explicit

Think:

"Your friend saw your Instagram feed and is absolutely judging you."

====================
BRICK COLLECTION
====================

${brickSummary}

====================
REEL CAPTION
====================

${caption || "No caption available"}

====================
HASHTAGS
====================

${hashtags.length > 0 ? hashtags.join(", ") : "No hashtags available"}

====================
AUDIO TRANSCRIPT
====================

${audioTranscript || "Audio transcript not available"}

====================
ANALYSIS
====================

Analyze the relationship between:

1. The selected concepts
2. The caption
3. The hashtags
4. The audio/transcript
5. The overall combination of all bricks

Then produce:

- A ridiculous algorithm personality name
- A short description
- A highly sarcastic Malayalam/Manglish roast
- The most interesting combination of concepts
- Four scores from 0 to 100:
  - delusion
  - brainrot
  - mainCharacter
  - usefulContent

The scores should reflect the ENTIRE collection.

Return ONLY the requested JSON.
`;

    // Ask Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            personality: {
              type: "string",
            },

            description: {
              type: "string",
            },

            roast: {
              type: "string",
            },

            topCombination: {
              type: "string",
            },

            delusion: {
              type: "integer",
              minimum: 0,
              maximum: 100,
            },

            brainrot: {
              type: "integer",
              minimum: 0,
              maximum: 100,
            },

            mainCharacter: {
              type: "integer",
              minimum: 0,
              maximum: 100,
            },

            usefulContent: {
              type: "integer",
              minimum: 0,
              maximum: 100,
            },
          },

          required: [
            "personality",
            "description",
            "roast",
            "topCombination",
            "delusion",
            "brainrot",
            "mainCharacter",
            "usefulContent",
          ],
        },
      },
    });

    // Make sure Gemini actually responded
    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Convert Gemini's JSON text into an actual JavaScript object
    const result = JSON.parse(response.text);

    // Send result back to the frontend
    return NextResponse.json(result);

  } catch (error) {
    console.error("Gemini analysis error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze the algorithm.",
      },
      {
        status: 500,
      }
    );
  }
}