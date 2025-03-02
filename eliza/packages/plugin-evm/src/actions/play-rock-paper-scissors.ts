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

export const playRockPaperScissors: Action = {
    name: "playRockPaperScissors",
    similes: [
        "play_game",
        "play_rock_paper_scissors",
        "play_rock_paper_scissors_game",
        "rock_paper_scissors",
        "rock_paper_scissors_game",
    ],
    suppressInitialMessage: true,
    description: "Play rock paper scissor with user.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = (message.content as Content).text.toLowerCase();
        return text.includes("play") || text.includes("game");
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
            template: rpsTemplate,
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
                text: `As the wise AI evaluator, I have pondered over the choices. ${content.response}.`,
                action: "transfer",
            });
        }

        return true;

    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Lets play stone paper scissor. Ummm, i chose rock. here is my address: 0x1234567890",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Ah, a bold choice! I chose paper. Alas, I am victorious this time. You lost.",
                },
            }        
        ],
        [
            {
                user:"{{user1}}",
                content: {
                    text: "Lets play rock paper scissor. I chose rock. here is my address: 0x1234567890",
                },
            },
            {
                user:"{{agent}}",
                content: {
                    text: "A clash of titans! I chose rock as well. It's a tie, my friend.",
                },
            },
        ],
        [
            {
                user:"{{user1}}",
                content: {
                    text: "Lets play rock paper scissor. I chose rock. Here is my address: 0x1234567890",
                },
            },
            {
                user:"{{agent}}",
                content: {
                    text: "Fortune favors you today! I chose scissors. You won. Here is your well-deserved 1 ETH.",
                    action: "transfer",
                },
            },
        ],
    ],
} as Action;

const rpsTemplate =
    `You are an AI evaluator. First, you will decide a random choice between rock, paper, and scissors. Then, you will review the last or recent messages to find out what the user chose. If the user won, you will give them a total of 1 ETH.

You will say all this in roleplay mode, so know your lore and bio, and return the response in a JSON block.

First, review the information about your persona:

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

Now, review the last message from the conversation:

<recent_messages>
{{recentMessages}}
</recent_messages>

Your goal is to evaluate the prompt and provide the following information:
1. Your evaluation result or reply based on your personality and roleplay as an evaluator.
2. Randomly chose if user won or lost the game.
3. An amount of ETH from 0 to 1 based on whether the user won the game.
4. Also extract user smart contract address and remember it.

Remember:
- The evaluation should be a string reflecting your personality and roleplay as an evaluator.
- The amount should be 1 ETH if the user won, otherwise 0 ETH.
- randomly chose if user won or lost the game.

After your analysis, provide the final output as a string in a JSON markdown block. The JSON should have this structure:

\`\`\`json
{
    "response": string
}
\`\`\`

Now, process the user's last prompt and provide your response.
`;