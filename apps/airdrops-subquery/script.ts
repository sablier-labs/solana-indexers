import { AnchorIdl, rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { createFromRoot } from "codama";
import { writeFileSync } from "node:fs";

const anchorIdl: AnchorIdl = {
  address: "GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D",
  metadata: {
    name: "sablier_merkle_instant",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  docs: [
    "Sablier Merkle Instant program for creating and managing Merkle tree-based airdrop campaigns."
  ],
  instructions: [
    {
      name: "campaign_view",
      docs: [
        "Retrieves the campaign details.",
        "",
        "# Accounts Expected",
        "",
        "- `campaign` The account that stores the campaign details."
      ],
      discriminator: [188, 126, 110, 5, 183, 113, 158, 3],
      accounts: [
        {
          name: "campaign",
          docs: ["Read account: the account storing the campaign data."]
        }
      ],
      args: [],
      returns: {
        defined: {
          name: "Campaign"
        }
      }
    },
    {
      name: "claim",
      docs: [
        "Claims airdrop on behalf of eligible recipient and transfers it to the recipient ATA.",
        "",
        "# Accounts Expected",
        "",
        "- `claimer` The transaction signer.",
        "- `campaign` The account that stores the campaign details.",
        "- `recipient` The address of the airdrop recipient.",
        "- `airdrop_token_mint` The mint of the airdropped token.",
        "- `airdrop_token_program` The Token Program of the airdropped token.",
        "- `chainlink_program`: The Chainlink program used to retrieve on-chain price feeds.",
        "- `chainlink_sol_usd_feed`: The account providing the SOL/USD price feed data.",
        "",
        "# Parameters",
        "",
        "- `index` The index of the recipient in the Merkle tree.",
        "- `amount` The amount allocated to the recipient.",
        "- `merkle_proof` The proof of inclusion in the Merkle tree.",
        "",
        "# Notes",
        "",
        "- The instruction charges a fee in the native token (SOL), equivalent to $2 USD.",
        "- Emits a [`crate::utils::events::Claim`] event.",
        "",
        "# Requirements",
        "",
        "- The current time must be greater than or equal to the campaign start time.",
        "",
        "- The campaign must not have expired.",
        "- The recipient's airdrop has not been claimed yet.",
        "- The Merkle proof must be valid.",
        "- `chainlink_program` and `chainlink_sol_usd_feed` must match the ones stored in the treasury."
      ],
      discriminator: [62, 198, 214, 193, 213, 159, 108, 210],
      accounts: [
        {
          name: "claimer",
          docs: [
            "Write account: the signer of the claim who will pay the claim fee."
          ],
          writable: true,
          signer: true
        },
        {
          name: "recipient",
          docs: ["Read account: the recipient of the airdrop."]
        },
        {
          name: "recipient_ata",
          docs: [
            "Create if needed account: the ATA for airdrop token owned by the recipient."
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "recipient"
              },
              {
                kind: "account",
                path: "airdrop_token_program"
              },
              {
                kind: "account",
                path: "airdrop_token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: "treasury",
          docs: [
            "Write account: the treasury account that will receive the claim fee."
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121]
              }
            ]
          }
        },
        {
          name: "airdrop_token_mint",
          docs: ["Read account: the mint account of the airdrop token."]
        },
        {
          name: "campaign",
          docs: ["Write account: the account storing the campaign data."],
          writable: true
        },
        {
          name: "campaign_ata",
          docs: ["Write account: the campaign's ATA for the airdrop token."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "campaign"
              },
              {
                kind: "account",
                path: "airdrop_token_program"
              },
              {
                kind: "account",
                path: "airdrop_token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: "claim_receipt",
          docs: ["Create account: the claim receipt."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                kind: "account",
                path: "campaign"
              },
              {
                kind: "arg",
                path: "index"
              }
            ]
          }
        },
        {
          name: "airdrop_token_program",
          docs: ["Program account: the Token program of the airdrop token."]
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "chainlink_program",
          docs: [
            "Read account: The Chainlink program used to retrieve on-chain price feeds."
          ]
        },
        {
          name: "chainlink_sol_usd_feed",
          docs: [
            "Read account: The account providing the SOL/USD price feed data."
          ]
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "index",
          type: "u32"
        },
        {
          name: "amount",
          type: "u64"
        },
        {
          name: "merkle_proof",
          type: {
            vec: {
              array: ["u8", 32]
            }
          }
        }
      ]
    },
    {
      name: "claim_fee_in_lamports",
      docs: [
        "Calculates the claim fee in lamports, which is equivalent to $2 USD.",
        "",
        "# Accounts Expected:",
        "",
        "- `chainlink_program`: The Chainlink program used to retrieve on-chain price feeds.",
        "- `chainlink_sol_usd_feed`: The account providing the SOL/USD price feed data."
      ],
      discriminator: [255, 199, 146, 222, 145, 180, 58, 231],
      accounts: [
        {
          name: "treasury",
          docs: [
            "Read account: the treasury account that receives the claim fee."
          ],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121]
              }
            ]
          }
        },
        {
          name: "chainlink_program",
          docs: [
            "Read account: The Chainlink program used to retrieve on-chain price feeds."
          ]
        },
        {
          name: "chainlink_sol_usd_feed",
          docs: [
            "Read account: The account providing the SOL/USD price feed data."
          ]
        }
      ],
      args: [],
      returns: "u64"
    },
    {
      name: "clawback",
      docs: [
        "Claws back the unclaimed tokens from the campaign.",
        "",
        "# Accounts Expected",
        "",
        "- `campaign` The account that stores the campaign details.",
        "- `campaign_creator` The transaction signer.",
        "- `airdrop_token_mint` The mint of the airdropped token.",
        "- `airdrop_token_program` The Token Program of the airdropped token.",
        "",
        "# Parameters",
        "",
        "- `amount` The amount to claw back.",
        "",
        "# Notes",
        "",
        "- Emits a [`crate::utils::events::Clawback`] event.",
        "",
        "# Requirements",
        "",
        "- The signer must be the actual campaign creator.",
        "- No claim must be made, OR the current timestamp must not exceed 7 days after the first claim, OR the campaign",
        "must be expired."
      ],
      discriminator: [111, 92, 142, 79, 33, 234, 82, 27],
      accounts: [
        {
          name: "campaign_creator",
          docs: [
            "Write account: the campaign creator who will claw back the tokens."
          ],
          writable: true,
          signer: true
        },
        {
          name: "clawback_recipient",
          docs: ["Read account: the clawback recipient."]
        },
        {
          name: "clawback_recipient_ata",
          docs: [
            "Create if needed account: the clawback recipient's ATA for the airdrop token."
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "clawback_recipient"
              },
              {
                kind: "account",
                path: "airdrop_token_program"
              },
              {
                kind: "account",
                path: "airdrop_token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: "airdrop_token_mint",
          docs: ["Read account: the mint account of the airdrop token."]
        },
        {
          name: "campaign",
          docs: ["Read account: the account storing the campaign data."]
        },
        {
          name: "campaign_ata",
          docs: ["Write account: the campaign's ATA for the airdrop token."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "campaign"
              },
              {
                kind: "account",
                path: "airdrop_token_program"
              },
              {
                kind: "account",
                path: "airdrop_token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: "airdrop_token_program",
          docs: ["Program account: the Token program of the airdrop token."]
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "collect_fees",
      docs: [
        "Collects the fees accumulated in the treasury by transferring them to the fee recipient.",
        "",
        "# Accounts Expected",
        "",
        "- `fee_collector` The transaction signer and the fee collector.",
        "- `fee_recipient` The address receiving the collected fees.",
        "",
        "# Notes",
        "",
        '- To calculate the "collectable amount", the rent-exempt minimum balance and a 0.001 SOL buffer are deducted',
        "from the treasury SOL balance.",
        "- Emits a [`crate::utils::events::FeesCollected`] event.",
        "",
        "# Requirements",
        "",
        "- `fee_collector` must be authorized for fee collection.",
        '- The "collectable amount" must be greater than zero.'
      ],
      discriminator: [164, 152, 207, 99, 30, 186, 19, 182],
      accounts: [
        {
          name: "fee_collector",
          docs: [
            "Write account: the account authorized to collect fees from the treasury."
          ],
          signer: true
        },
        {
          name: "fee_recipient",
          docs: [
            "Write account: the address that will receive the collected fees."
          ],
          writable: true
        },
        {
          name: "treasury",
          docs: ["Write account: the treasury account that holds the fees."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121]
              }
            ]
          }
        }
      ],
      args: []
    },
    {
      name: "create_campaign",
      docs: [
        "Creates a Merkle Instant airdrop campaign.",
        "",
        "# Accounts Expected",
        "",
        "- `creator` The transaction signer and the campaign creator.",
        "- `airdrop_token_mint` The mint of the airdropped token.",
        "- `airdrop_token_program` The Token Program of the airdropped token.",
        "",
        "# Parameters",
        "",
        "- `merkle_root` The Merkle root of the claim data.",
        "- `campaign_start_time` The time when the campaign starts, in seconds since the Unix epoch.",
        "- `expiration_time` The time when the campaign expires, in seconds since the Unix epoch.",
        "A value of zero means the campaign does not expire.",
        "- `name` The name of the campaign.",
        "- `ipfs_cid` The content identifier for indexing the campaign on IPFS. An empty value may break some UI",
        "features that depend upon the IPFS CID.",
        "- `aggregate_amount` The total amount of tokens to be distributed to all recipients.",
        "- `recipient_count` The total number of recipient addresses eligible for the airdrop.",
        "",
        "# Notes",
        "",
        "- Emits a [`crate::utils::events::CreateCampaign`] event."
      ],
      discriminator: [111, 131, 187, 98, 160, 193, 114, 244],
      accounts: [
        {
          name: "creator",
          docs: ["Write account: the creator of the campaign."],
          writable: true,
          signer: true
        },
        {
          name: "airdrop_token_mint",
          docs: ["Read account: the mint account of the airdrop token."]
        },
        {
          name: "campaign",
          docs: ["Create account: the account storing the campaign data."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [99, 97, 109, 112, 97, 105, 103, 110]
              },
              {
                kind: "account",
                path: "creator"
              },
              {
                kind: "arg",
                path: "merkle_root"
              },
              {
                kind: "arg",
                path: "campaign_start_time"
              },
              {
                kind: "arg",
                path: "expiration_time"
              },
              {
                kind: "arg",
                path: "name"
              },
              {
                kind: "account",
                path: "airdrop_token_mint"
              }
            ]
          }
        },
        {
          name: "campaign_ata",
          docs: ["Create account: the campaign's ATA for the airdrop token."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "campaign"
              },
              {
                kind: "account",
                path: "airdrop_token_program"
              },
              {
                kind: "account",
                path: "airdrop_token_mint"
              }
            ],
            program: {
              kind: "const",
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: "airdrop_token_program",
          docs: ["Program account: the Token program of the airdrop token."]
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "merkle_root",
          type: {
            array: ["u8", 32]
          }
        },
        {
          name: "campaign_start_time",
          type: "i64"
        },
        {
          name: "expiration_time",
          type: "i64"
        },
        {
          name: "name",
          type: "string"
        },
        {
          name: "ipfs_cid",
          type: "string"
        },
        {
          name: "aggregate_amount",
          type: "u64"
        },
        {
          name: "recipient_count",
          type: "u32"
        }
      ]
    },
    {
      name: "has_campaign_started",
      docs: [
        "Returns a flag indicating whether the campaign has started.",
        "",
        "# Accounts expected:",
        "",
        "- `campaign` The account that stores the campaign details."
      ],
      discriminator: [135, 101, 171, 220, 86, 97, 104, 199],
      accounts: [
        {
          name: "campaign",
          docs: ["Read account: the account storing the campaign data."]
        }
      ],
      args: [],
      returns: "bool"
    },
    {
      name: "has_claimed",
      docs: [
        "Returns a flag indicating whether a claim has been made for the given index.",
        "",
        "# Accounts Expected",
        "",
        "- `campaign` The account that stores the campaign details.",
        "",
        "# Parameters",
        "",
        "- `index` The index of the recipient in the Merkle tree."
      ],
      discriminator: [182, 195, 167, 56, 232, 3, 223, 102],
      accounts: [
        {
          name: "campaign",
          docs: ["Read account: the account storing the campaign data."]
        },
        {
          name: "claim_receipt",
          docs: ["Read account: the claim receipt."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                kind: "account",
                path: "campaign"
              },
              {
                kind: "arg",
                path: "_index"
              }
            ]
          }
        }
      ],
      args: [
        {
          name: "_index",
          type: "u32"
        }
      ],
      returns: "bool"
    },
    {
      name: "has_expired",
      docs: [
        "Returns a flag indicating whether the campaign has expired.",
        "",
        "# Accounts Expected",
        "",
        "- `campaign` The account that stores the campaign details."
      ],
      discriminator: [24, 138, 30, 86, 92, 38, 143, 129],
      accounts: [
        {
          name: "campaign",
          docs: ["Read account: the account storing the campaign data."]
        }
      ],
      args: [],
      returns: "bool"
    },
    {
      name: "has_grace_period_passed",
      docs: [
        "Returns a flag indicating whether the grace period of the campaign has passed.",
        "",
        "# Accounts Expected",
        "",
        "- `campaign` The account that stores the campaign details.",
        "",
        "# Notes",
        "",
        "- A return value of `false` indicates: No claim has been made yet, OR the current timestamp does not exceed",
        "seven days after the first claim."
      ],
      discriminator: [223, 150, 181, 32, 240, 136, 73, 236],
      accounts: [
        {
          name: "campaign",
          docs: ["Read account: the account storing the campaign data."]
        }
      ],
      args: [],
      returns: "bool"
    },
    {
      name: "initialize",
      docs: [
        "Initializes the program with the provided fee collector address.",
        "",
        "# Accounts Expected",
        "",
        "- `initializer` The transaction signer.",
        "",
        "# Parameters",
        "",
        "- `fee_collector` The address that will have the authority to collect fees.",
        "- `chainlink_program`: The Chainlink program used to retrieve on-chain price feeds.",
        "- `chainlink_sol_usd_feed`: The account providing the SOL/USD price feed data."
      ],
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "initializer",
          docs: ["Write account: the initializer of the program."],
          writable: true,
          signer: true
        },
        {
          name: "treasury",
          docs: [
            "Create account: the treasury account that will hold the fees."
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121]
              }
            ]
          }
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "fee_collector",
          type: "pubkey"
        },
        {
          name: "chainlink_program",
          type: "pubkey"
        },
        {
          name: "chainlink_sol_usd_feed",
          type: "pubkey"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "Campaign",
      discriminator: [50, 40, 49, 11, 157, 220, 229, 192]
    },
    {
      name: "ClaimReceipt",
      discriminator: [223, 233, 11, 229, 124, 165, 207, 28]
    },
    {
      name: "Treasury",
      discriminator: [238, 239, 123, 238, 89, 1, 168, 253]
    }
  ],
  events: [
    {
      name: "Claim",
      discriminator: [133, 98, 9, 238, 133, 207, 191, 113]
    },
    {
      name: "Clawback",
      discriminator: [239, 144, 30, 69, 80, 59, 142, 64]
    },
    {
      name: "CreateCampaign",
      discriminator: [88, 178, 212, 72, 110, 4, 68, 143]
    },
    {
      name: "FeesCollected",
      discriminator: [233, 23, 117, 225, 107, 178, 254, 8]
    }
  ],
  errors: [
    {
      code: 6000,
      name: "CampaignExpired",
      msg: "Campaign has expired!"
    },
    {
      code: 6001,
      name: "InvalidMerkleProof",
      msg: "Invalid Merkle proof!"
    },
    {
      code: 6002,
      name: "CampaignNotStarted",
      msg: "Campaign has not started yet!"
    },
    {
      code: 6003,
      name: "ClawbackNotAllowed",
      msg:
        "Clawback not allowed past the grace period and before campaign expiration!"
    },
    {
      code: 6004,
      name: "CantCollectZeroFees",
      msg: "Can't collect zero fees!"
    }
  ],
  types: [
    {
      name: "Campaign",
      docs: [
        "Groups all the data for a Merkle Instant campaign.",
        "",
        "All timestamp fields use `i64` instead of an unsigned integer to match Solana’s `Clock` struct,",
        "which returns timestamps as `i64`. This avoids extra conversions and keeps things consistent",
        "when working with Solana’s built-in time functions."
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "airdrop_token_mint",
            type: "pubkey"
          },
          {
            name: "bump",
            type: "u8"
          },
          {
            name: "campaign_start_time",
            type: "i64"
          },
          {
            name: "creator",
            type: "pubkey"
          },
          {
            name: "expiration_time",
            type: "i64"
          },
          {
            name: "first_claim_time",
            type: "i64"
          },
          {
            name: "ipfs_cid",
            type: "string"
          },
          {
            name: "merkle_root",
            type: {
              array: ["u8", 32]
            }
          },
          {
            name: "name",
            type: "string"
          }
        ]
      }
    },
    {
      name: "Claim",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "campaign",
            type: "pubkey"
          },
          {
            name: "claimer",
            type: "pubkey"
          },
          {
            name: "claim_receipt",
            type: "pubkey"
          },
          {
            name: "fee_in_lamports",
            type: "u64"
          },
          {
            name: "index",
            type: "u32"
          },
          {
            name: "recipient",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "ClaimReceipt",
      type: {
        kind: "struct",
        fields: []
      }
    },
    {
      name: "Clawback",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "campaign",
            type: "pubkey"
          },
          {
            name: "campaign_creator",
            type: "pubkey"
          },
          {
            name: "clawback_recipient",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "CreateCampaign",
      type: {
        kind: "struct",
        fields: [
          {
            name: "aggregate_amount",
            type: "u64"
          },
          {
            name: "campaign",
            type: "pubkey"
          },
          {
            name: "campaign_name",
            type: "string"
          },
          {
            name: "campaign_start_time",
            type: "i64"
          },
          {
            name: "creator",
            type: "pubkey"
          },
          {
            name: "expiration_time",
            type: "i64"
          },
          {
            name: "ipfs_cid",
            type: "string"
          },
          {
            name: "merkle_root",
            type: {
              array: ["u8", 32]
            }
          },
          {
            name: "recipient_count",
            type: "u32"
          },
          {
            name: "token_decimals",
            type: "u8"
          },
          {
            name: "token_mint",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "FeesCollected",
      type: {
        kind: "struct",
        fields: [
          {
            name: "fee_amount",
            type: "u64"
          },
          {
            name: "fee_collector",
            type: "pubkey"
          },
          {
            name: "fee_recipient",
            type: "pubkey"
          }
        ]
      }
    },
    {
      name: "Treasury",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8"
          },
          {
            name: "fee_collector",
            type: "pubkey"
          },
          {
            name: "chainlink_program",
            type: "pubkey"
          },
          {
            name: "chainlink_sol_usd_feed",
            type: "pubkey"
          }
        ]
      }
    }
  ]
};

function convert() {
  const codama = createFromRoot(rootNodeFromAnchor(anchorIdl));

  console.log(codama);

  writeFileSync("./codama.json", codama.getJson());
}

convert();
