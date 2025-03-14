# Sablier Subgraphs and Indexers (Solana)

## Development

## Getting Started

#### 1. Install Rust

```bash
   brew install rust
   rustup target add wasm32-unknown-unknown
```

Other crates will be installed later with `substreams run` or `substreams gui`.

#### 2. Install Docker Desktop

https://www.docker.com/products/docker-desktop/

#### 3. Install Substream CLI

```bash
brew install streamingfast/tap/substreams
brew install bufbuild/buf/buf
```

This will also install a dependency for Protobuf support.

## Registration

You'll need to create an account or log into an existing one on The Graph Market. This will grant you access to a token which enables indexing.

#### 1. Get the API Key and Access Token

- Docs: https://docs.substreams.dev/reference-material/substreams-cli/authentication
- Dashboard: https://thegraph.market/

#### 2. Set API Key into your local environment

The CLI utility looks for `SUBSTREAMS_API_TOKEN` being declared in your shell.

```bash
export SUBSTREAMS_API_TOKEN=<ACCESS_TOKEN>
```

Either manually add the token to your shell or follow the automated process with:

```bash
substreams auth
```

#### 3. Register with buf.build to avoid rate limits

The system uses buf.build to create/validate protobufs.
It [rate-limits](https://buf.build/docs/bsr/rate-limits/) after 10 queries / hour, so it's advised to create a free account for active development.

```
buf registry login
```

## Development

After dealing with all the necessary dependencies from [Getting Started](#getting-started) and [Registration](#registration) you can start development on the substreams / subgraphs.

### Substreams

```bash

substreams build
substreams gui -e devnet.sol.streamingfast.io:443 ./substreams.yaml

```

### Subgraphs

#### 1. Create a new subgraph on thegraph.com

Create a placeholder project on thegraph.com
We'll need the `auth` key and the name.

#### 2. Replace details in package.json and subgraph.yaml

- Make sure the `dataSources.source.package.file` is set to the actual name of the substream `spkg` (produced after build)
- Make sure the name for protogen also matches
- Replace slug in `deploy-studio` with the one created at step 1

#### 3. Deploy

```bash
cd ./subgraph

yarn generate # runs codegen and protogen
yarn auth-studio
yarn deploy-studio

```

## Useful Resources

### `substreams.yaml`

- The [manifest reference](https://docs.substreams.dev/reference-material/substreams-components/manifests) for the structure of `substreams.yaml`
- Examples of [existing modules](https://substreams.dev/packages/solana-common/latest) show some versions of query strings (they can have `||` operators)

## Caveats / Technical Debt

- Tried moving to a workspace structure. Rust doesn't like it.
- Tried implementing a package.json to store useful scripts. Rust doesn't like it (it actually crashes something during `substreams run`)
