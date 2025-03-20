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
use generated::substreams::v1::program::Initialize;
use generated::substreams::v1::program::Renounce;
use generated::substreams::v1::program::Withdraw;
use generated::substreams::v1::program::WithdrawMax;

use substreams_solana::block_view::InstructionView;
use substreams_solana::pb::sf::solana::r#type::v1::Block;

const PROGRAM_ID: &str = constants::cluster::SABLIER_LOCKUP_LINEAR_V10[0];
/** TODO: edit this to allow for multiple contracts */

fn handle_cancel(index: usize, instruction: &InstructionView) -> Option<Cancel> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(_arguments) = idl::idl::program::client::args::Cancel::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();
        let token_mint = accounts[2].to_string();

        let refunded: u64 = instruction
            .inner_instructions()
            .filter(|i| i.program_id() == token_mint)
            .filter_map(|i| util::decode_spl_token_transfer(&i.data()))
            .sum();

        Some(Cancel {
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,
            transaction_hash: instruction.transaction().id(),

            refunded,
            sender: accounts[0].to_string(),
            stream: accounts[1].to_string(),
            token_mint: accounts[2].to_string(),
            sender_ata: accounts[3].to_string(),
            recipient_ata: accounts[4].to_string(),
            treasury_pda: accounts[5].to_string(),
            treasury_ata: accounts[6].to_string(),
            token_program: accounts[7].to_string(),
        })
    } else {
        None
    }
}

fn handle_create_with_timestamps(index: usize, instruction: &InstructionView) -> Option<CreateWithTimestamps> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = idl::idl::program::client::args::CreateWithTimestamps::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        Some(CreateWithTimestamps {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            start_time: arguments.start_time,
            cliff_time: arguments.cliff_time,
            end_time: arguments.end_time,
            deposited_amount: arguments.deposited_amount,
            cancelable: arguments.is_cancelable,
            sender: accounts[0].to_string(),
            token_mint: accounts[1].to_string(),
            sender_ata: accounts[2].to_string(),
            recipient: accounts[3].to_string(),
            recipient_ata: accounts[4].to_string(),
            treasury_pda: accounts[5].to_string(),
            treasury_ata: accounts[6].to_string(),
            stream: accounts[7].to_string(),
            token_program: accounts[9].to_string(),
        })
    } else {
        None
    }
}

fn handle_initialize(index: usize, instruction: &InstructionView) -> Option<Initialize> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(_arguments) = idl::idl::program::client::args::Initialize::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        Some(Initialize {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            signer: accounts[0].to_string(),
            treasury_pda: accounts[1].to_string(),
        })
    } else {
        None
    }
}

fn handle_renounce(index: usize, instruction: &InstructionView) -> Option<Renounce> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(_arguments) = idl::idl::program::client::args::Renounce::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        Some(Renounce {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            sender: accounts[0].to_string(),
            stream: accounts[1].to_string(),
            sender_ata: accounts[2].to_string(),
            recipient_ata: accounts[3].to_string(),
        })
    } else {
        None
    }
}

fn handle_withdraw(index: usize, instruction: &InstructionView) -> Option<Withdraw> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(arguments) = idl::idl::program::client::args::Withdraw::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();

        Some(Withdraw {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            amount: arguments.amount,
            signer: accounts[0].to_string(),
            stream: accounts[1].to_string(),
            token_mint: accounts[2].to_string(),
            sender_ata: accounts[3].to_string(),
            recipient_ata: accounts[4].to_string(),
            treasury_pda: accounts[5].to_string(),
            treasury_ata: accounts[6].to_string(),
            token_program: accounts[7].to_string(),
        })
    } else {
        None
    }
}

fn handle_withdraw_max(index: usize, instruction: &InstructionView) -> Option<WithdrawMax> {
    let slice_u8: &[u8] = &instruction.data()[..];

    if let Ok(_arguments) = idl::idl::program::client::args::WithdrawMax::deserialize(&mut &slice_u8[8..]) {
        let accounts = instruction.accounts();
        let token_mint = accounts[2].to_string();

        let amount: u64 = instruction
            .inner_instructions()
            .filter(|i| i.program_id() == token_mint)
            .filter_map(|i| util::decode_spl_token_transfer(&i.data()))
            .sum();

        Some(WithdrawMax {
            transaction_hash: instruction.transaction().id(),
            instruction_program: instruction.program_id().to_string(),
            instruction_index: index as u64,

            amount,
            signer: accounts[0].to_string(),
            stream: accounts[1].to_string(),
            token_mint: accounts[2].to_string(),
            sender_ata: accounts[3].to_string(),
            recipient_ata: accounts[4].to_string(),
            treasury_pda: accounts[5].to_string(),
            treasury_ata: accounts[6].to_string(),
            token_program: accounts[7].to_string(),
        })
    } else {
        None
    }
}

#[substreams::handlers::map]
fn map_program_data(blk: Block) -> Data {
    let mut cancel_list: Vec<Cancel> = Vec::new();
    let mut create_with_timestamps_list: Vec<CreateWithTimestamps> = Vec::new();
    let mut initialize_list: Vec<Initialize> = Vec::new();
    let mut renounce_list: Vec<Renounce> = Vec::new();
    let mut withdraw_list: Vec<Withdraw> = Vec::new();
    let mut withdraw_max_list: Vec<WithdrawMax> = Vec::new();
    let block_number = blk.block_height.as_ref().map_or(0, |h| h.block_height);
    let block_timestamp = blk.block_time.as_ref().map_or(0, |t| t.timestamp);

    blk.transactions().for_each(|transaction| {
        // ------------- INSTRUCTIONS -------------
        transaction
            .walk_instructions()
            .into_iter()
            .enumerate()
            .filter(|(_, instruction)| instruction.program_id().to_string() == PROGRAM_ID)
            .for_each(|(index, instruction)| {
                let slice_u8: &[u8] = &instruction.data()[..];
                if slice_u8[0..8] == idl::idl::program::client::args::Cancel::DISCRIMINATOR {
                    let entry = handle_cancel(index, &instruction);
                    if let Some(_) = entry {
                        cancel_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::CreateWithTimestamps::DISCRIMINATOR {
                    let entry: Option<CreateWithTimestamps> = handle_create_with_timestamps(index, &instruction);
                    if let Some(_) = entry {
                        create_with_timestamps_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::Initialize::DISCRIMINATOR {
                    let entry: Option<Initialize> = handle_initialize(index, &instruction);
                    if let Some(_) = entry {
                        initialize_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::Renounce::DISCRIMINATOR {
                    let entry: Option<Renounce> = handle_renounce(index, &instruction);
                    if let Some(_) = entry {
                        renounce_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::Withdraw::DISCRIMINATOR {
                    let entry: Option<Withdraw> = handle_withdraw(index, &instruction);
                    if let Some(_) = entry {
                        withdraw_list.push(entry.unwrap());
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::WithdrawMax::DISCRIMINATOR {
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
        initialize_list,
        renounce_list,
        withdraw_list,
        withdraw_max_list,
        block_number,
        block_timestamp,
    }
}
