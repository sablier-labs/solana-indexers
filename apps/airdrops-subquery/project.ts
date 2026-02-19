import {
  SolanaProject,
  SolanaDatasourceKind,
  SolanaHandlerKind
} from "@subql/types-solana";

import * as dotenv from "dotenv";
import path from "path";

import {
  chainGenesis,
  cluster,
  rpc,
  startBlock_airdrops,
  merkleInstant
} from "./src/constants/index";

dotenv.config({ path: path.resolve(__dirname, "./../../.env"), quiet: true });

const RPC_HELIUS = process.env.HELIUS_RPC_KEY
  ? `${rpc.helius}${process.env.HELIUS_RPC_KEY}`
  : undefined;
const RPC_ONFINALITY = process.env.ONFINALITY_RPC_KEY
  ? `${rpc.onfinality}${process.env.ONFINALITY_RPC_KEY}`
  : undefined;

const endpoint = [RPC_ONFINALITY, RPC_HELIUS, ...rpc.fallback].filter(
  r => r
) as string[];

// Can expand the Datasource processor types via the generic param
const project: SolanaProject = {
  specVersion: "1.0.0",
  version: "0.1.1",
  name: `sablier-airdrops-solana-${cluster}`,
  description: "Sablier subquery indexers for airdrops on Solana",
  runner: {
    node: {
      name: "@subql/node-solana",
      version: ">=6.2.0"
    },
    query:
      process.env.SUBQL_QUERY_SYNTAX === "subgraph"
        ? {
            name: "@subql/query-subgraph",
            version: ">=0.3.0"
          }
        : {
            name: "@subql/query",
            version: ">=2.25.0"
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
      startBlock: startBlock_airdrops,
      assets: new Map([
        [merkleInstant[0][0], { file: "./idls/merkle_instant_v10.json" }]
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleClaim",
            filter: {
              programId: merkleInstant[0][0],
              discriminator: "claim"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleClawback",
            filter: {
              programId: merkleInstant[0][0],
              discriminator: "clawback"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleCreate",
            filter: {
              programId: merkleInstant[0][0],
              discriminator: "createCampaign"
            }
          }
        ]
      }
    }
  ],
  repository: "https://github.com/sablier-labs/solana-indexers"
};

export default project;
