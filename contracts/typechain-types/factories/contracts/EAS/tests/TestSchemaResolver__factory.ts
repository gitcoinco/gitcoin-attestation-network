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
  TestSchemaResolver,
  TestSchemaResolverInterface,
} from "../../../../contracts/EAS/tests/TestSchemaResolver";

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
  "0x61010060405234801561001157600080fd5b5060405161080138038061080183398101604081905261003091610079565b6001608052600360a052600060c052806001600160a01b038116610067576040516341bc07ff60e11b815260040160405180910390fd5b6001600160a01b031660e052506100a9565b60006020828403121561008b57600080fd5b81516001600160a01b03811681146100a257600080fd5b9392505050565b60805160a05160c05160e05161071f6100e260003960006103ce0152600061015d015260006101340152600061010b015261071f6000f3fe6080604052600436106100595760003560e01c806354fd4d501461007c57806388e5b2d9146100a757806391db0b7e146100ca578063ce46e046146100dd578063e49617e1146100f1578063e60c3505146100f157600080fd5b3661007757604051631574f9f360e01b815260040160405180910390fd5b600080fd5b34801561008857600080fd5b50610091610104565b60405161009e919061050a565b60405180910390f35b6100ba6100b5366004610589565b6101a7565b604051901515815260200161009e565b6100ba6100d8366004610589565b610276565b3480156100e957600080fd5b5060006100ba565b6100ba6100ff3660046105fa565b61031d565b606061012f7f0000000000000000000000000000000000000000000000000000000000000000610330565b6101587f0000000000000000000000000000000000000000000000000000000000000000610330565b6101817f0000000000000000000000000000000000000000000000000000000000000000610330565b6040516020016101939392919061063d565b604051602081830303815290604052905090565b60006101b16103c3565b838281146101d25760405163251f56a160e21b815260040160405180910390fd5b3460005b828110156102665760008686838181106101f2576101f261069c565b9050602002013590508281111561021c5760405163044044a560e21b815260040160405180910390fd5b6102498989848181106102315761023161069c565b905060200281019061024391906106b2565b50600190565b61025a57600094505050505061026e565b909103906001016101d6565b506001925050505b949350505050565b60006102806103c3565b838281146102a15760405163251f56a160e21b815260040160405180910390fd5b3460005b828110156102665760008686838181106102c1576102c161069c565b905060200201359050828111156102eb5760405163044044a560e21b815260040160405180910390fd5b6103008989848181106102315761023161069c565b61031157600094505050505061026e565b909103906001016102a5565b60006103276103c3565b60015b92915050565b6060600061033d8361040e565b600101905060008167ffffffffffffffff81111561035d5761035d6106d3565b6040519080825280601f01601f191660200182016040528015610387576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461039157509392505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461040c57604051634ca8886760e01b815260040160405180910390fd5b565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b831061044d5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610479576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061049757662386f26fc10000830492506010015b6305f5e10083106104af576305f5e100830492506008015b61271083106104c357612710830492506004015b606483106104d5576064830492506002015b600a831061032a5760010192915050565b60005b838110156105015781810151838201526020016104e9565b50506000910152565b60208152600082518060208401526105298160408501602087016104e6565b601f01601f19169190910160400192915050565b60008083601f84011261054f57600080fd5b50813567ffffffffffffffff81111561056757600080fd5b6020830191508360208260051b850101111561058257600080fd5b9250929050565b6000806000806040858703121561059f57600080fd5b843567ffffffffffffffff8111156105b657600080fd5b6105c28782880161053d565b909550935050602085013567ffffffffffffffff8111156105e257600080fd5b6105ee8782880161053d565b95989497509550505050565b60006020828403121561060c57600080fd5b813567ffffffffffffffff81111561062357600080fd5b8201610140818503121561063657600080fd5b9392505050565b6000845161064f8184602089016104e6565b601760f91b908301908152845161066d8160018401602089016104e6565b601760f91b60019290910191820152835161068f8160028401602088016104e6565b0160020195945050505050565b634e487b7160e01b600052603260045260246000fd5b6000823561013e198336030181126106c957600080fd5b9190910192915050565b634e487b7160e01b600052604160045260246000fdfea264697066735822122099f4bda53627a0d19276dd25ad4df9bb3cc9e1e6aa131cd8445b3b7835081d5f64736f6c634300081b0033";

type TestSchemaResolverConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestSchemaResolverConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestSchemaResolver__factory extends ContractFactory {
  constructor(...args: TestSchemaResolverConstructorParams) {
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
      TestSchemaResolver & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TestSchemaResolver__factory {
    return super.connect(runner) as TestSchemaResolver__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestSchemaResolverInterface {
    return new Interface(_abi) as TestSchemaResolverInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): TestSchemaResolver {
    return new Contract(address, _abi, runner) as unknown as TestSchemaResolver;
  }
}
