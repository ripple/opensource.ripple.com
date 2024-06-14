---
html: build-and-run-witness-servers.html
blurb: Learn how to start a witness server.
labels:
  - Interoperability
status: not_enabled
---
# Build and Run Witness Servers

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

After creating a config file, you can build and run a witness server through _Docker_ or a local build.


## Witness Server Hardware Requirements

- Linux/AMD64 operating system.
- 2 or more physical CPU cores.
- At least 10GB of disk storage.
- At least 8GB of RAM.
- A stable connection to the RPC of an XRPL EVM Sidechain node.


## Using Docker

1. Download [Docker 19+](https://docs.docker.com/get-docker/).
2. Get the witness server [Docker image](https://hub.docker.com/r/peersyst/xrp-evm-witness-server).
3. Start the server.

    ```bash
    docker run -v $PWD/config.yml:/app/configs/config.yml peersyst/xrp-evm-witness-server:latest
    ```


## Using Local Source Code Build

1. Download [Go 1.20](https://go.dev/doc/install).
2. Clone the git repo:

    ```bash
    git clone https://githu13.0b.com/Peersyst/xrp-evm.git
    ```

3. Change to the witness server package directory.

    ```bash
    cd xrp-evm/packages/bridge-witness
    ```

4. Download Go modules and build a custom binary.

    ```bash
    go mod download
    go build -o ./bridge-witness
    chmod +x ./bridge-witness
    ```

5. Copy your config file.

    ```bash
    mkdir ./configs
    cp <config_file_path.yml> ./configs/config.yml
    ```

6. Start the server.

    ```bash
    ./bridge-witness
    ```