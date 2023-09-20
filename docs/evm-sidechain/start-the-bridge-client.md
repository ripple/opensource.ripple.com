---
html: start-the-bridge-client.html
blurb: Start the bridge client.
labels:
  - Interoperability
status: not_enabled
---
# Start the Bridge Client

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

## Prerequisites

- [Node 16.13.0+](https://nodejs.org/es)
- [Docker 19.0.0+](https://www.docker.com/)
- [Docker Compose 2.0.0+](https://docs.docker.com/compose/)
- [yarn 1.22.0+](https://yarnpkg.com/)


## Steps

1. Clone the git repository.

    ```bash
    git clone https://github.com/Peersyst/xrp-evm.git
    ```

2. Install the dependencies.

    ```bash
    yarn
    cd packages/bridge-client-backend && yarn && cd ../..
    cd packages/bridge-client-frontend && yarn && cd ../../
    ```

3. Start the services. You have two options:

    - Start the client with a single command:

        ```bash
        yarn start
        ```
    
    - Start each service separately. Open a new terminal window for each command.

        ```bash
        # Starts the database
        docker-compose up

        # Starts the backend
        cd packages/bridge-client-backend && yarn start

        # Starts the frontend
        cd packages/bridge-client-frontend && yarn start
        ```