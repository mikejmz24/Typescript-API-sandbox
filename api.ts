interface User {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
};

let Users: User[] = [];
let id: number = 1;

export function CreateUser(
	firstName: string,
	lastName: string,
	age: number
): User {
	const newUser: User = {
		id: id,
		firstName: firstName,
		lastName: lastName,
		age: age,
	};
	Users.push(newUser);
	id++;
	return newUser;
};

export function ViewUsers(): User[] {
	return Users;
};

export function FindUser(searchParam: string, query: string): User[] {
	try {
		return Param[searchParam](query);
	} catch (err) {
		throw new Error(`${searchParam} is not a valid search parameter`);
	}
};

const Param = {
	id: (id: number) => {
		const res: User[] = [];
		res.push(Users.find((user) => user.id == +id));
		return res;
	},
	firstName: (firstName: string) => {
		return Users.filter((user) => {
			return user.firstName == firstName;
		});
	},
	lastName: (lastName: string) => {
		return Users.filter((user) => {
			return user.lastName == lastName;
		});
	},
	fullName: (fullName: string) => {
		return Users.filter((user) => {
			return user.firstName + " " + user.lastName == fullName;
		});
	},
	age: (age: number) => {
		return Users.filter((user) => {
			return user.age == +age;
		});
	},
};

// export function UpdateUser(id: number, params: string[], updates: string[]): User {
// 	let user = FindUser("id", id.toString());
// 	Object.keys(user)
// }

export function ClearUsers(): boolean {
	Users = [];
	id = 1;
	return true;
};
