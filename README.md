# Sablier Subgraphs and Indexers (Solana)

## Development

## Getting Started

### 1. Install Rust

```bash
   brew install rust
   rustup target add wasm32-unknown-unknown
```

Other crates will be installed later with `substreams run` or `substreams gui`.

### 2. Install Docker Desktop

https://www.docker.com/products/docker-desktop/

### 3. Install Substream CLI

```bash
brew install streamingfast/tap/substreams
brew install bufbuild/buf/buf
```

This will also install a dependency for Protobuf support.

## Registration

You'll need to create an account or log into an existing one on The Graph Market. This will grant you access to a token which enables indexing.

### 1. Get the API Key and Access Token

- Docs: https://docs.substreams.dev/reference-material/substreams-cli/authentication
- Dashboard: https://thegraph.market/

### 2. Set API Key into your local environment

The CLI utility looks for `SUBSTREAMS_API_TOKEN` being declared in your shell.

```bash
export SUBSTREAMS_API_TOKEN=<ACCESS_TOKEN>
```

Either manually add the token to your shell or follow the automated process with:

```bash
substreams auth
```

### 3. Register with buf.build to avoid rate limits

The system uses buf.build to create/validate protobufs.
It [rate-limits](https://buf.build/docs/bsr/rate-limits/) after 10 queries / hour, so it's advised to create a free account for active development.

```
buf registry login
```

## Useful Resources

### `substreams.yaml`

- The [manifest reference](https://docs.substreams.dev/reference-material/substreams-components/manifests) for the structure of `substreams.yaml`
- Examples of [existing modules](https://substreams.dev/packages/solana-common/latest) show some versions of query strings (they can have `||` operators)
