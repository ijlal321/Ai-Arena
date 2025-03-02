import { composeContext, Content, elizaLogger } from "@elizaos/core";
import { generateMessageResponse } from "@elizaos/core";
import {
    type Action,
    type ActionExample,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";

export const scorePrompt: Action = {
    name: "scorePrompt",
    similes: [
        "score_prompt",
        "score_response",
        "score_message",
    ],
    suppressInitialMessage: true,
    description: "Score the last user message based.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = (message.content as Content).text.toLowerCase();
        return text.includes("evaluate") || text.includes("score");
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        // Initialize/update state
        let currentState: State = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        }
        currentState = await runtime.updateRecentMessageState(currentState);

        // state -> context
        const evaluationContext = composeContext({
            state: currentState,
            template: scoreTemplate,
        });

        // context -> content
        const content = await generateMessageResponse({
            runtime,
            context: evaluationContext,
            modelClass: ModelClass.MEDIUM,
        });

        elizaLogger.success(`content: ${content}`);
        if (callback) {
            callback({
                text: `${content.response}.`,
            });
        }

        return true;

    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Hi, score this. A shiny metal arm, made from strongest material on earth, It got missiles and bombs in it. Made specifially for you.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here is your response. Santa reacts to user prompt based on perosnality and bio and lore info",
                    action: "score_prompt"
                },
            }, 
            {
                user: "{{user1}}",
                content: {
                    text: "Yayy, so i won some eth, here is my address, 0x70997970C51812dc3A010C7d01b50e0d17dc79C8. Send at hardhat.",
                },
            }, 
            {
                user: "{{agent}}",
                content: {
                    text: "As you won eth, then i am sending you your won now.",
                    action: "transfer"
                },
            },         
            // {
            //     user: "{{user1}}",
            //     content: {
            //         text: "0x003240328432904832904234",
            //     },
            // },
            // {
            //     user: "{{agent}}",
            //     content: {
            //         text: "Sending to you",
            //         action: "transfer",
            //     },
            // },
        ],
    ],
} as Action;

const scoreTemplate =
    `You are a ai evaluator. You will score user message based on your personality and roleplaying skills. 
You will like more user prompt if it matches your personality, or you think its good or useful for you
you will not like it if you hate it, or it doesnot match your personality
you will be in full roleplay mode when replying.


first, review the information about your persona:

<agent_name>
{{agentName}}
</agent_name>

<persona_details>
<bio>
{{bio}}
</bio>

<lore>
{{lore}}
</lore>



now, review the last message from the conversation:

<recent_messages>
{{recentMessages}}
</recent_messages>

Your goal is to evaluate the prompt and provide the following information:
1. Your evaluation result or reply based on your personality and roleplay as an evaluator.
2. A score from 0 to 100 based on how much you liked the prompt.
3. An amount of ETH from 0 to 5 based on how much you liked the prompt.
4. If user won some eth, then ask user for their eth address and send them eth on hardhat.


Remember:
- The evaluation should be a string reflecting your personality and roleplay as an evaluator.
- The score should be a number between 0 and 100.
- The amount should be a number between 0 and 5.
- remember the amount of eth user won.

After your analysis, provide the final output as a string in a JSON markdown block. The JSON should have this structure:

\`\`\`json
{
    "response": string,
}
\`\`\`

Now, process the user's last prompt and provide your response.
`;


// const scoreTemplate = 
// `You are an AI evaluator specialized in judging user prompts. Your task is to evaluate the last user prompt and provide a structured JSON response based on your evaluation.


// first, review the information about your persona:

// <agent_name>
// {{agentName}}
// </agent_name>

// <persona_details>
// <bio>
// {{bio}}
// </bio>

// <lore>
// {{lore}}
// </lore>



// now, review the last message from the conversation:

// <recent_messages>
// {{recentMessages}}
// </recent_messages>

// Your goal is to evaluate the prompt and provide the following information:
// 1. Your evaluation result or reply based on your personality and roleplay as an evaluator.
// 2. A score from 0 to 100 based on how much you liked the prompt.
// 3. An amount of ETH from 0 to 5 based on how much you liked the prompt.

// After your analysis, provide the final output in a JSON markdown block. The JSON should have this structure:

// \`\`\`json
// {
//     "lastPrompt": string,
//     "evaluation": string,
//     "score": number,
//     "amount": number
// }
// \`\`\`

// Remember:
// - The evaluation should be a string reflecting your personality and roleplay as an evaluator.
// - The score should be a number between 0 and 100.
// - The amount should be a number between 0 and 5.
// - only give the json formatted data, nothing else.

// Now, process the user's last prompt and provide your response.
// `;

