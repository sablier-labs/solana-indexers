#!/usr/bin/env bash

export NETWORK=${1}
export SUBSTREAMS_ENDPOINT=${2}
export SUBSTREAMS_API_TOKEN=${SUBSTREAMS_API_TOKEN}

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

envsubst < ${ROOT}/config/substreams-generic.template.toml > ${ROOT}/generated-config.toml

echo "A new config.toml has been generated with the following values: 
NETWORK=${NETWORK}
SUBSTREAMS_ENDPOINT=${SUBSTREAMS_ENDPOINT}
SUBSTREAMS_API_TOKEN=${SUBSTREAMS_API_TOKEN}"

