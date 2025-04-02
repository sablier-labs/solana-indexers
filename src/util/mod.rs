use base64::{engine::general_purpose, Engine as _};
use substreams_solana::block_view::InstructionView;

use substreams::log;

pub fn get_anchor_logs(instruction: &InstructionView) -> Vec<Vec<u8>> {
    let meta = instruction.meta();
    let mut decoded: Vec<Vec<u8>> = Vec::new();

    for log in &meta.log_messages {
        if log.starts_with("Program log: ") {
            log::info!("LOG AL {:?}", log);
        }
        if log.starts_with("Program data: ") {
            log::info!("LOG AD {:?}", log);

            if let Some(encoded_data) = log.strip_prefix("Program data: ") {
                if let Ok(data) = general_purpose::STANDARD.decode(encoded_data) {
                    decoded.push(data);
                }
            }
        }
    }

    return decoded;
}
