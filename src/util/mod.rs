pub fn decode_spl_token_transfer(data: &[u8]) -> Option<u64> {
    if data.len() >= 9 {
        let instruction_type = data[0]; // First byte determines the instruction type
        if instruction_type == 3 || instruction_type == 12 {
            // 3 = Transfer, 12 = TransferChecked
            let amount = u64::from_le_bytes(data[1..9].try_into().ok()?);
            return Some(amount);
        }
    }
    None
}
