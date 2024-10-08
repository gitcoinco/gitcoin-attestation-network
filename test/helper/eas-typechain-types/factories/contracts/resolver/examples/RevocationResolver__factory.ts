/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  RevocationResolver,
  RevocationResolverInterface,
} from "../../../../contracts/resolver/examples/RevocationResolver";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IEAS",
        name: "eas",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessDenied",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientValue",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidEAS",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidLength",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPayable",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schema",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "time",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "expirationTime",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "revocationTime",
            type: "uint64",
          },
          {
            internalType: "bytes32",
            name: "refUID",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "attester",
            type: "address",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Attestation",
        name: "attestation",
        type: "tuple",
      },
    ],
    name: "attest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "isPayable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schema",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "time",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "expirationTime",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "revocationTime",
            type: "uint64",
          },
          {
            internalType: "bytes32",
            name: "refUID",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "attester",
            type: "address",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Attestation[]",
        name: "attestations",
        type: "tuple[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "multiAttest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schema",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "time",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "expirationTime",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "revocationTime",
            type: "uint64",
          },
          {
            internalType: "bytes32",
            name: "refUID",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "attester",
            type: "address",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Attestation[]",
        name: "attestations",
        type: "tuple[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "multiRevoke",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schema",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "time",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "expirationTime",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "revocationTime",
            type: "uint64",
          },
          {
            internalType: "bytes32",
            name: "refUID",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "attester",
            type: "address",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Attestation",
        name: "attestation",
        type: "tuple",
      },
    ],
    name: "revoke",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "setRevocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x61010060405234801561001157600080fd5b50604051610a24380380610a2483398101604081905261003091610079565b6001608052600360a052600060c052806001600160a01b038116610067576040516341bc07ff60e11b815260040160405180910390fd5b6001600160a01b031660e052506100a9565b60006020828403121561008b57600080fd5b81516001600160a01b03811681146100a257600080fd5b9392505050565b60805160a05160c05160e0516109426100e26000396000610530015260006101f2015260006101c9015260006101a001526109426000f3fe6080604052600436106100745760003560e01c8063ce46e0461161004e578063ce46e04614610113578063e49617e114610127578063e60c35051461013a578063f545cb661461014d57600080fd5b806354fd4d50146100b257806388e5b2d9146100dd57806391db0b7e1461010057600080fd5b366100ad576040517f1574f9f300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b005b600080fd5b3480156100be57600080fd5b506100c7610199565b6040516100d4919061068f565b60405180910390f35b6100f06100eb36600461072c565b61023c565b60405190151581526020016100d4565b6100f061010e36600461072c565b610341565b34801561011f57600080fd5b5060006100f0565b6100f061013536600461079d565b610432565b6100f061014836600461079d565b610449565b34801561015957600080fd5b506100ab6101683660046107e0565b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b60606101c47f000000000000000000000000000000000000000000000000000000000000000061045a565b6101ed7f000000000000000000000000000000000000000000000000000000000000000061045a565b6102167f000000000000000000000000000000000000000000000000000000000000000061045a565b60405160200161022893929190610802565b604051602081830303815290604052905090565b6000610246610518565b83828114610280576040517f947d5a8400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3460005b828110156103315760008686838181106102a0576102a0610899565b905060200201359050828111156102e3576040517f1101129400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6103148989848181106102f8576102f8610899565b905060200281019061030a91906108c8565b5060005460ff1690565b610325576000945050505050610339565b90910390600101610284565b506001925050505b949350505050565b600061034b610518565b83828114610385576040517f947d5a8400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3460005b828110156103315760008686838181106103a5576103a5610899565b905060200201359050828111156103e8576040517f1101129400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6104158989848181106103fd576103fd610899565b905060200281019061040f91906108c8565b50600190565b610426576000945050505050610339565b90910390600101610389565b600061043c610518565b60005460ff165b92915050565b6000610453610518565b6001610443565b6060600061046783610589565b600101905060008167ffffffffffffffff81111561048757610487610906565b6040519080825280601f01601f1916602001820160405280156104b1576020820181803683370190505b5090508181016020015b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff017f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a85049450846104bb57509392505050565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610587576040517f4ca8886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b6000807a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083106105d2577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000830492506040015b6d04ee2d6d415b85acef810000000083106105fe576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061061c57662386f26fc10000830492506010015b6305f5e1008310610634576305f5e100830492506008015b612710831061064857612710830492506004015b6064831061065a576064830492506002015b600a83106104435760010192915050565b60005b8381101561068657818101518382015260200161066e565b50506000910152565b60208152600082518060208401526106ae81604085016020870161066b565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b60008083601f8401126106f257600080fd5b50813567ffffffffffffffff81111561070a57600080fd5b6020830191508360208260051b850101111561072557600080fd5b9250929050565b6000806000806040858703121561074257600080fd5b843567ffffffffffffffff81111561075957600080fd5b610765878288016106e0565b909550935050602085013567ffffffffffffffff81111561078557600080fd5b610791878288016106e0565b95989497509550505050565b6000602082840312156107af57600080fd5b813567ffffffffffffffff8111156107c657600080fd5b820161014081850312156107d957600080fd5b9392505050565b6000602082840312156107f257600080fd5b813580151581146107d957600080fd5b6000845161081481846020890161066b565b7f2e00000000000000000000000000000000000000000000000000000000000000908301908152845161084e81600184016020890161066b565b7f2e0000000000000000000000000000000000000000000000000000000000000060019290910191820152835161088c81600284016020880161066b565b0160020195945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec18336030181126108fc57600080fd5b9190910192915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea164736f6c634300081b000a";

type RevocationResolverConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RevocationResolverConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RevocationResolver__factory extends ContractFactory {
  constructor(...args: RevocationResolverConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    eas: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(eas, overrides || {});
  }
  override deploy(
    eas: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(eas, overrides || {}) as Promise<
      RevocationResolver & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): RevocationResolver__factory {
    return super.connect(runner) as RevocationResolver__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RevocationResolverInterface {
    return new Interface(_abi) as RevocationResolverInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RevocationResolver {
    return new Contract(address, _abi, runner) as unknown as RevocationResolver;
  }
}
