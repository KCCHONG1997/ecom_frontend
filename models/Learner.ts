// correspond to LearnerProfile in sql

import { UserAccount } from './User'; 
import { UserRole } from './User';   

export class Learner extends UserAccount {
    private _cover_image_url: string;
    private _profile_image_url: string;
    private _occupation: string;
    private _company_name: string;
    private _about_myself: string;

    constructor(
        user_id: number,
        username: string,
        email: string,
        password_hash: string,
        first_name: string,
        last_name: string,
        role: UserRole,
        created_at: Date,
        cover_image_url: string,
        profile_image_url: string,
        occupation: string,
        company_name: string,
        about_myself: string
    ) {
        super(user_id, username, email, password_hash, first_name, last_name, role, created_at);

        this._cover_image_url = cover_image_url;
        this._profile_image_url = profile_image_url;
        this._occupation = occupation;
        this._company_name = company_name;
        this._about_myself = about_myself;
    }

    get cover_image_url(): string {
        return this._cover_image_url;
    }

    set cover_image_url(value: string) {
        this._cover_image_url = value;
    }

    get profile_image_url(): string {
        return this._profile_image_url;
    }

    set profile_image_url(value: string) {
        this._profile_image_url = value;
    }

    get occupation(): string {
        return this._occupation;
    }

    set occupation(value: string) {
        this._occupation = value;
    }

    get company_name(): string {
        return this._company_name;
    }

    set company_name(value: string) {
        this._company_name = value;
    }

    get about_myself(): string {
        return this._about_myself;
    }

    set about_myself(value: string) {
        this._about_myself = value;
    }
}
