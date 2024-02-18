import { FrameActionDataParsed } from "frames.js";
const html = String.raw;

export default {
    name: 'poster',
    logic: (message: FrameActionDataParsed) => {
        if (message.buttonIndex == 1) {
            return `arbitrum`;
        }
        else if (message.buttonIndex == 2) {
            return `optimism`;
        }
        else if (message.buttonIndex == 3) {
            return `uniswap`;
        }
    },
    content: () => html`
        <frame-image src="/images/poster.png" />
        <frame-button>
        💙,🧡 Arbitrum
        </frame-button>
        <frame-button>
        ✨🔴✨ Optimism
        </frame-button>
        <frame-button>
        🦄 Uniswap
        </frame-button>
        <frame-button action="link" target="https://github.com/encrypted-soul/frames-tally-proposals">
            {😺} View on Github
        </frame-button>
    `
};
