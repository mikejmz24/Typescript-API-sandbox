export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
}

export interface bulkResults {
	success: User[];
	failed: User[];
	message: string;
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
		return [Users.find((user: User) => user.id == +id)];
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

export function DeleteUsersBulk(usersToDelete: User[]): bulkResults {
	const res: bulkResults = {
		success: [],
		failed: [],
		message: "",
	};
	usersToDelete.forEach((value: User) => {
		if (!validateUsers(value) || !exactMatch(value)) {
			res.failed.push(value);
		} else {
			const indexToDelete: number = Users.findIndex(
				(object: User) => object.id == value.id
			);
			if (indexToDelete != -1) {
				Users.splice(indexToDelete, 1);
				res.success.push(value);
			}
		}
	});
	res.message = formatBulkMessage(res, "deleted");
	return res;
}

function formatBulkMessage(res: bulkResults, operation: string): string {
	const successNum: number = res.success.length;
	const failNum: number = res.failed.length;
	const successPlural: string = successNum != 1 ? "s" : "";
	const failPlural: string = failNum != 1 ? "s" : "";
	const successUsersPrePronoun: string =
		successNum === 0 ? "No" : successNum != 1 ? "Users" : "User";
	const successUserFullNames: string = usersFullName(res.success);
	const successUserFinalPronoun: string = successNum != 1 ? "were" : "was";
	const failUserFullNames: string = usersFullName(res.failed);

	return (res.message =
		"Successfully " +
		operation +
		" " +
		successNum +
		" User" +
		successPlural +
		" with " +
		failNum +
		" failed delete operation" +
		failPlural +
		".\n" +
		successUsersPrePronoun +
		" " +
		successUserFullNames +
		" " +
		successUserFinalPronoun +
		" " +
		operation +
		"." +
		"\n" +
		"User" +
		failPlural +
		" " +
		failUserFullNames +
		" could not be " +
		operation +
		". Make sure User" +
		failPlural +
		" exists or correct parameters are provided.");
}

function usersFullName(user: User[]): string {
	let res: string = "";
	if (user.length > 0) {
		user.forEach(
			(user) => (res += user.firstName + " " + user.lastName + " & ")
		);
		return res.substring(0, res.length - 3);
	}
	return (res = "Users");
}

export function ClearUsers(): boolean {
	Users = [];
	id = 1;
	return true;
}

function validateNameString(str: string): boolean {
	return /^[a-zA-Z\s]+$/.test(str);
}

function validateDate(date: Date): boolean {
	return date.toString() != "Invalid Date";
}

function validateUserStringFormat(user: User, operation: string): boolean {
	if (!validateUsers(user)) {
		throw new Error(
			`User cannot be ${operation} with invalid parameters. Please provide a valid first name, last name & date of birth`
		);
	}
	return true;
}

function validateUsers(user: User): boolean {
	return (
		validateNameString(user.firstName) &&
		validateNameString(user.lastName) &&
		validateDate(user.birthDate)
	);
}

function exactMatch(user: User): boolean {
	if (
		Users.find(
			(value: User) => value.id == user.id && value.firstName == user.firstName
		)
	) {
		return true;
	}
}
