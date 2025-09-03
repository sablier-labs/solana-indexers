import {
  SolanaProject,
  SolanaDatasourceKind,
  SolanaHandlerKind
} from "@subql/types-solana";

import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

// Can expand the Datasource processor types via the generic param
const project: SolanaProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "@sablier/solana-indexers-airdrops-subquery",
  description: "Sablier subquery indexers for airdrops on Solana",
  runner: {
    node: {
      name: "@subql/node-solana",
      version: ">=6.0.7"
    },
    query: {
      name: "@subql/query",
      version: "*"
    }
  },
  schema: {
    file: "./schema.graphql"
  },
  network: {
    chainId: "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG", // TODO template
    endpoint: [
      "https://devnet.helius-rpc.com/?api-key=72a1257a-8a5c-4bd8-9945-2ad8956aaf73" // TODO move to env
    ]
  },
  dataSources: [
    {
      kind: SolanaDatasourceKind.Runtime,
      startBlock: 401945064,
      assets: new Map([
        [
          "GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D", // TODO template
          { file: "./idls/merkle_instant_v10.json" }
        ]
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleClaim",
            filter: {
              programId: "GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D",
              discriminator: "claim" // TODO: type check names using IDL
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleClawback",
            filter: {
              programId: "GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D",
              discriminator: "clawback"
            }
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleCreate",
            filter: {
              programId: "GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D",
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
