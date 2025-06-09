// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Data {
    #[prost(message, repeated, tag="1")]
    pub cancel_list: ::prost::alloc::vec::Vec<Cancel>,
    #[prost(message, repeated, tag="2")]
    pub create_list: ::prost::alloc::vec::Vec<Create>,
    #[prost(message, repeated, tag="3")]
    pub renounce_list: ::prost::alloc::vec::Vec<Renounce>,
    #[prost(message, repeated, tag="4")]
    pub withdraw_list: ::prost::alloc::vec::Vec<Withdraw>,
    #[prost(message, repeated, tag="5")]
    pub withdraw_max_list: ::prost::alloc::vec::Vec<WithdrawMax>,
    #[prost(message, repeated, tag="6")]
    pub spl_transfer_list: ::prost::alloc::vec::Vec<Transfer>,
    #[prost(uint64, tag="7")]
    pub block_number: u64,
    #[prost(int64, tag="8")]
    pub block_timestamp: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Cancel {
    #[prost(string, tag="1")]
    pub instruction_program: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub instruction_index: u64,
    #[prost(string, tag="3")]
    pub transaction_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="4")]
    pub refunded: u64,
    #[prost(string, tag="5")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub deposit_token_mint: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub deposit_token_program: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub nft_mint: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub nft_data: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Create {
    #[prost(string, tag="1")]
    pub instruction_program: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub instruction_index: u64,
    #[prost(string, tag="3")]
    pub transaction_hash: ::prost::alloc::string::String,
    #[prost(int64, tag="4")]
    pub start_time: i64,
    #[prost(int64, tag="5")]
    pub cliff_time: i64,
    #[prost(int64, tag="6")]
    pub end_time: i64,
    #[prost(int64, tag="7")]
    pub total_duration: i64,
    #[prost(int64, tag="8")]
    pub cliff_duration: i64,
    #[prost(uint64, tag="9")]
    pub deposited_amount: u64,
    #[prost(uint64, tag="10")]
    pub initial_amount: u64,
    #[prost(uint64, tag="11")]
    pub cliff_amount: u64,
    #[prost(bool, tag="12")]
    pub cancelable: bool,
    #[prost(string, tag="13")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="15")]
    pub recipient: ::prost::alloc::string::String,
    #[prost(string, tag="16")]
    pub deposit_token_mint: ::prost::alloc::string::String,
    #[prost(string, tag="17")]
    pub deposit_token_program: ::prost::alloc::string::String,
    #[prost(uint32, tag="18")]
    pub deposit_token_decimals: u32,
    #[prost(string, tag="19")]
    pub nft_mint: ::prost::alloc::string::String,
    #[prost(string, tag="20")]
    pub nft_data: ::prost::alloc::string::String,
    #[prost(string, tag="21")]
    pub nft_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="22")]
    pub nft_token_program: ::prost::alloc::string::String,
    #[prost(string, tag="23")]
    pub salt: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Renounce {
    #[prost(string, tag="1")]
    pub instruction_program: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub instruction_index: u64,
    #[prost(string, tag="3")]
    pub transaction_hash: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub nft_mint: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub nft_data: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transfer {
    #[prost(string, tag="1")]
    pub instruction_program: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub instruction_index: u64,
    #[prost(string, tag="3")]
    pub transaction_hash: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub from: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub to: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub from_owner: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub to_owner: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub nft_mint: ::prost::alloc::string::String,
    #[prost(uint64, tag="9")]
    pub amount: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Withdraw {
    #[prost(string, tag="1")]
    pub instruction_program: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub instruction_index: u64,
    #[prost(string, tag="3")]
    pub transaction_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="4")]
    pub amount: u64,
    #[prost(string, tag="5")]
    pub to_recipient: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub to_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub deposit_token_mint: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub deposit_token_program: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub nft_mint: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub nft_data: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub nft_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="12")]
    pub nft_token_program: ::prost::alloc::string::String,
    #[prost(string, tag="13")]
    pub signer: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WithdrawMax {
    #[prost(string, tag="1")]
    pub instruction_program: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub instruction_index: u64,
    #[prost(string, tag="3")]
    pub transaction_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="4")]
    pub amount: u64,
    #[prost(string, tag="5")]
    pub to_recipient: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub to_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub deposit_token_mint: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub deposit_token_program: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub nft_mint: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub nft_data: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub nft_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="12")]
    pub nft_token_program: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub signer: ::prost::alloc::string::String,
}
// @@protoc_insertion_point(module)
