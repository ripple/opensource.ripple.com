# Introduction

Claudia is a tool which helps with an make a few XRPL specific tasks look very easy. Tasks like running a local instance of rippled, managing a local network, managing a sidechain network, running tests and even learning a few neat tricks with XRPL in a quick fashion can be done effortlessly with this tool.

Claudia was developed by the XRPL Automation Team as an internal tool to help with XRPL local development, debugging and testing. As the tool matured, the team quickly realized its potential and decided to expose it outside of Ripple, so that everyone can benefit from its capabilities. 

Following are some of the important tasks that can be performed using Claudia:
- Build rippled from local code.
- Install rippled from pre-built binaries released by Ripple.
- Manage a local-mainnet network using local rippled instance.
- Locally build a local witness server to start a sidechain network.
- Manage a local-sidechain network.
- Run unit tests on the built/installed rippled instance.
- Run system tests on local-mainnet, local-sidechain, devnet and testnet networks.
- Manage rippled features on the local-mainnet and local-sidechain networks.
- Learn more about XRPL capabilities and perform real-time learning activities on local-mainnet, local-sidechain, devnet and testnet networks.

## General Prerequisites
Claudia can be installed on both macOS and Ubuntu. Currently, there is no support for Windows. Following prerequisites must be installed before installing Claudia:
- [Python3](https://www.python.org/)
- [pip3](https://pip.pypa.io/en/stable/)
- [Docker](https://www.docker.com/)

Claudia allows its users to run System test using Javascript client library. The following is **ONLY** required if you intend to run the Javascript system tests:
- [node](https://nodejs.org/en/download)
- [npm](https://www.npmjs.com/package/download)

## Installation
Once the general prerequisites have been installed, Claudia can be installed from [PyPi](https://pypi.org/project/claudia/). From your terminal please run:

    pip3 install claudia

## Usage
Claudia has a bunch of self-explantory features which are offered via a seamless UI and CLI experience. Please note that XRPL Learning Center is only available with Claudia UI. 

Claudia CLI offers two modes:
1. Demo mode. This is an interactive mode that can help reduce typing efforts significantly. You would mostly navigate a pre-built menu using ↑ ↓ and ↵ keys. Minimal typing will be required. 
2. (Standard) CLI mode.

### How to run Claudia CLI commands?
After installing claudia, go to your terminal and run claudia. Each command supports --help flag that displays the usage and arguments. e.g. claudia --help, claudia run --help

### How to run Claudia in demo mode?
From your terminal and run claudia demo

### How to start Claudia UI?
From your terminal, run claudia ui. Alternatively, you can launch the UI via the Claudia demo mode by selecting Launch Claudia UI

## Features
Claudia offers a bunch of features which allows you to manage local rippled instance, manage networks, run tests and even learn a few XRPL tricks. This section walks you through some of the major features.

### How to build rippled?
Claudia offers a way to build rippled from local code. You will need to clone [rippled](https://github.com/XRPLF/rippled) repository first before starting with this step. If you intend to use sidechain functionality, please use [this](https://github.com/seelabs/rippled/tree/xbridge) rippled fork instead.

Once the repository has been cloned, you can build rippled as follows. Each option would require you to provide the ***absolute path*** to the cloned repository.

- UI
  - Navigate to `Custom XRPL Networks` and select `Build rippled`
- CLI Mode
  - Run `claudia rippled build --repo <repo_path>`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Build rippled from local code`

### How to install rippled?
Claudia offers a way to install rippled using the pre-built binaries distributed by Ripple. You can install rippled as follows:
- UI
  - Navigate to `Custom XRPL Networks` and select `Install rippled` 
- CLI Mode
  - Run `claudia rippled install`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Install rippled`

### How to switch between build and install rippled modes?
Once you build or install rippled, Claudia will remember that context forever. If you have already built and installed rippled in both modes, and would like to switch between the two modes, run the following:
- UI
  - Navigate to `Settings` and select `Set Install Mode`
- CLI Mode
  - Run `claudia set-install-mode build` to set build mode.
  - Run `claudia set-install-mode install` to set install mode.
- Demo Mode
  - Select `Settings` ->  `Set install mode as build` to set build mode.
  - Select `Settings` -> `Set install mode as install` to set install mode.

*Please note that all previously running networks will have to be stopped and started again after switching rippled modes.*

### How to enable a feature in rippled?
Before we start with this option, rippled has to be built or installed locally. Also, please note that there is no validation for feature name. Please make sure the feature name is correct (case-sensitive).
- UI
  - Navigate to `Settings` and select `Enable a rippled feature`
- CLI Mode
  - Run `claudia enable-feature --feature <feature_name>`
- Demo Mode
  - Select `Settings` -> `Enable a rippled feature`

### How to disable a feature in rippled?
Before we start with this option, rippled has to be built or installed locally. Please note that there is no validation for feature name. Please make sure the feature name is correct (case-sensitive).
- UI
  - Navigate to `Settings` and select `Disable a rippled feature`
- CLI Mode
  - Run `claudia disable-feature --feature <feature_name>`
- Demo Mode
  - Select `Settings` -> `Disable a rippled feature`

### How to build witness server?
Before you can start a sidechain network, you will need to build a witness server locally. You will need to clone [XBridge Witness](https://github.com/seelabs/xbridge_witness) repository first before starting on this step. Once the repository has been cloned, you can build the witness sercer as follows. Each option would require you to provide the absolute path to the cloned repository.

- UI
  - Navigate to `Custom XRPL Networks` and select `Build Witness Server`
- CLI Mode
  - Run `claudia witness build --repo <repo_path>`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Build witness server`

### How to start a local-mainnet network?
Before you can start a local mainnet network, rippled has to be built or installed locally. Afterwards, you can follow these instructions to start a local mainnet network:
- UI
  - Navigate to `Custom XRPL Networks` and select `Start Network`
- CLI Mode
  - Run `claudia local-mainnet start`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Start local-mainnet`

### How to stop a local-mainnet network?
Before you can stop a local mainnet network, it has to be running in the first place. Afterwards, you can follow these instructions to stop a local mainnet network:
- UI
  - Navigate to `Custom XRPL Networks` and select `Stop Network`
- CLI Mode
  - Run `claudia local-mainnet stop`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Stop local-mainnet`


### How to start a local-sidechain network?
Before you can start a local sidechain network:
1. rippled has to be built/installed locally.
2. Witness server has to be built locally. 
3. `XChainBridge` rippled feature has to be enabled.
4. The local-mainnet network has to be running. 

Once all of the requirements have been met, you can start the local sidechain network  as follows:
- UI
  - Navigate to `Custom XRPL Networks` and select `Start Sidechain Network`
- CLI Mode
  - Run `claudia local-sidechain start`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Start local-sidechain`


### How to stop a local-sidechain network?
Before you can start a local sidechain network, it has to be running in the first place. Afterwards, you can stop the local sidechain network  as follows:
- UI
  - Navigate to `Custom XRPL Networks` and select `Stop Sidechain Network`
- CLI Mode
  - Run `claudia local-sidechain stop`
- Demo Mode
  - Select `Custom XRPL Networks` -> `Stop local-sidechain`
  - 
Please note that once the sidechain has been stopped, local-mainnet has to be restarted before attempting to start the local-sidechain again.

### How to run unit tests?
Before you can run unit tests, rippled has to be built or installed locally. Afterwards, you can run the unit tests as follows:
- UI
  - Navigate to `XRPL tests` and select `Run Unit Tests`
- CLI Mode
  - Run `claudia run unittests`. Run `claudia run unittests --help` to see options.
- Demo Mode
  - Select `XRPL Tests` -> `Run unit tests`

By default, all tests will run. Optionally, you can also set a filter to run a selected few tests in each mode.

### How to run system tests?
Claudia offers a way to run system tests on different networks. If you wish to run tests on locally running mainnet or sidechain networks, the networks should be running first. Alternatively, you can run the tests on devnet and testnet as well.

The system tests can run using either JavaScript or Python client libraries. For Python client, both `JSON-RPC` and `WebSocket` connections are supported. JavaScript client only supports `WebSocket` connection.

These tests are broken down into different features and are tagged as well. You can choose to run a few or all tests. Please note that if you chose regression tag, all test in the chosen feature will be executed.

The system tests can be configured to be run in any way you need them to. By default, the following configuration is selected:


- **Client Library:** `Python`
- **Connection:** `JSON-RPC`
- **Network:** `local-mainnet`
- **Test Tag:** `smoke`
- **Feature:** `payments`

The system test run can be started as follows:
- UI
  - Navigate to `XRPL tests` and select `Run System Tests`. Choose your options and start the run.
- CLI Mode
  - Run `claudia run systemtests`. Run `claudia run systemtests --help` to see options.
- Demo Mode
  - Select `XRPL Tests` -> `Run system tests`

### How to cleanup your computer and free resources after running Claudia?
While using claudia, there are a few files created permanently. Also, there are a few system resources which are reserved for future use. Running this command will delete these files and free up resources. As a result, any progress made by using Claudia will be lost. This action cannot be undone. Resources can be freed and your machine can be freed as follows:
- UI
  - Navigate to `Settings` and select `Cleanup`
- CLI Mode
  - Run `claudia clean`
- Demo Mode
  - Select `Settings` -> `Clean up the host and free resources`

### How to run XRPL Learning Center?
Claudia offers a neat interactive learning environment in which you can a learn a few things about XRPL. These learning activities can be  performed on local-mainnet, local-sidechain, devnet and testnet networks. You can launch the XRPL Learning Center only via UI. 

Navigate to `XRPL Learning Center`, select a learning activity and follow the instructions. 

### How to uninstall Claudia?
*We recommend that you cleanup your machine before uninstalling Claudia.* Afterwards, please run: 

    pip3 uninstall claudia

## Contributions
Claudia is developed by Ripple Automation Team. The following people contributed to this release:

- Manoj Doshi <mdoshi@ripple.com>
- Ramkumar SG <rsg@ripple.com>
- Kaustubh Saxena <ksaxena@ripple.com>
- Michael Legleux <mlegleux@ripple.com>
- Anagha Agashe <aagashe@ripple.com>
- Mani Mounika Kunasani <mkunasani@ripple.com>
