export interface ChangePasswordRequest {
    current_password: string;
    password: string;
    password_confirmation: string;
}