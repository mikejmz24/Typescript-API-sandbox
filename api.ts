interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
}

let Users: User[] = [];
let id: number = 1;

export function ViewUsers(): User[] {
    return Users;
}

export function CreateUser(firstName: string, lastName: string, age: number): User {
    const newUser: User = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        age: age
    };
    Users.push(newUser);
    id++;
    return newUser;
}

export function ClearUsers(): boolean {
    Users = [];
    id = 1;
    return true;
}