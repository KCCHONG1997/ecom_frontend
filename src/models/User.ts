import { UserRole } from '../enums/userRole';  

export interface User { // same as UserAccount in DB table
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone: string;  // New phone property
    role: UserRole;
    created_at: Date;
}

export class UserAccount implements User {
    private _user_id: number;
    private _username: string;
    private _email: string;
    private _password_hash: string;
    private _first_name: string;
    private _last_name: string;
    private _phone: string;  
    private _role: UserRole;
    private _created_at: Date;

    constructor(
        user_id: number,
        username: string,
        email: string,
        password_hash: string,
        first_name: string,
        last_name: string,
        phone: string,  // New parameter for phone number
        role: UserRole,
        created_at: Date
    ) {
        this._user_id = user_id;
        this._username = username;
        this._email = email;
        this._password_hash = password_hash;
        this._first_name = first_name;
        this._last_name = last_name;
        this._phone = phone;  // Assign the phone number
        this._role = role;
        this._created_at = created_at;
    }

    // Getters and Setters

    get user_id(): number {
        return this._user_id;
    }

    set user_id(value: number) {
        this._user_id = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password_hash(): string {
        return this._password_hash;
    }

    set password_hash(value: string) {
        this._password_hash = value;
    }

    get first_name(): string {
        return this._first_name;
    }

    set first_name(value: string) {
        this._first_name = value;
    }

    get last_name(): string {
        return this._last_name;
    }

    set last_name(value: string) {
        this._last_name = value;
    }
    
    get phone(): string {
        return this._phone;
    }
    
    set phone(value: string) {
        this._phone = value;
    }

    get role(): UserRole {
        return this._role;
    }

    set role(value: UserRole) {
        this._role = value;
    }

    get created_at(): Date {
        return this._created_at;
    }

    set created_at(value: Date) {
        this._created_at = value;
    }
}
