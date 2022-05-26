export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
}

let Users: User[] = [];
let id: number = 1;

export function CreateUser(
	firstName: string,
	lastName: string,
	birthDate: Date
): User {
	const newUser: User = {
		id: id,
		firstName: firstName,
		lastName: lastName,
		birthDate: birthDate,
	};
	validateUserStringFormat(newUser, "created");
	Users.push(newUser);
	id++;
	return newUser;
}

function validateNameString(str: string): boolean {
	return !/^[a-zA-Z\s]+$/.test(str);
}

function validateDate(date: Date): boolean {
	return date.toString() == "Invalid Date";
}

function validateUserStringFormat(user: User, operation: string): boolean {
	if (
		validateNameString(user.firstName) ||
		validateNameString(user.lastName) ||
		validateDate(user.birthDate)
	) {
		throw new Error(
			`User cannot be ${operation} with invalid parameters. Please provide a valid first name, last name & date of birth`
		);
	}
	return true;
}

export function ViewUsers(): User[] {
	return Users;
}

export function FindUser(searchParam: string, query: string): User[] {
	try {
		return Param[searchParam](query);
	} catch (err) {
		throw new Error(`${searchParam} is not a valid search parameter`);
	}
}

const Param = {
	id: (id: number) => {
		const res: User[] = [];
		res.push(Users.find((user: User) => user.id == +id));
		return res;
	},
	firstName: (firstName: string) => {
		return Users.filter((user: User) => {
			return user.firstName == firstName;
		});
	},
	lastName: (lastName: string) => {
		return Users.filter((user: User) => {
			return user.lastName == lastName;
		});
	},
	fullName: (fullName: string) => {
		return Users.filter((user: User) => {
			return user.firstName + " " + user.lastName == fullName;
		});
	},
	birthDate: (birthDate: Date) => {
		return Users.filter((user: User) => {
			return user.birthDate == birthDate;
		});
	},
};

// TODO: Consider implementing transactions or individual tasks. Current behavior does valid tasks but returns error if one failed.
export function UpdateUser(oldUsers: User[], newUsers: User[]): User[] {
	const foundUsers: User[] = [];

	oldUsers.forEach((element: User) => {
		validateUserStringFormat(element, "updated");
		if (Users.includes(element)) {
			foundUsers.push(element);
		}
	});
	if (foundUsers.length < 1 || newUsers.length < 1) {
		return [];
	}
	oldUsers.forEach((value: User, index: number) => {
		validateUserStringFormat(newUsers[index], "updated");
		value.firstName = newUsers[index].firstName;
		value.lastName = newUsers[index].lastName;
		value.birthDate = newUsers[index].birthDate;
	});
	return oldUsers;
}

// TODO: Consider implementing transactions or individual tasks. Current behavior does valid tasks but returns error if one failed.
export function DeleteUser(usersToDelete: User[]): User[] {
	const deletedUsers: User[] = [];
	usersToDelete.forEach((value: User) => {
		validateUserStringFormat(value, "deleted");
		const indexToDelete: number = Users.findIndex((object) => {
			return object.id == value.id;
		});
		if (indexToDelete != 1) {
			Users.splice(indexToDelete, 1);
			deletedUsers.push(value);
		}
	});
	return deletedUsers;
}

export function ClearUsers(): boolean {
	Users = [];
	id = 1;
	return true;
}
