# blockchain-based-credential-store
Personal final year project in the University of Manchester, which aims to build a Dapp for storing files based on Neo blockchain platform.

## Technique stack:
1. Frontend:
     - Material UI
     - React
     - Neonjs
        - blockchain wallet management in NEO ecosystem
     - ipfs-http-client
        - libary for frontend inteacting with IPFS node
2. Backend:
  - C# 
    - .NET core >= 6.0;
  - Neo-devpack-dotnet
    - compiler for Neo Smart Contract
  - Neo-CLI 
    - for private blockchain setup, not included in this repository
  - IPFS client 
    - For starting IPFS node for storage of files, not included in this repository

In one picture:
[This is an image](./Architecture.png)

## Requirement before running:
Currently this project is running on a personal blockchain ;<br/>
So it is not recommended to run this project;<br/>
But if you are willing to, the following steps will tell you how to set up a private chain to run this project. 
1. Install IPFS client and start running it:
   - Details please see https://docs.ipfs.tech/install/ipfs-desktop/
2. Install Neo-CLI and start a private blockchain:
   - Details on https://docs.neo.org/docs/zh-cn/node/cli/setup.html
     - for private chain setup, please see https://docs.neo.org/docs/zh-cn/develop/network/private-chain/solo.html
     - Run Neo-CLI by `<Path of Neo CLI>/neo-cli`
3. Install some Neo-CLI plugins:
   - In Neo-CLI:
     - DBFT: `install DBFTPlugin`
     - RPCServer: `install RpcServer`
     - TokensTracker: `install TokensTracker`
4. Creat wallet file in Neo-CLI:
    - In Neo-CLI:
    `create wallet wallet.json`

## Running command:
- start frontend server:
    ```
    cd frontend/
    npm run start
    ```
- compile backend code:
Make sure you have installed .Net Core version >= 6.0: https://dotnet.microsoft.com/en-us/download/dotnet
    ```
    cd backend;
    dotnet build;
    ```

- Deploy Smart Contract on your private chain:
    1. After compiling backend code, there will be two genereated directories in the backend:bin and obj 
    2. In Neo CLI:`deploy 'backend/smartContract/Storage/bin/sc/Storage.nef' 'backend/smartContract/Storage/bin/sc/Storage.manifest.json'`