# Linode Devnet Documentation

### Requirements

Need go v.1.21 or higher

Need Ignite CLI with `curl https://get.ignite.com/cli | bash` and move it to the right path:
`sudo mv /root/ignite /usr/local/bin/` 

### Optimum Chain

Create `optimum` chain with 2 flexnodes: `flexnode-1` and `flexnode-2`

```
ignite scaffold chain optimum
```

Build chain

```
cd optimum
ignite chain build
```

This will create a binary called `optimumd` on the path `/root/go/bin/optimumd` 

```
Cosmos SDK's version is: v0.50.8

🗃  Installed. Use with: optimumd

```

Create directories for each node:

```
mkdir -p ~/optimum_nodes/flexnode-1
mkdir -p ~/optimum_nodes/flexnode-2
mkdir -p ~/optimum_nodes/flexnode-3
mkdir -p ~/optimum_nodes/flexnode-4
mkdir -p ~/optimum_nodes/flexnode-5
```

Initialize each node in its respective directory:

```
optimumd init flexnode-1 --chain-id optimum-testnet --home ~/optimum_nodes/flexnode-1
optimumd init flexnode-2 --chain-id optimum-testnet --home ~/optimum_nodes/flexnode-2
optimumd init flexnode-3 --chain-id optimum-testnet --home ~/optimum_nodes/flexnode-3
optimumd init flexnode-4 --chain-id optimum-testnet --home ~/optimum_nodes/flexnode-4
optimumd init flexnode-5 --chain-id optimum-testnet --home ~/optimum_nodes/flexnode-5
```

which will result something like this:

```
{
 "moniker": "flexnode-1",
 "chain_id": "optimum",
 "node_id": "b21184650057ae187b320725b205cbb596c99a61",
 "gentxs_dir": "",
 "app_message": {
  "06-solomachine": null,
  "07-tendermint": null,
  "auth": {
   "params": {
    "max_memo_characters": "256",
    "tx_sig_limit": "7",
    "tx_size_cost_per_byte": "10",
    "sig_verify_cost_ed25519": "590",
    "sig_verify_cost_secp256k1": "1000"
   },
   "accounts": []
  },
  "authz": {
   "authorization": []
  },
  "bank": {
   "params": {
    "send_enabled": [],
    "default_send_enabled": true
   },
   "balances": [],
   "supply": [],
   "denom_metadata": [],
   "send_enabled": []
  },
  "capability": {
   "index": "1",
   "owners": []
  },
  "circuit": {
   "account_permissions": [],
   "disabled_type_urls": []
  },
  "consensus": null,
  "crisis": {
   "constant_fee": {
    "denom": "stake",
    "amount": "1000"
   }
  },
  "distribution": {
   "params": {
    "community_tax": "0.020000000000000000",
    "base_proposer_reward": "0.000000000000000000",
    "bonus_proposer_reward": "0.000000000000000000",
    "withdraw_addr_enabled": true
   },
   "fee_pool": {
    "community_pool": []
   },
   "delegator_withdraw_infos": [],
   "previous_proposer": "",
   "outstanding_rewards": [],
   "validator_accumulated_commissions": [],
   "validator_historical_rewards": [],
   "validator_current_rewards": [],
   "delegator_starting_infos": [],
   "validator_slash_events": []
  },
  "evidence": {
   "evidence": []
  },
  "feegrant": {
   "allowances": []
  },
  "feeibc": {
   "identified_fees": [],
   "fee_enabled_channels": [],
   "registered_payees": [],
   "registered_counterparty_payees": [],
   "forward_relayers": []
  },
  "genutil": {
   "gen_txs": []
  },
  "gov": {
   "starting_proposal_id": "1",
   "deposits": [],
   "votes": [],
   "proposals": [],
   "deposit_params": null,
   "voting_params": null,
   "tally_params": null,
   "params": {
    "min_deposit": [
     {
      "denom": "stake",
      "amount": "10000000"
     }
    ],
    "max_deposit_period": "172800s",
    "voting_period": "172800s",
    "quorum": "0.334000000000000000",
    "threshold": "0.500000000000000000",
    "veto_threshold": "0.334000000000000000",
    "min_initial_deposit_ratio": "0.000000000000000000",
    "proposal_cancel_ratio": "0.500000000000000000",
    "proposal_cancel_dest": "",
    "expedited_voting_period": "86400s",
    "expedited_threshold": "0.667000000000000000",
    "expedited_min_deposit": [
     {
      "denom": "stake",
      "amount": "50000000"
     }
    ],
    "burn_vote_quorum": false,
    "burn_proposal_deposit_prevote": false,
    "burn_vote_veto": true,
    "min_deposit_ratio": "0.010000000000000000"
   },
   "constitution": ""
  },
  "group": {
   "group_seq": "0",
   "groups": [],
   "group_members": [],
   "group_policy_seq": "0",
   "group_policies": [],
   "proposal_seq": "0",
   "proposals": [],
   "votes": []
  },
  "ibc": {
   "client_genesis": {
    "clients": [],
    "clients_consensus": [],
    "clients_metadata": [],
    "params": {
     "allowed_clients": [
      "*"
     ]
    },
    "create_localhost": false,
    "next_client_sequence": "0"
   },
   "connection_genesis": {
    "connections": [],
    "client_connection_paths": [],
    "next_connection_sequence": "0",
    "params": {
     "max_expected_time_per_block": "30000000000"
    }
   },
   "channel_genesis": {
    "channels": [],
    "acknowledgements": [],
    "commitments": [],
    "receipts": [],
    "send_sequences": [],
    "recv_sequences": [],
    "ack_sequences": [],
    "next_channel_sequence": "0",
    "params": {
     "upgrade_timeout": {
      "height": {
       "revision_number": "0",
       "revision_height": "0"
      },
      "timestamp": "600000000000"
     }
    }
   }
  },
  "interchainaccounts": {
   "controller_genesis_state": {
    "active_channels": [],
    "interchain_accounts": [],
    "ports": [],
    "params": {
     "controller_enabled": true
    }
   },
   "host_genesis_state": {
    "active_channels": [],
    "interchain_accounts": [],
    "port": "icahost",
    "params": {
     "host_enabled": true,
     "allow_messages": [
      "*"
     ]
    }
   }
  },
  "mint": {
   "minter": {
    "inflation": "0.130000000000000000",
    "annual_provisions": "0.000000000000000000"
   },
   "params": {
    "mint_denom": "stake",
    "inflation_rate_change": "0.130000000000000000",
    "inflation_max": "0.200000000000000000",
    "inflation_min": "0.070000000000000000",
    "goal_bonded": "0.670000000000000000",
    "blocks_per_year": "6311520"
   }
  },
  "nft": {
   "classes": [],
   "entries": []
  },
  "optimum": {
   "params": {}
  },
  "params": null,
  "runtime": null,
  "slashing": {
   "params": {
    "signed_blocks_window": "100",
    "min_signed_per_window": "0.500000000000000000",
    "downtime_jail_duration": "600s",
    "slash_fraction_double_sign": "0.050000000000000000",
    "slash_fraction_downtime": "0.010000000000000000"
   },
   "signing_infos": [],
   "missed_blocks": []
  },
  "staking": {
   "params": {
    "unbonding_time": "1814400s",
    "max_validators": 100,
    "max_entries": 7,
    "historical_entries": 10000,
    "bond_denom": "stake",
    "min_commission_rate": "0.000000000000000000"
   },
   "last_total_power": "0",
   "last_validator_powers": [],
   "validators": [],
   "delegations": [],
   "unbonding_delegations": [],
   "redelegations": [],
   "exported": false
  },
  "transfer": {
   "port_id": "transfer",
   "denom_traces": [],
   "params": {
    "send_enabled": true,
    "receive_enabled": true
   },
   "total_escrowed": []
  },
  "upgrade": {},
  "vesting": {}
 }
}
```

We now want to create keys for each node

Create a validator account on `flexnode-1`

```
root@optimumnode-1:~/optimum# optimumchaind keys add validator1
Enter keyring passphrase (attempt 1/3):
Re-enter keyring passphrase:

- address: cosmos10ju7r4vcsgtc6tprra3s2qekj543a7r8ry64wm
  name: validator1
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A9QDza7SGdVh+phuhW36qnn4Bkli1W5g4954I+uuNDdO"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

wife have better valid win submit duty rather destroy tuna sphere movie stock govern skin rival idle day alter all mixture sketch brown just

```

Next, we'll add the account to the genesis directly:

1. First, add the account with the total amount of tokens:

   ```
   optimumchaind genesis add-genesis-account validator1 100000000stake
   ```

2. Then, manually bond a portion of these tokens to your validator. For example, to bond 90% of the tokens:

   ```
   optimumchaind genesis gentx validator1 90000000stake --chain-id optimum
   ```

   This command creates a genesis transaction that bonds the specified amount of tokens to your validator.

   Response:

   ```
   Genesis transaction written to "/root/.optimum/config/gentx/gentx-ba9852a3224d256734efc4a1859b40e3499db3d9.json"
   ```

3. Finally, collect the genesis transactions:

   ```
   optimumchaind genesis collect-gentxs
   ```

   Response:

   ```
   {
    "moniker": "flexnode-1",
    "chain_id": "optimum",
    "node_id": "ba9852a3224d256734efc4a1859b40e3499db3d9",
    "gentxs_dir": "/root/.optimum/config/gentx",
    "app_message": {
     "06-solomachine": null,
     "07-tendermint": null,
     "auth": {
      "params": {
       "max_memo_characters": "256",
       "tx_sig_limit": "7",
       "tx_size_cost_per_byte": "10",
       "sig_verify_cost_ed25519": "590",
       "sig_verify_cost_secp256k1": "1000"
      },
      "accounts": [
       {
        "@type": "/cosmos.auth.v1beta1.BaseAccount",
        "address": "cosmos10ju7r4vcsgtc6tprra3s2qekj543a7r8ry64wm",
        "pub_key": null,
        "account_number": "0",
        "sequence": "0"
       }
      ]
     },
     "authz": {
      "authorization": []
     },
     "bank": {
      "params": {
       "send_enabled": [],
       "default_send_enabled": true
      },
      "balances": [
       {
        "address": "cosmos10ju7r4vcsgtc6tprra3s2qekj543a7r8ry64wm",
        "coins": [
         {
          "denom": "stake",
          "amount": "100000000"
         }
        ]
       }
      ],
      "supply": [
       {
        "denom": "stake",
        "amount": "100000000"
       }
      ],
      "denom_metadata": [],
      "send_enabled": []
     },
     "capability": {
      "index": "1",
      "owners": []
     },
     "circuit": {
      "account_permissions": [],
      "disabled_type_urls": []
     },
     "consensus": null,
     "crisis": {
      "constant_fee": {
       "denom": "stake",
       "amount": "1000"
      }
     },
     "distribution": {
      "params": {
       "community_tax": "0.020000000000000000",
       "base_proposer_reward": "0.000000000000000000",
       "bonus_proposer_reward": "0.000000000000000000",
       "withdraw_addr_enabled": true
      },
      "fee_pool": {
       "community_pool": []
      },
      "delegator_withdraw_infos": [],
      "previous_proposer": "",
      "outstanding_rewards": [],
      "validator_accumulated_commissions": [],
      "validator_historical_rewards": [],
      "validator_current_rewards": [],
      "delegator_starting_infos": [],
      "validator_slash_events": []
     },
     "evidence": {
      "evidence": []
     },
     "feegrant": {
      "allowances": []
     },
     "feeibc": {
      "identified_fees": [],
      "fee_enabled_channels": [],
      "registered_payees": [],
      "registered_counterparty_payees": [],
      "forward_relayers": []
     },
     "genutil": {
      "gen_txs": [
       {
        "body": {
         "messages": [
          {
           "@type": "/cosmos.staking.v1beta1.MsgCreateValidator",
           "description": {
            "moniker": "flexnode-1",
            "identity": "",
            "website": "",
            "security_contact": "",
            "details": ""
           },
           "commission": {
            "rate": "0.100000000000000000",
            "max_rate": "0.200000000000000000",
            "max_change_rate": "0.010000000000000000"
           },
           "min_self_delegation": "1",
           "delegator_address": "",
           "validator_address": "cosmosvaloper10ju7r4vcsgtc6tprra3s2qekj543a7r8xswqzg",
           "pubkey": {
            "@type": "/cosmos.crypto.ed25519.PubKey",
            "key": "GxGYRZdKKVKuPVnNZsLxrIspZgIFoL34ZnHwwAPnV5o="
           },
           "value": {
            "denom": "stake",
            "amount": "100000000"
           }
          }
         ],
         "memo": "ba9852a3224d256734efc4a1859b40e3499db3d9@23.92.22.96:26656",
         "timeout_height": "0",
         "extension_options": [],
         "non_critical_extension_options": []
        },
        "auth_info": {
         "signer_infos": [
          {
           "public_key": {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            "key": "A9QDza7SGdVh+phuhW36qnn4Bkli1W5g4954I+uuNDdO"
           },
           "mode_info": {
            "single": {
             "mode": "SIGN_MODE_DIRECT"
            }
           },
           "sequence": "0"
          }
         ],
         "fee": {
          "amount": [],
          "gas_limit": "200000",
          "payer": "",
          "granter": ""
         },
         "tip": null
        },
        "signatures": [
         "7Cll2bRi9C3gXwJS0dUcinmVVZXGwm1N/9D1eTMl2vVmx9us/nw0eRF7xQT3xWW+26EL7zq4J1meyRTuZ/vSkA=="
        ]
       }
      ]
     },
     "gov": {
      "starting_proposal_id": "1",
      "deposits": [],
      "votes": [],
      "proposals": [],
      "deposit_params": null,
      "voting_params": null,
      "tally_params": null,
      "params": {
       "min_deposit": [
        {
         "denom": "stake",
         "amount": "10000000"
        }
       ],
       "max_deposit_period": "172800s",
       "voting_period": "172800s",
       "quorum": "0.334000000000000000",
       "threshold": "0.500000000000000000",
       "veto_threshold": "0.334000000000000000",
       "min_initial_deposit_ratio": "0.000000000000000000",
       "proposal_cancel_ratio": "0.500000000000000000",
       "proposal_cancel_dest": "",
       "expedited_voting_period": "86400s",
       "expedited_threshold": "0.667000000000000000",
       "expedited_min_deposit": [
        {
         "denom": "stake",
         "amount": "50000000"
        }
       ],
       "burn_vote_quorum": false,
       "burn_proposal_deposit_prevote": false,
       "burn_vote_veto": true,
       "min_deposit_ratio": "0.010000000000000000"
      },
      "constitution": ""
     },
     "group": {
      "group_seq": "0",
      "groups": [],
      "group_members": [],
      "group_policy_seq": "0",
      "group_policies": [],
      "proposal_seq": "0",
      "proposals": [],
      "votes": []
     },
     "ibc": {
      "client_genesis": {
       "clients": [],
       "clients_consensus": [],
       "clients_metadata": [],
       "params": {
        "allowed_clients": [
         "*"
        ]
       },
       "create_localhost": false,
       "next_client_sequence": "0"
      },
      "connection_genesis": {
       "connections": [],
       "client_connection_paths": [],
       "next_connection_sequence": "0",
       "params": {
        "max_expected_time_per_block": "30000000000"
       }
      },
      "channel_genesis": {
       "channels": [],
       "acknowledgements": [],
       "commitments": [],
       "receipts": [],
       "send_sequences": [],
       "recv_sequences": [],
       "ack_sequences": [],
       "next_channel_sequence": "0",
       "params": {
        "upgrade_timeout": {
         "height": {
          "revision_number": "0",
          "revision_height": "0"
         },
         "timestamp": "600000000000"
        }
       }
      }
     },
     "interchainaccounts": {
      "controller_genesis_state": {
       "active_channels": [],
       "interchain_accounts": [],
       "ports": [],
       "params": {
        "controller_enabled": true
       }
      },
      "host_genesis_state": {
       "active_channels": [],
       "interchain_accounts": [],
       "port": "icahost",
       "params": {
        "host_enabled": true,
        "allow_messages": [
         "*"
        ]
       }
      }
     },
     "mint": {
      "minter": {
       "inflation": "0.130000000000000000",
       "annual_provisions": "0.000000000000000000"
      },
      "params": {
       "mint_denom": "stake",
       "inflation_rate_change": "0.130000000000000000",
       "inflation_max": "0.200000000000000000",
       "inflation_min": "0.070000000000000000",
       "goal_bonded": "0.670000000000000000",
       "blocks_per_year": "6311520"
      }
     },
     "nft": {
      "classes": [],
      "entries": []
     },
     "optimum": {
      "params": {}
     },
     "params": null,
     "runtime": null,
     "slashing": {
      "params": {
       "signed_blocks_window": "100",
       "min_signed_per_window": "0.500000000000000000",
       "downtime_jail_duration": "600s",
       "slash_fraction_double_sign": "0.050000000000000000",
       "slash_fraction_downtime": "0.010000000000000000"
      },
      "signing_infos": [],
      "missed_blocks": []
     },
     "staking": {
      "params": {
       "unbonding_time": "1814400s",
       "max_validators": 100,
       "max_entries": 7,
       "historical_entries": 10000,
       "bond_denom": "stake",
       "min_commission_rate": "0.000000000000000000"
      },
      "last_total_power": "0",
      "last_validator_powers": [],
      "validators": [],
      "delegations": [],
      "unbonding_delegations": [],
      "redelegations": [],
      "exported": false
     },
     "transfer": {
      "port_id": "transfer",
      "denom_traces": [],
      "params": {
       "send_enabled": true,
       "receive_enabled": true
      },
      "total_escrowed": []
     },
     "upgrade": {},
     "vesting": {}
    }
   ```

This process ensures that:

- Your validator account has 100,000,000 stake tokens in total.
- 90,000,000 stake tokens are bonded to your validator.
- 10,000,000 stake tokens remain liquid in your account for transactions.

Verify the genesis file

```
optimumchaind genesis validate
```

Response:

```
File at /root/.optimum/config/genesis.json is a valid genesis file
```

Now, we need to start the chain and set a minimum gas price 

```
optimumchaind start --minimum-gas-prices 0.00001stake
```

We will do it using a background job:

```
nohup optimumchaind start --minimum-gas-prices 0.00001stake > optimumchaind.log 2>&1 &
```

### Flexnode 2

1. SSH into flexnode-2 and install the `optimumd` binary as you did on flexnode-1.

```
git clone git@github.com:optimumchainda/linode-optimum-devnet.git optimum
```

```
cd optimum
ignite chain build
```

1. Initialize the node (use a different moniker):

   ```
   optimumchaind init flexnode-2 --chain-id optimum
   ```

   Response:

   ```
   {
    "moniker": "flexnode-2",
    "chain_id": "optimum",
    "node_id": "7c6320b8af8bccb6b0eb55cf92066055cd5a6b14",
    "gentxs_dir": "",
    "app_message": {
     "06-solomachine": null,
     "07-tendermint": null,
     "auth": {
      "params": {
       "max_memo_characters": "256",
       "tx_sig_limit": "7",
       "tx_size_cost_per_byte": "10",
       "sig_verify_cost_ed25519": "590",
       "sig_verify_cost_secp256k1": "1000"
      },
      "accounts": []
     },
     "authz": {
      "authorization": []
     },
     "bank": {
      "params": {
       "send_enabled": [],
       "default_send_enabled": true
      },
      "balances": [],
      "supply": [],
      "denom_metadata": [],
      "send_enabled": []
     },
     "capability": {
      "index": "1",
      "owners": []
     },
     "circuit": {
      "account_permissions": [],
      "disabled_type_urls": []
     },
     "consensus": null,
     "crisis": {
      "constant_fee": {
       "denom": "stake",
       "amount": "1000"
      }
     },
     "distribution": {
      "params": {
       "community_tax": "0.020000000000000000",
       "base_proposer_reward": "0.000000000000000000",
       "bonus_proposer_reward": "0.000000000000000000",
       "withdraw_addr_enabled": true
      },
      "fee_pool": {
       "community_pool": []
      },
      "delegator_withdraw_infos": [],
      "previous_proposer": "",
      "outstanding_rewards": [],
      "validator_accumulated_commissions": [],
      "validator_historical_rewards": [],
      "validator_current_rewards": [],
      "delegator_starting_infos": [],
      "validator_slash_events": []
     },
     "evidence": {
      "evidence": []
     },
     "feegrant": {
      "allowances": []
     },
     "feeibc": {
      "identified_fees": [],
      "fee_enabled_channels": [],
      "registered_payees": [],
      "registered_counterparty_payees": [],
      "forward_relayers": []
     },
     "genutil": {
      "gen_txs": []
     },
     "gov": {
      "starting_proposal_id": "1",
      "deposits": [],
      "votes": [],
      "proposals": [],
      "deposit_params": null,
      "voting_params": null,
      "tally_params": null,
      "params": {
       "min_deposit": [
        {
         "denom": "stake",
         "amount": "10000000"
        }
       ],
       "max_deposit_period": "172800s",
       "voting_period": "172800s",
       "quorum": "0.334000000000000000",
       "threshold": "0.500000000000000000",
       "veto_threshold": "0.334000000000000000",
       "min_initial_deposit_ratio": "0.000000000000000000",
       "proposal_cancel_ratio": "0.500000000000000000",
       "proposal_cancel_dest": "",
       "expedited_voting_period": "86400s",
       "expedited_threshold": "0.667000000000000000",
       "expedited_min_deposit": [
        {
         "denom": "stake",
         "amount": "50000000"
        }
       ],
       "burn_vote_quorum": false,
       "burn_proposal_deposit_prevote": false,
       "burn_vote_veto": true,
       "min_deposit_ratio": "0.010000000000000000"
      },
      "constitution": ""
     },
     "group": {
      "group_seq": "0",
      "groups": [],
      "group_members": [],
      "group_policy_seq": "0",
      "group_policies": [],
      "proposal_seq": "0",
      "proposals": [],
      "votes": []
     },
     "ibc": {
      "client_genesis": {
       "clients": [],
       "clients_consensus": [],
       "clients_metadata": [],
       "params": {
        "allowed_clients": [
         "*"
        ]
       },
       "create_localhost": false,
       "next_client_sequence": "0"
      },
      "connection_genesis": {
       "connections": [],
       "client_connection_paths": [],
       "next_connection_sequence": "0",
       "params": {
        "max_expected_time_per_block": "30000000000"
       }
      },
      "channel_genesis": {
       "channels": [],
       "acknowledgements": [],
       "commitments": [],
       "receipts": [],
       "send_sequences": [],
       "recv_sequences": [],
       "ack_sequences": [],
       "next_channel_sequence": "0",
       "params": {
        "upgrade_timeout": {
         "height": {
          "revision_number": "0",
          "revision_height": "0"
         },
         "timestamp": "600000000000"
        }
       }
      }
     },
     "interchainaccounts": {
      "controller_genesis_state": {
       "active_channels": [],
       "interchain_accounts": [],
       "ports": [],
       "params": {
        "controller_enabled": true
       }
      },
      "host_genesis_state": {
       "active_channels": [],
       "interchain_accounts": [],
       "port": "icahost",
       "params": {
        "host_enabled": true,
        "allow_messages": [
         "*"
        ]
       }
      }
     },
     "mint": {
      "minter": {
       "inflation": "0.130000000000000000",
       "annual_provisions": "0.000000000000000000"
      },
      "params": {
       "mint_denom": "stake",
       "inflation_rate_change": "0.130000000000000000",
       "inflation_max": "0.200000000000000000",
       "inflation_min": "0.070000000000000000",
       "goal_bonded": "0.670000000000000000",
       "blocks_per_year": "6311520"
      }
     },
     "nft": {
      "classes": [],
      "entries": []
     },
     "optimum": {
      "params": {}
     },
     "params": null,
     "runtime": null,
     "slashing": {
      "params": {
       "signed_blocks_window": "100",
       "min_signed_per_window": "0.500000000000000000",
       "downtime_jail_duration": "600s",
       "slash_fraction_double_sign": "0.050000000000000000",
       "slash_fraction_downtime": "0.010000000000000000"
      },
      "signing_infos": [],
      "missed_blocks": []
     },
     "staking": {
      "params": {
       "unbonding_time": "1814400s",
       "max_validators": 100,
       "max_entries": 7,
       "historical_entries": 10000,
       "bond_denom": "stake",
       "min_commission_rate": "0.000000000000000000"
      },
      "last_total_power": "0",
      "last_validator_powers": [],
      "validators": [],
      "delegations": [],
      "unbonding_delegations": [],
      "redelegations": [],
      "exported": false
     },
     "transfer": {
      "port_id": "transfer",
      "denom_traces": [],
      "params": {
       "send_enabled": true,
       "receive_enabled": true
      },
      "total_escrowed": []
     },
     "upgrade": {},
     "vesting": {}
    }
   }
   ```

2. Copy the genesis file from flexnode-1 to flexnode-2:

   ```
   scp root@flexnode-1:/root/.optimum/config/genesis.json /root/.optimum/config/
   ```

3. Create a key for flexnode-2:

   ```
   optimumchaind keys add validator2
   ```

   Save the mnemonic phrase securely.

   ```
   Enter keyring passphrase (attempt 1/3):
   Re-enter keyring passphrase:
   
   - address: cosmos1ehd68nseclwwv0zd4vrpuxf6vu9d0cjsxeae0j
     name: validator2
     pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"AxKgA/w99JvY33AztHQmHBCQkVd8Q5lHyZJmjJJG2pMd"}'
     type: local
   
   
   **Important** write this mnemonic phrase in a safe place.
   It is the only way to recover your account if you ever forget your password.
   
   knife man intact unhappy mushroom vicious resource inmate obscure escape gravity reveal window like vivid caught side violin chief merry under lyrics apple winter
   ```

   

4. Configure persistent peers: On both nodes, edit the 

   ```
   config.toml
   ```

    file:

   ```
   nano /root/.optimum/config/config.toml
   ```

   Find the 

   ```
   persistent_peers
   ```

    line and add the other node's ID and IP:

   ```
   persistent_peers = "node_id_of_flexnode1@ip_of_flexnode1:26656"
   ```

   You can get a node's ID by running 

   ```
   optimumchaind tendermint show-node-id
   ```

    on that node.

5. Also update TCP or UNIX socket address for the RPC server to listen on

   `laddr = "tcp://0.0.0.0:26657"`

6. Start flexnode-2:

   ```
   nohup optimumchaind start --minimum-gas-prices 0.00001stake > optimumchaind.log 2>&1 &
   ```

Now that both nodes are set up, let's make a transaction:

1. First, check the balance of both accounts: On flexnode-1:

   ```
   optimumchaind query bank balances $(optimumchaind keys show validator1 -a)
   ```
   
   On flexnode-2:

   ```
optimumchaind query bank balances $(optimumchaind keys show validator2 -a)
   ```
   
2. Send tokens from flexnode-1 to flexnode-2: On flexnode-1, run:

   ```
   optimumchaind tx bank send $(optimumchaind keys show validator1 -a) $(optimumchaind keys show validator2 -a) 10000stake --chain-id optimum --gas-prices 0.00001stake
   ```
   
   ```
optimumchaind tx bank send cosmos10ju7r4vcsgtc6tprra3s2qekj543a7r8ry64wm cosmos1ehd68nseclwwv0zd4vrpuxf6vu9d0cjsxeae0j 10000stake --chain-id optimum --gas-prices 0.00001stake
   ```
   
   
   
   You'll be prompted to confirm the transaction. Type 'y' and press Enter.

### Other useful commands

Check the status of the chain:

```
optimumchaind status
```

Query balance (flexnode 1):

```
optimumchaind query bank balances cosmos10ju7r4vcsgtc6tprra3s2qekj543a7r8ry64wm
```

```
optimumchaind query bank total
```

or for flexnode 2:

```
optimumchaind query bank balances cosmos1ehd68nseclwwv0zd4vrpuxf6vu9d0cjsxeae0j
```

---

### Todos:

- Create `optimumd` service
  - `nohup optimumd start --minimum-gas-prices 0.00001stake > optimumd.log 2>&1 &`
