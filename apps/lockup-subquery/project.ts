import {
  SolanaProject,
  SolanaDatasourceKind,
  SolanaHandlerKind
} from "@subql/types-solana";

import * as dotenv from "dotenv";
import path from "path";

import {
  chainGenesis,
  rpc,
  startBlock_lockup,
  lockupLinear,
  tokenProgram
} from "./src/constants/index";

dotenv.config({ path: path.resolve(__dirname, "./../../.env"), quiet: true });

const RPC_HELIUS = process.env.HELIUS_RPC_KEY
  ? `${rpc.helius}${process.env.HELIUS_RPC_KEY}`
  : undefined;
const RPC_ONFINALITY = process.env.ONFINALITY_RPC_KEY
  ? `${rpc.onfinality}${process.env.ONFINALITY_RPC_KEY}`
  : undefined;

const endpoint = [RPC_HELIUS, RPC_ONFINALITY, ...rpc.public].filter(
  r => r
) as string[];

// Can expand the Datasource processor types via the generic param
const project: SolanaProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "Sablier Solana Lockup Devnet",
  description: "Sablier subquery indexers for lockup on Solana",
  runner: {
    node: {
      name: "@subql/node-solana",
      version: ">=6.1.1"
    },
    query: {
      name: "@subql/query",
      version: ">=2.23.5"
    }
  },
  schema: {
    file: "./schema.graphql"
  },
  network: {
    chainId: chainGenesis,
    endpoint
  },
  dataSources: [
    {
      kind: SolanaDatasourceKind.Runtime,
      startBlock: startBlock_lockup,
      assets: new Map([
        [lockupLinear[0][0], { file: "./idls/lockup_linear_v10.json" }],
        [tokenProgram.SPL, { file: "./idls/token_program.json" }]
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleCancel",
            filter: {
              programId: lockupLinear[0][0],
              discriminator: "cancel"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleCreateWithDurations",
            filter: {
              programId: lockupLinear[0][0],
              discriminator: "createWithDurationsLl"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleCreateWithTimestamps",
            filter: {
              programId: lockupLinear[0][0],
              discriminator: "createWithTimestampsLl"
            }
          },

          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleRenounce",
            filter: {
              programId: lockupLinear[0][0],
              discriminator: "renounce"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleWithdraw",
            filter: {
              programId: lockupLinear[0][0],
              discriminator: "withdraw"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleWithdrawMax",
            filter: {
              programId: lockupLinear[0][0],
              discriminator: "withdrawMax"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleSPLTransfer",
            filter: {
              programId: tokenProgram.SPL,
              discriminator: "transfer"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleSPLTransferChecked",
            filter: {
              programId: tokenProgram.SPL,
              discriminator: "transferChecked"
            }
          }
        ]
      }
    }
  ],
  repository: "https://github.com/sablier-labs/solana-indexers"
};

export default project;
