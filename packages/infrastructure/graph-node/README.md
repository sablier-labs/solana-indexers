The Graph Node local environment spins up a Graph Node instance, an IPFS node and a Postgres database instance through a Docker Compose specification. In order for the Graph Node to access the blockchain data, you must specify the _network_ where you want to test your subgraph (e.g. `injective-mainnet`) and the Substreams endpoint where Graph Node should query the data (e.g. `https://mainnet.injective.streamingfast.io:443`). You should also provide a Substreams API token, which is automatically fetched from the `SUBSTREAMS_API_TOKEN` environment variable of your system.

The entrypoint to set up the Graph Node local environment is the `start.sh` script, which executes everything necessary in your computer. When using this script, you must pass two parameters:

```bash
./start.sh <NETWORK> <SUBSTREAMS_ENDPOINT>
```

For example, the following command spins up a Graph Node for the `injective-mainnet` network using the `https://mainnet.injective.streamingfast.io:443` Substreams endpoint.

```bash
./start.sh injective-mainnet https://mainnet.injective.streamingfast.io:443
```