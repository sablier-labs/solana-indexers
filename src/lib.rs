#[path = "./generated/constants.rs"]
mod constants;
mod generated;
mod idl;
mod util;

use anchor_lang::AnchorDeserialize;
use anchor_lang::Discriminator;
use substreams_solana::block_view::InstructionView;
use substreams_solana::pb::sf::solana::r#type::v1::Block;

use generated::substreams::v1::program::{
    Cancel, CreateWithTimestamps, Data, Renounce, Transfer, Withdraw, WithdrawMax,
};
use idl::idl::lockup_linear_v10::{client::args as lockup_linear_v10_methods, events as lockup_linear_v10_events};

fn handle_cancel(index: usize, instruction: &InstructionView) -> Option<Cancel> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = lockup_linear_v10_methods::Cancel::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        let logs = util::get_anchor_logs(instruction);
        let mut refunded = 0;

        for log in logs {
            if log[0..8] == lockup_linear_v10_events::StreamCancelation::DISCRIMINATOR {
                if let Ok(event) = lockup_linear_v10_events::StreamCancelation::deserialize(&mut &log[8..]) {
                    refunded = event.refunded_amount;
                }
            }
        }

        Some(Cancel {
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,
            transaction_hash: instruction.transaction().id(),

            refunded,
            stream_id: arguments._stream_id,

            sender: accounts[0].to_string(),
            token_mint: accounts[1].to_string(),
            nft_mint: accounts[2].to_string(),
            nft_data: accounts[3].to_string(),
            sender_ata: accounts[4].to_string(),
            treasury: accounts[5].to_string(),
            treasury_ata: accounts[6].to_string(),
            token_program: accounts[7].to_string(),
        })
    } else {
        None
    }
}

fn handle_create_with_timestamps(index: usize, instruction: &InstructionView) -> Option<CreateWithTimestamps> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = lockup_linear_v10_methods::CreateWithTimestamps::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();
        let logs = util::get_anchor_logs(instruction);

        let mut stream_id = 0;
        let mut token_decimals = 0;

        for log in logs {
            if log[0..8] == lockup_linear_v10_events::StreamCreation::DISCRIMINATOR {
                if let Ok(event) = lockup_linear_v10_events::StreamCreation::deserialize(&mut &log[8..]) {
                    stream_id = event.stream_id;
                    token_decimals = event.asset_decimals;
                }
            }
        }

        Some(CreateWithTimestamps {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            start_time: arguments.start_time,
            cliff_time: arguments.cliff_time,
            end_time: arguments.end_time,
            deposited_amount: arguments.deposited_amount,
            initial_amount: arguments.start_unlock,
            cliff_amount: arguments.cliff_unlock,
            cancelable: arguments.is_cancelable,

            stream_id,
            token_decimals: token_decimals as u32,

            sender: accounts[0].to_string(),
            token_mint: accounts[1].to_string(),
            sender_ata: accounts[2].to_string(),
            recipient: accounts[3].to_string(),
            treasury: accounts[4].to_string(),
            treasury_ata: accounts[5].to_string(),

            nft_mint: accounts[10].to_string(),
            nft_data: accounts[11].to_string(),
            nft_recipient_ata: accounts[12].to_string(),
            token_program: accounts[16].to_string(),
        })
    } else {
        None
    }
}

fn handle_renounce(index: usize, instruction: &InstructionView) -> Option<Renounce> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = lockup_linear_v10_methods::Renounce::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        Some(Renounce {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            stream_id: arguments._stream_id,

            sender: accounts[0].to_string(),
            nft_mint: accounts[1].to_string(),
            nft_data: accounts[2].to_string(),
        })
    } else {
        None
    }
}

fn handle_spl_transfers(index: usize, instruction: &InstructionView) -> Vec<Transfer> {
    let mut transfers: Vec<Transfer> = Vec::new();

    let inner_instructions = instruction.inner_instructions();
    let root = util::get_transfer(instruction);

    if let Some((from, to, from_owner, to_owner, nft_mint, amount)) = root {
        transfers.push(Transfer {
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,
            transaction_hash: instruction.transaction().id(),
            from,
            to,
            from_owner,
            to_owner,
            nft_mint,
            amount,
        });
    }

    inner_instructions.enumerate().for_each(|(index, inner_instruction)| {
        let inner = util::get_transfer(&inner_instruction);

        if let Some((from, to, from_owner, to_owner, nft_mint, amount)) = inner {
            transfers.push(Transfer {
                instruction_program: inner_instruction.program_id().to_string(),
                instruction_index: index as u64,
                transaction_hash: inner_instruction.transaction().id(),
                from,
                to,
                from_owner,
                to_owner,
                nft_mint,
                amount,
            });
        }
    });

    transfers
}

fn handle_withdraw(index: usize, instruction: &InstructionView) -> Option<Withdraw> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = lockup_linear_v10_methods::Withdraw::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        Some(Withdraw {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            amount: arguments.amount,
            stream_id: arguments._stream_id,

            signer: accounts[0].to_string(),
            token_mint: accounts[1].to_string(),
            recipient: accounts[2].to_string(),
            recipient_ata: accounts[6].to_string(),

            treasury: accounts[7].to_string(),
            treasury_ata: accounts[8].to_string(),
            token_program: accounts[10].to_string(),

            nft_mint: accounts[3].to_string(),
            nft_data: accounts[4].to_string(),
        })
    } else {
        None
    }
}

fn handle_withdraw_max(index: usize, instruction: &InstructionView) -> Option<WithdrawMax> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = lockup_linear_v10_methods::WithdrawMax::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();
        let logs = util::get_anchor_logs(instruction);

        let mut amount = 0;

        for log in logs {
            if log[0..8] == lockup_linear_v10_events::StreamWithdrawal::DISCRIMINATOR {
                if let Ok(event) = lockup_linear_v10_events::StreamWithdrawal::deserialize(&mut &log[8..]) {
                    amount = event.withdrawn_amount;
                }
            }
        }

        Some(WithdrawMax {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            amount,
            stream_id: arguments._stream_id,

            signer: accounts[0].to_string(),
            token_mint: accounts[1].to_string(),
            recipient: accounts[2].to_string(),
            recipient_ata: accounts[6].to_string(),

            treasury: accounts[7].to_string(),
            treasury_ata: accounts[8].to_string(),
            token_program: accounts[10].to_string(),

            nft_mint: accounts[3].to_string(),
            nft_data: accounts[4].to_string(),
        })
    } else {
        None
    }
}

#[substreams::handlers::map]
fn map_program_data(block: Block) -> Data {
    let watched_programs: Vec<&str> = constants::cluster::SABLIER_LOCKUP_LINEAR_V10
        .iter()
        .copied()
        .chain(util::SPL_PROGRAMS.iter().copied())
        .collect();

    let mut cancel_list: Vec<Cancel> = Vec::new();
    let mut create_with_timestamps_list: Vec<CreateWithTimestamps> = Vec::new();
    let mut renounce_list: Vec<Renounce> = Vec::new();
    let mut withdraw_list: Vec<Withdraw> = Vec::new();
    let mut withdraw_max_list: Vec<WithdrawMax> = Vec::new();

    let mut spl_transfer_list: Vec<Transfer> = Vec::new();

    let block_number = block.block_height.as_ref().map_or(0, |h| h.block_height);
    let block_timestamp = block.block_time.as_ref().map_or(0, |t| t.timestamp);

    block.transactions().for_each(|transaction| {
        // ------------- TRANSACTIONS -------------
        transaction
            .walk_instructions()
            .into_iter()
            .enumerate()
            .filter(|(_, instruction)| watched_programs.contains(&instruction.program_id().to_string().as_str()))
            .for_each(|(index, instruction)| {
                // ------------- INSTRUCTIONS -------------

                if constants::cluster::SABLIER_LOCKUP_LINEAR_V10
                    .contains(&instruction.program_id().to_string().as_str())
                {
                    let slice_u8: &[u8] = &instruction.data()[..];
                    if slice_u8[0..8] == lockup_linear_v10_methods::Cancel::DISCRIMINATOR {
                        let entry = handle_cancel(index, &instruction);
                        if let Some(_) = entry {
                            cancel_list.push(entry.unwrap());
                        }
                    } else if slice_u8[0..8] == lockup_linear_v10_methods::CreateWithTimestamps::DISCRIMINATOR {
                        let entry: Option<CreateWithTimestamps> = handle_create_with_timestamps(index, &instruction);
                        if let Some(_) = entry {
                            create_with_timestamps_list.push(entry.unwrap());
                        }
                    } else if slice_u8[0..8] == lockup_linear_v10_methods::Renounce::DISCRIMINATOR {
                        let entry: Option<Renounce> = handle_renounce(index, &instruction);
                        if let Some(_) = entry {
                            renounce_list.push(entry.unwrap());
                        }
                    } else if slice_u8[0..8] == lockup_linear_v10_methods::Withdraw::DISCRIMINATOR {
                        let entry: Option<Withdraw> = handle_withdraw(index, &instruction);
                        if let Some(_) = entry {
                            withdraw_list.push(entry.unwrap());
                        }
                    } else if slice_u8[0..8] == lockup_linear_v10_methods::WithdrawMax::DISCRIMINATOR {
                        let entry: Option<WithdrawMax> = handle_withdraw_max(index, &instruction);
                        if let Some(_) = entry {
                            withdraw_max_list.push(entry.unwrap());
                        }
                    }
                }

                if util::SPL_TOKEN_PROGRAM_ID == instruction.program_id().to_string().as_str() {
                    let list: Vec<Transfer> = handle_spl_transfers(index, &instruction);

                    list.iter().for_each(|entry| {
                        spl_transfer_list.push(entry.clone());
                    });
                }
            });
    });

    Data {
        cancel_list,
        create_with_timestamps_list,
        spl_transfer_list,
        renounce_list,
        withdraw_list,
        withdraw_max_list,
        block_number,
        block_timestamp,
    }
}
