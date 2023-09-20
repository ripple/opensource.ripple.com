---
html: bridge-door-interface.html
blurb: Learn more about the events, data types, storage, and functions in the bridge door interface.
labels:
  - Interoperability
status: not_enabled
---
# Bridge Door Interface

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}

## Events

### CreateClaim

This event is emitted when a claim is created.

```solidity
event CreateClaim(uint256 indexed claimId, address indexed creator, address indexed sender);
```

### Commit

This event is emitted when a commit is done.

```solidity
event Commit(uint256 indexed claimId, address indexed sender, uint256 value, address receiver);
```

### CommitWithoutAddress

This event is emitted when a commit is done, but no address was specified.

```solidity
event CommitWithoutAddress(uint256 indexed claimId, address indexed sender, uint256 value);
```

### Claim

This event is emitted when a claim is claimed.

```solidity
event Claim(uint256 indexed claimId, address indexed sender, uint256 value, address destination);
```

### CreateAccountCommit

This event is emitted when a create account commit is done.

```solidity
event CreateAccountCommit(address indexed creator, address indexed destination, uint256 value, uint256 signatureReward);
```

### AddClaimAttestation

This event is emitted when a witness performs a claim attestation.

```solidity
event AddCreateAccountAttestation(address indexed witness, address indexed receiver, uint256 value);
```

### AddCreateAccountAttestation

This event is emitted when a witness performs a create account attestation.

```solidity
event AddCreateAccountAttestation(address indexed witness, address indexed receiver, uint256 value);
```

### Credit

This event is emitted when witness rewards are distributed.

```solidity
event Credit(uint256 indexed claimId, address indexed receiver, uint256 value);
```

### CreateAccount

This event is emitted when an account is created after receiving enough create account attestations.

```solidity
event CreateAccount(address indexed receiver, uint256 value);
```


## Data Types

### AttestationClaimData

The data for a single attestation event.

```solidity
struct AttestationClaimData {
    address destination;
    uint256 amount;
}
```

### ClaimData

The data for a claim.

```solidity
struct ClaimData {
    address creator; // Address that has created the claim
    address sender; // address that will send the transaction on the other chain
    mapping(address => AttestationClaimData) attestations; // Attestations made
    bool exists; // Control flag
}
```

### AddClaimAttestationData

The data for a claim attestation.

```solidity
struct AddClaimAttestationData {
    uint256 claimId;
    uint256 amount;
    address sender;
    address destination;
}
```

### CreateAccountData

The data for a create account event.

```solidity
struct CreateAccountData {
    uint256 signatureReward; // The signature reward for the create account
    mapping(address => uint256) attestations; // Attestations made [witness address] => amount
    bool isCreated; // If the create account has already been created
    bool exists; // Control flag
}
```

### AddCreateAccountAttestationData

The data for a create account attestation.

```solidity
struct AddCreateAccountAttestationData {
    address destination;
    uint256 amount;
    uint256 signatureReward;
}
```


## Storage

### claims

Mapping that contains the information for all claim events. The keys are the claim IDs, and the values are the data for each claim.

```solidity
mapping(uint256 => ClaimData) public claims;
```

### createAccounts

Mapping that contains the information for all create account events. The keys are the addresses of accounts created, and the values are the data for each create account.

```solidity
mapping(address => CreateAccountData) public createAccounts;
```

### _safe

The address of the safe attached to this bridge door contract.

```solidity
GnosisSafeL2 public _safe;
```

### _tokenAddress

If the bridge isn't an XRP bridge, then the address of the ERC20 token associated with the bridge.

```solidity
address public _tokenAddress;
```

### _lockingChainDoor

Address of the locking chain door.

```solidity
address public _lockingChainDoor;
```

### _lockingChainIssuer

If the locking chain door is on the XRPL, then this is the address of the issuer on the XRPL. Otherwise, it's the token address on the locking chain.

```solidity
address public _lockingChainIssuer;
```

### _lockingChainIssue

The token code on the locking chain.

```solidity
string public _lockingChainIssue;
```

### _issuingChainDoor

The address of the issuing chain door.

```solidity
address public _issuingChainDoor;
```

### _issuingChainIssuer

If the issuing chain door is on the XRPL, then this is the address of the issuer on the XRPL. Otherwise, it's the token address on the issuing chain.

```solidity
address public _issuingChainIssuer;
```

### _issuingChainIssue

The token code on the issuing chain.

```solidity
string public _issuingChainIssue;
```

### _isLocking

`True` if the current chain is a locking chain.

```solidity
bool public _isLocking;
```

### _signatureReward

The witness signers reward per attestation.

```solidity
uint256 public _signatureReward;
```

### _minAccountCreateAmount

The minimum amount for a create account operation.

```solidity
uint256 public _minAccountCreateAmount;
```


## Call XChain Functions

### createClaimId()

Analog function of the `XChainCreateClaimID` transaction.

```solidity
function createClaimId(address sender) public virtual payable returns(uint256);
```

### commit()

Analog function of the `XChainCommit` transaction.

```solidity
function commit(address receiver, uint256 claimId, uint256 amount) public virtual payable;
```

### commitWithoutAddress()

Analog function of the `XChainCommit` without address transaction.

```solidity
function commitWithoutAddress(uint256 claimId, uint256 amount) public virtual payable;
```

### claim()

Analog function of the `XChainClaim` transaction.

```solidity
function claim(uint256 claimId, uint256 amount, address destination) public virtual;
```

### createAccountCommit()

Analog function of the `XChainCreateAccountCommit` transaction.

```solidity
function createAccountCommit(address destination, uint256 amount, uint256 signatureReward) public virtual payable;
```

### addClaimAttestation()

Analog function of the `XChainAddAttestation` transaction for claims.

```solidity
function addClaimAttestation(uint256 claimId, uint256 amount, address sender, address destination) public virtual;
```

### addCreateAccountAttestation()

Analog function of the `XChainAddAttestation` transaction for create accounts.

```solidity
function addCreateAccountAttestation(address destination, uint256 amount, uint256 signatureReward) public virtual;
```

### addAttestation()

Analog function of the `XChainAddAttestation` transaction for multiple attestations.

```solidity
function addAttestation(
        AddClaimAttestationData[] memory claimAttestations,
        AddCreateAccountAttestationData[] memory createAccountAttestations
    ) public virtual;
```

### sendTransaction()

```solidity
function sendTransaction(address payable destination, uint256 value) virtual internal;
```

### sendAssets()

```solidity
function sendAssets(address destination, uint256 amount) virtual internal;
```

## View Functions

### getWitnesses()

Retrieve witness servers adresses.

```solidity
function getWitnesses() public virtual view returns (address[] memory);
```

## Ownership Management Functions

### pause()

Pause the bridge door contract.

```solidity
function pause() public onlyOwner whenNotPaused;
```

### unpause()

Unpause the bridge door contract.

```solidity
function unpause() public onlyOwner whenPaused;
```

### execute()

Make or delegate a call on the bridge door contract.

```solidity
function execute(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation
) public onlyOwner returns (bool success);
```
