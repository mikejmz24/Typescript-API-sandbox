export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
}

export interface bulkResults {
	success: User[];
	failed: User[];
	successfulQueries: bulkParams[];
	failedQueries: bulkParams[];
	errors: string[];
	message: string;
}

export interface Query {
	params: string;
	query: string;
}

export interface bulkParams {
	searchQuery: Query;
	operationQueries?: Query[];
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
	if (Param[query.params] === undefined) {
		throw new Error(`${query.params} is not a valid search parameter`);
	}
	return Param[query.params](query.query);
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
	birthDate: (birthDate: Date | string) => {
		return Users.filter((user: User) => {
			return user.birthDate.toISOString() == new Date(birthDate).toISOString();
		});
	},
};

function validArray(users: User[]): boolean {
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

// TODO: Think about dynamic (single and multiple) update functions by User parameters.
export function BulkOperation(
	operation: string,
	parameters: bulkParams[]
): bulkResults {
	if (Operation[operation] === undefined) {
		throw new Error(`${operation} is not a valid Bulk operation.`);
	}
	if (parameters === undefined) {
		throw new Error(
			`${operation} Bulk operation cannot be performed. Please provide valid parameters.`
		);
	}
	return Operation[operation](parameters);
}

const Operation: { [key: string]: any } = {
	delete: (parameters: bulkParams[]) => {
		return DeleteUsersBulk(parameters);
	},
	update: (parameters: bulkParams[]) => {
		return UpdateUsersBulk(parameters);
	},
};

// TODO: Think about refactoring function by abstracting logic into other functions.
function UpdateUsersBulk(parameters: bulkParams[]): bulkResults {
	const res: bulkResults = {
		success: [],
		failed: [],
		successfulQueries: [],
		failedQueries: [],
		errors: [],
		message: "",
	};
	parameters.forEach((item: bulkParams) => {
		const users: User[] = FindUser(item.searchQuery);
		if (users.length > 0) {
			res.successfulQueries.push(item);
			users.forEach((value: User) => {
				const userIndex: number = Users.findIndex(
					(object: User) => object.id == value.id
				);
				if (userIndex != 1) {
					item.operationQueries.forEach((query: Query) => {
						if (value[query.params] === undefined) {
							res.failed.push(value);
							res.errors.push(
								`User with ${
									item.searchQuery.params == "birthDate"
										? "date of birth"
										: `${item.searchQuery.params.replace(/[N]/, " n")}`
								} ${item.searchQuery.query} does not have a ${
									query.params
								}. Please provide valid parameters.`
							);
						} else {
							value[query.params] = query.query;
							res.success.push(value);
						}
					});
				}
			});
		} else {
			res.failedQueries.push(item);
		}
	});
	res.message = formatBulkOperationMessage(res, "update");
	return res;
}

// TODO: Think about refactoring function by abstracting logic into other functions.
function DeleteUsersBulk(parameters: bulkParams[]): bulkResults {
	const res: bulkResults = {
		success: [],
		failed: [],
		successfulQueries: [],
		failedQueries: [],
		errors: [],
		message: "",
	};
	parameters.forEach((item: bulkParams) => {
		const users: User[] = FindUser(item.searchQuery);
		if (users.length > 0) {
			res.successfulQueries.push(item);
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
			res.failedQueries.push(item);
		}
	});
	res.message = formatBulkOperationMessage(res, "delete");
	return res;
}

// function formatBulkOperationMessage(
// 	res: bulkResults,
// 	operation: string
// ): string {
// 	const successCases: number = res.success.length;
// 	const failedCases: number = res.failedQueries.length;
// 	const successUsers: string =
// 		successCases > 0
// 			? `Successfully ${operation}d ${successCases} ${userQuantity(
// 					successCases
// 			  )}.\n`
// 			: "";
// 	const userPlural: string =
// 		successCases != 1 ? ` were ${operation}d.\n` : ` was ${operation}d.\n`;
// 	let deletedUsers: string = usersDeleted(res.success);
// 	let failedUsers: string = failedDeleted(res.failedQueries);
// 	const operationalQueriesFails: Query[] = extractQueriesFromBulkParams(
// 		res.failedQueries
// 	);
// 	const successPredicate: string =
// 		successCases > 0
// 			? userQuantity(successCases) + " " + deletedUsers + userPlural
// 			: "";
// 	const failedUserPronoun: string = userQuantity(failedCases);
// 	let failedOperationalQueries: string = failedOpsQueries(res)
// 		? "'s " + opsQueryStringformat(operationalQueriesFails, "update") + ". "
// 		: ` could not be ${operation}d. `;
// 	let failedPredicate: string =
// 		failedCases > 0
// 			? failedUserPronoun +
// 			  " with " +
// 			  failedUsers +
// 			  failedOperationalQueries +
// 			  `Make sure ${failedUserPronoun} exist${
// 					failedCases != 1 ? "" : "s"
// 			  } or correct parameters are provided.`
// 			: "";
// 	failedPredicate =
// 		res.failed.length == 0 &&
// 		res.failedQueries.length == 0 &&
// 		res.success.length == 0
// 			? `No Users could be ${operation}d. Make sure Users exist or correct parameters are provided.`
// 			: failedPredicate;
// 	return (res.message = successUsers + successPredicate + failedPredicate);
// }

function extractQueriesFromBulkParams(bulkParameters: bulkParams[]): Query[] {
	const res: Query[] = [];
	bulkParameters.forEach((bulkObject: bulkParams) => {
		bulkObject.operationQueries.forEach((queryObject: Query) =>
			res.push(queryObject)
		);
	});
	return res;
}

function formatBulkOperationMessage(
	bulkResult: bulkResults,
	operation: string
): string {
	const successCases: number = bulkResult.success.length;
	const failedCases: number = bulkResult.failed.length;
	const successQueriesCases: number = bulkResult.successfulQueries.length;
	const failedQueriesCases: number = bulkResult.failedQueries.length;
	const errorCases: number = bulkResult.errors.length;
	const successUsers: User[] = bulkResult.success;
	const failedUsers: User[] = bulkResult.failed;
	const failQueries: bulkParams[] = bulkResult.failedQueries;
	const failErrors: string[] =
		bulkResult.errors == undefined ? [] : bulkResult.errors;
	const successHeading: string = formatSuccessHeading(successCases, operation);
	const successPredicate: string = formatSuccessPredicate(
		successUsers,
		operation
	);
	const failedHeading: string = formatFailedHeading(failedCases, operation);
	const failedPredicate: string = formatFailedPredicate(
		failQueries,
		operation,
		failErrors
	);

	let res: string =
		successHeading + successPredicate + failedHeading + failedPredicate;
	return res;
}

function formatSuccessHeading(successCases: number, operation: string): string {
	let res: string = "";
	if (successCases == 0) {
		return res;
	}
	res = `Successfully ${operation}d ${successCases} Users.\n`;
	return res;
}

function formatSuccessPredicate(users: User[], operation: string): string {
	let res: string = "";
	const numberUsers: number = users.length;
	const userPronoun: string = numberUsers == 1 ? "User" : "Users";
	const userVerb: string = numberUsers == 1 ? "was" : "were";
	if (numberUsers == 0) {
		return res;
	}
	let userList: string = "";
	users.forEach(
		(user: User) => (userList += `${user.firstName} ${user.lastName} & `)
	);
	userList = userList.substring(0, userList.length - 3)
	res = `${userPronoun} ${userList} ${userVerb} ${operation}d.\n`;
	res.substring(0, res.length - 3);
	return res;
}
function formatFailedHeading(failedCases: number, operation: string): string {
	let res: string = "";
	if (failedCases == 0) {
		return res;
	}
	const userPronoun: string = failedCases == 1 ? "User" : "Users";
	res = `${failedCases} ${userPronoun} could not be ${operation}d.`;
	return res;
}

function formatFailedPredicate(
	bulkItems: bulkParams[],
	operation: string,
	errors?: string[]
): string {
	let res: string = "";
	const userPronoun: string = bulkItems.length != 1 ? "Users" : "User";
	const exist: string = userPronoun == "User" ? "exists" : "exist";
	const hint: string = `Make sure ${userPronoun} ${exist} or correct parameters are provided.`;
	if (bulkItems.length == 0) {
		res = `No Users could be ${operation}d. ${hint}`;
		return res;
	}
	bulkItems.forEach((bulkItem: bulkParams) => {
		const formattedSearchQuery = formatSearchQuery(bulkItem, operation);
		res = `${userPronoun} with ${formattedSearchQuery} ${hint}`;
	});
	return res;
}

function formatSearchQuery(bulkItem: bulkParams, operation: string): string {
	let res: string = "";
	const formattedParam: string = formatQueryParams(bulkItem.searchQuery);
	res = `${formattedParam} could not be ${operation}d.`;
	bulkItem.operationQueries.forEach((operationQuery: Query) => {
		const formattedOperationQueries = formatOperationQuery(operationQuery);
		const userPronoun: string = bulkItem.operationQueries.length != 1 ? "Users" : "User";
		res = `${userPronoun} with ${formattedOperationQueries} could not be ${operation}d.`;
	});
	return res;
}

function formatOperationQuery(query: Query): string {
	let res: string = "";
	res = `${query.params} ${query.query} & `;
	res = res.substring(0, res.length - 3);
	return res;
}

function formatQueryParams(query: Query): string {
	const DoB = new Date(query.query.toString());
	let res: string = "";
	if (query.params == "birthDate") {
		if (validateDate(DoB)) {
			res = `date of birth ${formatDate(DoB)}`;
			return res;
		} else {
			res = "invalid date of birth";
			return res;
		}
	}
	res = `${query.params.replace(/[N]/, " n")} ${query.query}`;
	return res;
}

function formatDate(date: Date): string {
	let res: string = "";
	res = `${Months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
	return res;
}

function FormatOperationalQueries(queries: Query[], operation): string {
	let res: string = "";
	let removedChars: number = 4;
	queries.forEach((query: Query, index: number) => {
		if (index != 0) {
			if (query.params == "birthDate") {
				res += `date of birth could not be ${operation}d to ${query.query} or `;
			} else {
				res += `${query.params.replace(/[N]/, " n")} be ${operation}d to ${
					query.query
				} or `;
			}
		} else {
			if (query.params == "birthDate") {
				res += `date of birth could not be ${operation}d to ${query.query} neirhter could the `;
			} else {
				res += `${query.params.replace(
					/[N]/,
					" n"
				)} could not be ${operation}d to ${query.query} neither could the `;
			}
		}
		removedChars = index != 0 ? removedChars : 19;
	});
	return res;
}

// function opsQueryStringformat(queries: Query[], operation: string): string {
// 	let res: string = "";
// 	let removedChars: number = 0;
// 	queries.forEach((query: Query, index: number) => {
// 		if (index != 0) {
// 			if (query.params == "birthDate") {
// 				res += `date of birth could be ${operation}d to ${query.query} or `;
// 			} else {
// 				res += `${query.params.replace(/[N]/, " n")} be ${operation}d to ${
// 					query.query
// 				} or `;
// 			}
// 		} else {
// 			if (query.params == "birthDate") {
// 				res += `date of birth could not be ${operation}d to ${query.query} neither could the `;
// 			} else {
// 				res += `${query.params.replace(
// 					/[N]/,
// 					" n"
// 				)} could not be ${operation}d to ${query.query} neither could the `;
// 			}
// 		}
// 		removedChars = index != 0 ? 4 : 19;
// 	});
// 	return res.substring(0, res.length - removedChars);
// }

function failedOpsQueries(res: bulkResults): boolean {
	return res.failedQueries.some(
		(element) => element.operationQueries.length > 0
	);
}

function userQuantity(evaluation: number): string {
	return evaluation != 1 ? "Users" : "User";
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

function failedDeleted(items: bulkParams[]): string {
	let res: string = "";
	if (items.length > 0) {
		items.forEach((item: bulkParams) => {
			res += failedFormattedMessage(item.searchQuery);
		});
		return res.substring(0, res.length - 3);
	}
	return res;
}

function failedFormattedMessage(query: Query): string {
	const DoB = new Date(query.query.toString());

	if (query.params == "birthDate") {
		if (validateDate(DoB)) {
			return `date of birth ${
				Months[DoB.getMonth()]
			} ${DoB.getDate()} ${DoB.getFullYear()} & `;
		} else {
			return "invalid date of birth & ";
		}
	} else {
		return `${query.params.replace(/[N]/, " n")} ${query.query} & `;
	}
}

const Months: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"Deceåmber",
];

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
