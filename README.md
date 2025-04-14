# Sablier Subgraphs and Indexers (Solana)

1. [Getting Started](#getting-started-)
2. [Registration](#registration-)
3. [Development](#development-)
4. [Deployment](#deployment-)
5. [Useful Resources](#useful-resources-)

## Getting Started 🔮

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

## Registration 📑

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
   cd ./subgraph
   yarn substream-auth # or simply substreams auth
```

Don't forget to run the `.substreams.env` file if you generate it, for export to apply its effects and make the key available in the terminal.

#### 3. Register with buf.build to avoid rate limits

The system uses buf.build to create/validate protobufs.
It [rate-limits](https://buf.build/docs/bsr/rate-limits/) after 10 queries / hour, so it's advised to create a free account for active development.

```
buf registry login
```

#### 4. Register or connect to thegraph.com/studio and run auth

Create or look for the subgraph profile and look for the authenticate & deploy section on the right hand side. You need to run the command below and paste the auth string.

```bash
   cd ./subgraph
   yarn subgraph-auth # or simply substreams auth
```

## Development 👨‍💻

After dealing with all the necessary dependencies from [Getting Started](#getting-started-) and [Registration](#registration-) you can start submitting updates for the substreams / subgraphs. The [`./subgraph/package.json`](./subgraph/package.json) file has some handy scripts for quick configurations so we're going to assume commands will from now on be run from inside the **`./subgraph`** folder.

### Set up ⭐

```bash
   yarn setup:devnet
```

The `setup` command will:

1. generate `./substream.yaml`, with the cluster configurations
2. generate `./src/generated`, with the typed models based on `./proto`
3. build the substream `*.spkg` based on `./substreams.yaml`, `./proto` and `./buf.gen.yaml`
4. generate `./subgraph/generated` based on `*.spkg` and `./subgraphs/bug.gen.yaml`

### Substreams

To develop new features into the substream, look into modifying the following files:

1. `./proto/program.proto` - Add data structures to save transaction values into
2. `./src/lib.rs` - Implement support for new events or data structures

To test your changes locally, you can run:

```bash
   # Relies on files already generated using yarn setup:devnet
   yarn substream-gui:devnet
```

### Subgraphs

#### 1. Create a new subgraph on [thegraph.com/studio](https://thegraph.com/studio/)

Create a placeholder project in the Studio. We'll need the `auth` key and the name.

#### 2. Replace details in package.json and subgraph.yaml

- Make sure the `dataSources.source.package.file` is set to the actual name of the substream `spkg` (produced after build)
- Make sure the name for protogen also matches
- Replace slug in `subgraph-deploy` (package.json) with the one created at step 1

#### 3. Deploy

```bash
   yarn setup:devnet
```

## Deployment 🚀

To engage with the `devnet` substream gui you can run:

```bash
cd ./subgraph
yarn stream-gui:devnet
```

To configure a subgraph for deployment on the studio, you can run:

```bash
cd ./subgraph
yarn setup:devnet

```

## Useful Resources 📦

### `substreams.yaml`

- The [manifest reference](https://docs.substreams.dev/reference-material/substreams-components/manifests) for the structure of `substreams.yaml`
- Examples of [existing modules](https://substreams.dev/packages/solana-common/latest) show some versions of query strings (they can have `||` operators)
