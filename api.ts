export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
}

export interface bulkResults {
	success: User[];
	failed: User[];
	failedQueries: Query[];
	message: string;
}

export interface Query {
	params: string;
	query: string;
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

export function FindUser(query: Query): User[] {
	try {
		if (isUserArrayEmpty(Users)) {
			throw new Error("There are no registered Users!");
		}
		return Param[query.params](query.query);
	} catch (err) {
		throw new Error(`${query.params} is not a valid search parameter`);
	}
}

const Param: { [key: string]: any } = {
	id: (id: string) => {
		return [Users.find((user: User) => user.id.toString() == id)];
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

function isUserArrayEmpty(users: User[]): boolean {
	return users === undefined || users === null;
}

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

export function DeleteUser(users: User[]): User[] {
	const deletedUsers: User[] = [];
	users.forEach((value: User) => {
		validateUserStringFormat(value, "deleted");
		const index: number = Users.findIndex((object) => {
			return object.id == value.id;
		});
		if (index != 1) {
			Users.splice(index, 1);
			deletedUsers.push(value);
		}
	});
	return deletedUsers;
}

export function BulkOperation(
	operation: string,
	queries: Query[]
): bulkResults {
	try {
		if (queries === undefined) {
			throw new Error(
				`${operation} cannot be completed. Please provide valid parameters.`
			);
		}
		return Operation[operation](queries);
	} catch (err) {
		throw new Error(`${operation} is not a valid Bulk operation.
		${err.message}`);
	}
}

const Operation: { [key: string]: any } = {
	delete: (queries: Query[]) => {
		return DeleteUsersBulk(queries);
	},
};

function DeleteUsersBulk(queries: Query[]): bulkResults {
	let res: bulkResults = {
		success: [],
		failed: [],
		failedQueries: [],
		message: "",
	};
	queries.forEach((query: Query) => {
		let users: User[] = FindUser(query);
		if (users.length > 0) {
			users.forEach((value: User) => {
				const userIndex: number = Users.findIndex(
					(object: User) => object.id == value.id
				);
				if (userIndex != 1) {
					Users.splice(userIndex, 1);
					res.success.push(value);
				}
			});
		} else {
			res.failedQueries.push(query);
		}
	});
	res.message = formatBulkOperationMessage(res, "delete");
	return res;
}

function formatBulkOperationMessage(
	res: bulkResults,
	operation: string
): string {
	const successCases: number = res.success.length;
	const failedCases: number = res.failedQueries.length;
	const userQuantity: string = successCases != 1 ? "Users" : "User";
	const successUsers: string =
		successCases > 0
			? `Successfully ${operation}d ${successCases} ${userQuantity}.\n`
			: "";
	const userPlural: string =
		successCases != 1 ? ` were ${operation}d.\n` : ` was ${operation}d.\n`;
	let deletedUsers: string = usersDeleted(res.success);
	let failedUsers: string = failedDeleted(res.failedQueries);
	const successPredicate: string =
		successCases > 0 ? userQuantity + " " + deletedUsers + userPlural : "";
	const failedPredicate: string =
		failedCases > 0
			? userQuantity +
			  " with " +
			  failedUsers +
			  ` could not be ${operation}d. Make sure User exists or correct parameters are provided.`
			: "";
	return (res.message = successUsers + successPredicate + failedPredicate);
}

function usersDeleted(users: User[]): string {
	let res: string = "";
	if (users.length > 0) {
		users.forEach(
			(user: User) => (res += `${user.firstName} ${user.lastName} & `)
		);
		return res.substring(0, res.length - 3);
	}
	return res;
}

function failedDeleted(queries: Query[]): string {
	let res: string = "";
	if (queries.length > 0) {
		queries.forEach(
			// (query: Query) => (res += `${query.params} ${query.query} & `)
			(query: Query) =>
				(res += `${query.params.replace(/[N]/, " n")} ${query.query} & `)
		);
		return res.substring(0, res.length - 3);
	}
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
	return Users.some(
		(value: User) => value.id == user.id && value.firstName == user.firstName
	);
}

function isValid(user: User): Boolean {
	return validateUsers(user) && exactMatch(user);
}
