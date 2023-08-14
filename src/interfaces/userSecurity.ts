export interface UserSecurityPayload {
    login_attempt_counts: number,
    block_time_increment: number,
    min_password_length: number,
    password_rotation: number,
    has_uppercase: boolean,
    has_number: boolean,
    has_character: boolean
}