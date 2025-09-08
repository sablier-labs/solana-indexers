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
  lockupLinear
} from "./src/generated/env";

dotenv.config({ path: path.resolve(__dirname, "./../../.env"), quiet: true });

// Can expand the Datasource processor types via the generic param
const project: SolanaProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "Sablier Solana Lockup Devnet",
  description: "Sablier subquery indexers for lockup on Solana",
  runner: {
    node: {
      name: "@subql/node-solana",
      version: ">=6.0.7"
    },
    query: {
      name: "@subql/query",
      version: ">=2.23.5"
    }
    // query: {
    //   name: "@subql/query-subgraph",
    //   version: ">=0.2.2"
    // }
  },
  schema: {
    file: "./schema.graphql"
  },
  network: {
    chainId: chainGenesis,
    endpoint: [`${rpc}${process.env.HELIUS_RPC_KEY}`]
  },
  dataSources: [
    {
      kind: SolanaDatasourceKind.Runtime,
      startBlock: startBlock_lockup,
      assets: new Map([
        [lockupLinear[0][0], { file: "./idls/lockup_linear_v10.json" }]
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
          }

          // TODO add support for transfers
        ]
      }
    }
  ],
  repository: "https://github.com/sablier-labs/solana-indexers"
};

export default project;
