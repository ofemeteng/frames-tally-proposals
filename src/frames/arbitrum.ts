import { FrameActionDataParsed } from "frames.js";
import { getCursor, setCursor } from "../data/cursor.js";
const html = String.raw;

// let address = null;
// let link = null;

async function fetchDelegate() {
  const cursor = await getCursor();
  if (cursor == null || cursor == "") {
    const response = await fetch("https://api.tally.xyz/query", {
      method: "POST",
      headers: {
        authority: "api.tally.xyz",
        "api-key": process.env.TALLY_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `query Delegates($input: DelegatesInput!) {
  delegates(input: $input) {
    nodes {
      ... on Delegate {
        id
        account {
          id
          address
          ens
          twitter
          name
          bio
        }
        statementV2 {
          statement
        }
      }
    }
    pageInfo {
      firstCursor
      lastCursor
      count
    }
  }
}
`,
        variables: {
          input: {
            filters: {
              governanceId:
                "eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9",
              isSeekingDelegation: true,
            },
            page: {
              limit: 1,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data.data.delegates; // Return a single delegate
  } else {
    const response = await fetch("https://api.tally.xyz/query", {
      method: "POST",
      headers: {
        authority: "api.tally.xyz",
        "api-key": process.env.TALLY_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `query Delegates($input: DelegatesInput!) {
  delegates(input: $input) {
    nodes {
      ... on Delegate {
        id
        account {
          id
          address
          ens
          twitter
          name
          bio
        }
        statementV2 {
          statement
        }
      }
    }
    pageInfo {
      firstCursor
      lastCursor
      count
    }
  }
}
`,
        variables: {
          input: {
            filters: {
              governanceId:
                "eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9",
              isSeekingDelegation: true,
            },
            page: {
              afterCursor: cursor,
              limit: 1,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data.data.delegates; // Return a single delegate
  }

}

async function prepareContent(delegate) {
  // Generate buttons
  const address = delegate.nodes[0].account.address;
  const link = `https://www.tally.xyz/profile/${address}?governanceId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9`;

  const buttonsHtml = `<frame-image layout="main">
        <div
            style="
            font-family: 'Redaction';
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
            color: blue;
            background: white;
            line-height: 1.5;
        "
        >
            <div style="font-size: 2em; margin-bottom: 20px;">
                Delegate Address: ${address}
            </div>
        </div>
    </frame-image>
    <frame-button action="link" target="${link}">Delegate</frame-button>
    <frame-button> 👣 Next </frame-button>
    <frame-button> 🏠 Home </frame-button>
    `;
  return buttonsHtml;
}

const delegate = await fetchDelegate();
const nextCursor = delegate.pageInfo.firstCursor;
const htmlContent = await prepareContent(delegate);

export default {
  name: "arbitrum",
  logic: async (message: FrameActionDataParsed) => {
    if (message.buttonIndex == 2) {
      await setCursor(nextCursor);
      return `arbitrum`;
    }
    if (message.buttonIndex == 3) {
      // await setCursor("");
      return `poster`;
    }
  },
  content: async () => {
    
    return html` ${html({ raw: [htmlContent] })} `;
  },
};
