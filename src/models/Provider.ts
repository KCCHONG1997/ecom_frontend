// corresspond to providerAccount in backend

import { UserAccount } from './User'; // Import the UserAccount class
import { UserRole } from '../enums/userRole';    // Import UserRole for consistency

export class Provider extends UserAccount {
    private _lecture_team_id: number | null;
    private _organization_name: string;
    private _phone_number: string;
    private _address: string;

    constructor(
        user_id: number,
        username: string,
        email: string,
        password_hash: string,
        first_name: string,
        last_name: string,
        phone: string,
        role: UserRole,
        created_at: Date,
        lecture_team_id: number | null,
        organization_name: string,
        phone_number: string,
        address: string
    ) {
        // Call the parent constructor to initialize the UserAccount part
        super(user_id, username, email, password_hash, first_name, last_name, phone, role, created_at);

        // Initialize new properties specific to Provider
        this._lecture_team_id = lecture_team_id;
        this._organization_name = organization_name;
        this._phone_number = phone_number;
        this._address = address;
    }

    // Getters and Setters for new fields
    get lecture_team_id(): number | null {
        return this._lecture_team_id;
    }

    set lecture_team_id(value: number | null) {
        this._lecture_team_id = value;
    }

    get organization_name(): string {
        return this._organization_name;
    }

    set organization_name(value: string) {
        this._organization_name = value;
    }

    get phone_number(): string {
        return this._phone_number;
    }

    set phone_number(value: string) {
        this._phone_number = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }
}
