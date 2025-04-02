#[path = "./generated/constants.rs"]
mod constants;
mod generated;
mod idl;
mod util;

use anchor_lang::AnchorDeserialize;
use anchor_lang::Discriminator;
use generated::substreams::v1::program::Cancel;
use generated::substreams::v1::program::CreateWithTimestamps;
use generated::substreams::v1::program::Data;
use generated::substreams::v1::program::Renounce;
use generated::substreams::v1::program::Transfer;
use generated::substreams::v1::program::Withdraw;
use generated::substreams::v1::program::WithdrawMax;

use substreams_solana::block_view::InstructionView;
use substreams_solana::pb::sf::solana::r#type::v1::Block;
use util::get_anchor_logs;

const PROGRAM_ID: &str = constants::cluster::SABLIER_LOCKUP_LINEAR_V10[0];
/** TODO: edit this to allow for multiple contracts */

fn handle_cancel(index: usize, instruction: &InstructionView) -> Option<Cancel> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = idl::idl::lockup_linear_v10::client::args::Cancel::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        let logs = get_anchor_logs(instruction);
        let mut refunded = 0;

        for log in logs {
            if log[0..8] == idl::idl::lockup_linear_v10::events::StreamCancelation::DISCRIMINATOR {
                if let Ok(event) = idl::idl::lockup_linear_v10::events::StreamCancelation::deserialize(&mut &log[8..]) {
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

    if let Ok(arguments) =
        idl::idl::lockup_linear_v10::client::args::CreateWithTimestamps::deserialize(&mut &slice_u8[8..])
    {
        let accounts = instruction.accounts();
        let logs = get_anchor_logs(instruction);

        let mut stream_id = 0;

        for log in logs {
            if log[0..8] == idl::idl::lockup_linear_v10::events::StreamCreation::DISCRIMINATOR {
                if let Ok(event) = idl::idl::lockup_linear_v10::events::StreamCreation::deserialize(&mut &log[8..]) {
                    stream_id = event.stream_id;
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

            sender: accounts[0].to_string(),
            token_mint: accounts[1].to_string(),
            sender_ata: accounts[2].to_string(),
            recipient: accounts[3].to_string(),
            treasury: accounts[4].to_string(),
            treasury_ata: accounts[5].to_string(),

            nft_mint: accounts[10].to_string(),
            nft_data: accounts[11].to_string(),
            token_program: accounts[16].to_string(),
        })
    } else {
        None
    }
}

fn handle_renounce(index: usize, instruction: &InstructionView) -> Option<Renounce> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = idl::idl::lockup_linear_v10::client::args::Renounce::deserialize(&mut &slice_u8[8..]) {
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

fn handle_withdraw(index: usize, instruction: &InstructionView) -> Option<Withdraw> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = idl::idl::lockup_linear_v10::client::args::Withdraw::deserialize(&mut &slice_u8[8..]) {
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

    if let Ok(arguments) = idl::idl::lockup_linear_v10::client::args::WithdrawMax::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();
        let logs = get_anchor_logs(instruction);

        let mut amount = 0;

        for log in logs {
            if log[0..8] == idl::idl::lockup_linear_v10::events::StreamWithdrawal::DISCRIMINATOR {
                if let Ok(event) = idl::idl::lockup_linear_v10::events::StreamWithdrawal::deserialize(&mut &log[8..]) {
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
    let mut cancel_list: Vec<Cancel> = Vec::new();
    let mut create_with_timestamps_list: Vec<CreateWithTimestamps> = Vec::new();
    // TODO: implement transfers when we can have some transactions to test against
    // ix.program_id == SPL_TOKEN_PROGRAM_ID && ix.data.starts_with(&[3]) // 3 = Transfer
    let transfer_list: Vec<Transfer> = Vec::new();
    let mut renounce_list: Vec<Renounce> = Vec::new();
    let mut withdraw_list: Vec<Withdraw> = Vec::new();
    let mut withdraw_max_list: Vec<WithdrawMax> = Vec::new();
    let block_number = block.block_height.as_ref().map_or(0, |h| h.block_height);
    let block_timestamp = block.block_time.as_ref().map_or(0, |t| t.timestamp);

    block.transactions().for_each(|transaction| {
        // ------------- INSTRUCTIONS -------------
        transaction
            .walk_instructions()
            .into_iter()
            .enumerate()
            .filter(|(_, instruction)| instruction.program_id().to_string() == PROGRAM_ID)
            .for_each(|(index, instruction)| {
                let slice_u8: &[u8] = &instruction.data()[..];
                if slice_u8[0..8] == idl::idl::lockup_linear_v10::client::args::Cancel::DISCRIMINATOR {
                    let entry = handle_cancel(index, &instruction);
                    if let Some(_) = entry {
                        cancel_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::lockup_linear_v10::client::args::CreateWithTimestamps::DISCRIMINATOR {
                    let entry: Option<CreateWithTimestamps> = handle_create_with_timestamps(index, &instruction);
                    if let Some(_) = entry {
                        create_with_timestamps_list.push(entry.unwrap());
                    }
                }

                if slice_u8[0..8] == idl::idl::lockup_linear_v10::client::args::Renounce::DISCRIMINATOR {
                    let entry: Option<Renounce> = handle_renounce(index, &instruction);
                    if let Some(_) = entry {
                        renounce_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::lockup_linear_v10::client::args::Withdraw::DISCRIMINATOR {
                    let entry: Option<Withdraw> = handle_withdraw(index, &instruction);
                    if let Some(_) = entry {
                        withdraw_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::lockup_linear_v10::client::args::WithdrawMax::DISCRIMINATOR {
                    let entry: Option<WithdrawMax> = handle_withdraw_max(index, &instruction);
                    if let Some(_) = entry {
                        withdraw_max_list.push(entry.unwrap());
                    }
                }
            });
    });

    Data {
        cancel_list,
        create_with_timestamps_list,
        transfer_list,
        renounce_list,
        withdraw_list,
        withdraw_max_list,
        block_number,
        block_timestamp,
    }
}
