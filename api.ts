interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
}

let Users: User[] = [];
let id: number = 1;

export function CreateUser(firstName: string, lastName: string, age: number): User {
    let newUser = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        age: age
    };
    Users.push(newUser);
    id++
    return newUser;
}

export function sum(x: number, y:number): number {
    return x + y;
}