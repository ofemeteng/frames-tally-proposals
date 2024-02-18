import { FrameActionDataParsed } from "frames.js";
const html = String.raw;

let activeProposals = null;

async function fetchActiveProposals() {
  const response = await fetch("https://api.tally.xyz/query", {
    method: "POST",
    headers: {
      authority: "api.tally.xyz",
      "api-key": process.env.TALLY_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
          query GovernanceProposals($sort: ProposalSort, $chainId: ChainID!, $pagination: Pagination, $governanceIds: [AccountID!], $proposerIds: [AccountID!], $voters: [Address!], $votersPagination: Pagination, $includeVotes: Boolean!) {
            proposals(
              sort: $sort
              chainId: $chainId
              pagination: $pagination
              governanceIds: $governanceIds
              proposerIds: $proposerIds
            ) {
              id
              description
              statusChanges {
                type
              }
              block {
                timestamp
              }
              voteStats {
                votes
                weight
                support
                percent
              }
              votes(voters: $voters, pagination: $votersPagination) @include(if: $includeVotes) {
                support
                voter {
                  name
                  picture
                  address
                  identities {
                    twitter
                  }
                }
              }
              governance {
                id
                quorum
                name
                timelockId
                organization {
                  metadata {
                    icon
                  }
                }
                tokens {
                  decimals
                }
              }
              tallyProposal {
                id
                createdAt
                status
              }
            }
          }
        `,
      variables: {
        pagination: { limit: 10, offset: 0 },
        sort: { field: "START_BLOCK", order: "DESC" },
        chainId: "eip155:1",
        governanceIds: ["eip155:1:0x408ED6354d4973f66138C91495F2f2FCbd8724C3"],
        votersPagination: { limit: 1, offset: 0 },
        includeVotes: false,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const activeProposals = data.data.proposals
    .filter(
      (proposal) =>
        proposal.statusChanges[proposal.statusChanges.length - 1].type ===
        "ACTIVE"
    )
    .slice(0, 3)
    .map((proposal: { id: string }) => ({
      link: `https://www.tally.xyz/gov/uniswap/proposal/${proposal.id}`,
    }));

  console.log("the active proposals are");
  console.log(activeProposals);

  return activeProposals; // Return the list of up to 3 active proposals with titles and links
}

async function prepareContent() {
  activeProposals = await fetchActiveProposals();
  // Generate button HTML for each active proposal, labeling them sequentially
  const buttonsHtml =
    `<frame-image layout="main">
        <div
            style="
            font-family: 'Redaction';
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
            color: white;
            background: black;
            line-height: 1.5;
        "
        >
            <div style="font-size: 2em; margin-bottom: 20px;">
                ${activeProposals.length > 0 ? `Number of Active Proposals: ${activeProposals.length}` : "No active proposals"}
            </div>
        </div>
    </frame-image>` +
    activeProposals
      .map(
        (_, index) =>
          `<frame-button action="link" target="${activeProposals[index].link}">Proposal ${index + 1}</frame-button>`
      )
      .join("") +
    "<frame-button> ⬅️ Back </frame-button>"; // Including the back button

  return buttonsHtml;
}

const htmlContent = await prepareContent();

export default {
  name: "uniswap",
  logic: (message: FrameActionDataParsed) => {
    if (message.buttonIndex == activeProposals.length + 1) {
      return `poster`;
    }
  },
  content: async () => {
    return html` ${html({ raw: [htmlContent] })} `;
  },
};
