#[path = "./generated/constants.rs"]
mod constants;
mod generated;
mod idl;

use anchor_lang::AnchorDeserialize;
use anchor_lang::Discriminator;
use sablier_packages_substream as util;
use substreams_solana::block_view::InstructionView;
use substreams_solana::pb::sf::solana::r#type::v1::Block;

use generated::substreams::v1::program::{Claim, Clawback, Create, Data};
use idl::idl::merkle_instant_v10::{client::args as merkle_instant_v10_methods, events as merkle_instant_v10_events};

#[substreams::handlers::map]
fn map_program_data(block: Block) -> Data {
    let watched_programs: Vec<&str> = constants::cluster::SABLIER_MERKLE_INSTANT_V10.iter().copied().collect();

    let mut claim_list: Vec<Claim> = Vec::new();
    let mut clawback_list: Vec<Clawback> = Vec::new();
    let mut create_list: Vec<Create> = Vec::new();

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

                let slice_u8: &[u8] = &instruction.data()[..];
                if slice_u8[0..8] == merkle_instant_v10_methods::Claim::DISCRIMINATOR {
                    // let entry = handle_claim(index, &instruction);
                    // if let Some(_) = entry {
                    //     claim_list.push(entry.unwrap());
                    // }
                } else if slice_u8[0..8] == merkle_instant_v10_methods::Clawback::DISCRIMINATOR {
                    // let entry = handle_clawback(index, &instruction);
                    // if let Some(_) = entry {
                    //     clawback_list.push(entry.unwrap());
                    // }
                } else if slice_u8[0..8] == merkle_instant_v10_methods::CreateCampaign::DISCRIMINATOR {
                    // let entry = handle_create(index, &instruction);
                    // if let Some(_) = entry {
                    //     create_list.push(entry.unwrap());
                    // }
                }
            });
    });

    Data { claim_list, clawback_list, create_list, block_number, block_timestamp }
}
