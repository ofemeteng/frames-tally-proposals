import { FrameActionDataParsed } from "frames.js";
import { setCursor } from "../data/cursor.js";
const html = String.raw;

export default {
  name: "poster",
  logic: async(message: FrameActionDataParsed) => {
    if (message.buttonIndex == 1) {
      await setCursor("");
      return `arbitrum`;
    }
  },
  content: () => html`
    <frame-image src="/images/poster.png" />
    <frame-button> 🔵 Browse Delegates </frame-button>
    <frame-button
      action="link"
      target="https://www.tally.xyz/gov/arbitrum/delegates"
    >
      View on Tally
    </frame-button>
  `,
};
