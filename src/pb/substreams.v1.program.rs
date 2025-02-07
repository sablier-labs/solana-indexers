// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Data {
    #[prost(message, repeated, tag="1")]
    pub cancel_list: ::prost::alloc::vec::Vec<Cancel>,
    #[prost(message, repeated, tag="2")]
    pub create_with_timestamps_list: ::prost::alloc::vec::Vec<CreateWithTimestamps>,
    #[prost(message, repeated, tag="3")]
    pub initialize_list: ::prost::alloc::vec::Vec<Initialize>,
    #[prost(message, repeated, tag="4")]
    pub renounce_list: ::prost::alloc::vec::Vec<Renounce>,
    #[prost(message, repeated, tag="5")]
    pub withdraw_list: ::prost::alloc::vec::Vec<Withdraw>,
    #[prost(message, repeated, tag="6")]
    pub withdraw_max_list: ::prost::alloc::vec::Vec<WithdrawMax>,
    #[prost(uint64, tag="7")]
    pub block_number: u64,
    #[prost(int64, tag="8")]
    pub block_timestamp: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Cancel {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub acct_sender: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub acct_stream: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub acct_mint: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub acct_sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub acct_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub acct_treasury_pda: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub acct_treasury_ata: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub acct_token_program: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CreateWithTimestamps {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(int64, tag="2")]
    pub start_time: i64,
    #[prost(int64, tag="3")]
    pub cliff_time: i64,
    #[prost(int64, tag="4")]
    pub end_time: i64,
    #[prost(uint64, tag="5")]
    pub deposited_amount: u64,
    #[prost(bool, tag="6")]
    pub is_cancelable: bool,
    #[prost(string, tag="7")]
    pub acct_sender: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub acct_mint: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub acct_sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub acct_recipient: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub acct_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="12")]
    pub acct_treasury_pda: ::prost::alloc::string::String,
    #[prost(string, tag="13")]
    pub acct_treasury_ata: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub acct_stream: ::prost::alloc::string::String,
    #[prost(string, tag="15")]
    pub acct_token_program: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Initialize {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub acct_signer: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub acct_treasury_pda: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Renounce {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub acct_sender: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub acct_stream: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub acct_sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub acct_recipient_ata: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Withdraw {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub amount: u64,
    #[prost(string, tag="3")]
    pub acct_signer: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub acct_stream: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub acct_mint: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub acct_sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub acct_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub acct_treasury_pda: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub acct_treasury_ata: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub acct_token_program: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WithdrawMax {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub acct_signer: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub acct_stream: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub acct_mint: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub acct_sender_ata: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub acct_recipient_ata: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub acct_treasury_pda: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub acct_treasury_ata: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub acct_token_program: ::prost::alloc::string::String,
}
// @@protoc_insertion_point(module)
