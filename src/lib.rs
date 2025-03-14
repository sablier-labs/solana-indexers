mod idl;
mod pb;

use anchor_lang::AnchorDeserialize;
use anchor_lang::Discriminator;
use pb::substreams::v1::program::Cancel;
use pb::substreams::v1::program::CreateWithTimestamps;
use pb::substreams::v1::program::Data;
use pb::substreams::v1::program::Initialize;
use pb::substreams::v1::program::Renounce;
use pb::substreams::v1::program::Withdraw;
use pb::substreams::v1::program::WithdrawMax;

use substreams_solana::pb::sf::solana::r#type::v1::Block;

const PROGRAM_ID: &str = "6DndfMHWPQ1Jg86ong4wi8MvoVvfsgDmTFW4dm9Znr4D";

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
            .filter(|inst| inst.program_id().to_string() == PROGRAM_ID)
            .for_each(|inst| {
                let slice_u8: &[u8] = &inst.data()[..];
                if slice_u8[0..8] == idl::idl::program::client::args::Cancel::DISCRIMINATOR {
                    if let Ok(_instruction) = idl::idl::program::client::args::Cancel::deserialize(&mut &slice_u8[8..]) {
                        let accts = inst.accounts();
                        cancel_list.push(Cancel {
                            trx_hash: transaction.id(),
                            acct_sender: accts[0].to_string(),
                            acct_stream: accts[1].to_string(),
                            acct_mint: accts[2].to_string(),
                            acct_sender_ata: accts[3].to_string(),
                            acct_recipient_ata: accts[4].to_string(),
                            acct_treasury_pda: accts[5].to_string(),
                            acct_treasury_ata: accts[6].to_string(),
                            acct_token_program: accts[7].to_string(),
                        });
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::CreateWithTimestamps::DISCRIMINATOR {
                    if let Ok(instruction) =
                        idl::idl::program::client::args::CreateWithTimestamps::deserialize(&mut &slice_u8[8..])
                    {
                        let accts = inst.accounts();
                        create_with_timestamps_list.push(CreateWithTimestamps {
                            trx_hash: transaction.id(),
                            start_time: instruction.start_time,
                            cliff_time: instruction.cliff_time,
                            end_time: instruction.end_time,
                            deposited_amount: instruction.deposited_amount,
                            is_cancelable: instruction.is_cancelable,
                            acct_sender: accts[0].to_string(),
                            acct_mint: accts[1].to_string(),
                            acct_sender_ata: accts[2].to_string(),
                            acct_recipient: accts[3].to_string(),
                            acct_recipient_ata: accts[4].to_string(),
                            acct_treasury_pda: accts[5].to_string(),
                            acct_treasury_ata: accts[6].to_string(),
                            acct_stream: accts[7].to_string(),
                            acct_token_program: accts[9].to_string(),
                        });
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::Initialize::DISCRIMINATOR {
                    if let Ok(_instruction) =
                        idl::idl::program::client::args::Initialize::deserialize(&mut &slice_u8[8..])
                    {
                        let accts = inst.accounts();
                        initialize_list.push(Initialize {
                            trx_hash: transaction.id(),
                            acct_signer: accts[0].to_string(),
                            acct_treasury_pda: accts[1].to_string(),
                        });
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::Renounce::DISCRIMINATOR {
                    if let Ok(_instruction) = idl::idl::program::client::args::Renounce::deserialize(&mut &slice_u8[8..])
                    {
                        let accts = inst.accounts();
                        renounce_list.push(Renounce {
                            trx_hash: transaction.id(),
                            acct_sender: accts[0].to_string(),
                            acct_stream: accts[1].to_string(),
                            acct_sender_ata: accts[2].to_string(),
                            acct_recipient_ata: accts[3].to_string(),
                        });
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::Withdraw::DISCRIMINATOR {
                    if let Ok(instruction) = idl::idl::program::client::args::Withdraw::deserialize(&mut &slice_u8[8..])
                    {
                        let accts = inst.accounts();
                        withdraw_list.push(Withdraw {
                            trx_hash: transaction.id(),
                            amount: instruction.amount,
                            acct_signer: accts[0].to_string(),
                            acct_stream: accts[1].to_string(),
                            acct_mint: accts[2].to_string(),
                            acct_sender_ata: accts[3].to_string(),
                            acct_recipient_ata: accts[4].to_string(),
                            acct_treasury_pda: accts[5].to_string(),
                            acct_treasury_ata: accts[6].to_string(),
                            acct_token_program: accts[7].to_string(),
                        });
                    }
                }
                if slice_u8[0..8] == idl::idl::program::client::args::WithdrawMax::DISCRIMINATOR {
                    if let Ok(_instruction) =
                        idl::idl::program::client::args::WithdrawMax::deserialize(&mut &slice_u8[8..])
                    {
                        let accts = inst.accounts();
                        withdraw_max_list.push(WithdrawMax {
                            trx_hash: transaction.id(),
                            acct_signer: accts[0].to_string(),
                            acct_stream: accts[1].to_string(),
                            acct_mint: accts[2].to_string(),
                            acct_sender_ata: accts[3].to_string(),
                            acct_recipient_ata: accts[4].to_string(),
                            acct_treasury_pda: accts[5].to_string(),
                            acct_treasury_ata: accts[6].to_string(),
                            acct_token_program: accts[7].to_string(),
                        });
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
