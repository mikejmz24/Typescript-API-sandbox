export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
}

export interface BulkResults {
	success: User[];
	failed: User[];
	successfulQueries: BulkParams[];
	failedQueries: BulkParams[];
	errors: ProcessedError[];
	message: string;
}
export interface ProcessedError {
	bulkItem: BulkParams;
	message: string;
}

export interface Query {
	params: string;
	query: string;
}

export interface BulkParams {
	searchQuery: Query;
	operationQueries: Query[];
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

// TODO: Consider implementing transactions or individual tasks. Current behavior does valid tasks but returns error if one failed.
export function UpdateUser(oldUsers: User[], newUsers: User[]): User[] {
	return oldUsers
		.filter((user: User) => {
			if (validateUserStringFormat(user, "updated")) {
				if (Users.includes(user)) {
					return user;
				}
			}
		})
		.filter((oldUser: User) => {
			return newUsers.some((newUser: User) => {
				return oldUser.id == newUser.id;
			});
		})
		.map((user: User, index: number) => {
			if (validateUserStringFormat(newUsers[index], "updated")) {
				user.id == user.id;
				user.firstName = newUsers[index].firstName;
				user.lastName = newUsers[index].lastName;
				user.birthDate = newUsers[index].birthDate;
			}
			return user;
		});
}

export function DeleteUser(users: User[]): User[] {
	return users.filter((user: User) => {
		if (validateUserStringFormat(user, "deleted")) {
			const index: number = Users.findIndex((item) => {
				return item.id == user.id;
			});
			if (index != -1) {
				Users.splice(index, 1);
				return user;
			}
		}
	});
}

// TODO: Think about dynamic (single and multiple) update functions by User parameters.
export function BulkOperation(
	operation: string,
	parameters: undefined | BulkParams[]
): BulkResults {
	if (!(operation == "delete" || operation == "update")) {
		throw new Error(`${operation} is not a valid Bulk operation.`);
	}
	if (parameters === undefined) {
		throw new Error(
			`${operation} Bulk operation cannot be performed. Please provide valid parameters.`
		);
	}
	return bulkProcess(parameters, operation);
}

function bulkProcess(bulkParams: BulkParams[], operation: string): BulkResults {
	const res: BulkResults = bulkResultsProcess(bulkParams, operation);
	res.message = formatBulkOperationMessage(res, operation);
	return res;
}

// function bulkResultsProcess(
// 	bulkItem: BulkParams[],
// 	operation: string
// ): BulkResults {
// 	const res: BulkResults = {
// 		success: [],
// 		failed: [],
// 		successfulQueries: [],
// 		failedQueries: [],
// 		errors: [],
// 		message: "",
// 	};
// 	bulkItem.forEach((item: BulkParams) => {
// 		const users: User[] = FindUser(item.searchQuery);
// 		if (users.length > 0) {
// 			res.successfulQueries.push(item);
// 			users.forEach((user: User) => {
// 				const userIndex: number = Users.findIndex(
// 					(object: User) => object.id == user.id
// 				);
// 				if (userIndex != -1) {
// 					const encapsuledParams: EncapsuledBulkParams = {
// 						bulkItem: item,
// 						user: user,
// 						index: userIndex,
// 					};
// 					const operationResult: EncapsuledBulk =
// 						Operation[operation](encapsuledParams);
// 					res.success = res.success.concat(operationResult.success);
// 					res.failed = res.failed.concat(operationResult.failed);
// 					res.errors = res.errors.concat(operationResult.errors);
// 				}
// 			});
// 		} else {
// 			res.failedQueries.push(item);
// 		}
// 	});
// 	return res;
// }

function bulkResultsProcess(
	bulkItem: BulkParams[],
	operation: string
): BulkResults {
	const res: BulkResults = {
		success: [],
		failed: [],
		successfulQueries: [],
		failedQueries: [],
		errors: [],
		message: "",
	};
	bulkItem.forEach((itemParam: BulkParams) => {
		const users: User[] = FindUser(itemParam.searchQuery);
		if (users.length == 0) {
			res.failedQueries.push(itemParam);
		}
		users.forEach((user: User) => {
			const userIndex: number = Users.findIndex(
				(object: User) => object.id == user.id
			);
			let hasError: boolean = false;
			let errorMessage: string = "";
			itemParam.operationQueries.forEach((query: Query, index: number) => {
				if (user[query.params] == undefined) {
					hasError = true;
					errorMessage += updateProcessErrorMessage(itemParam, query, index);
				}
			});
			if (hasError) {
				res.errors.push({
					bulkItem: {
						searchQuery: itemParam.searchQuery,
						operationQueries: itemParam.operationQueries,
					},
					message: `${errorMessage}. Please provide valid parameters.`,
				});
				res.failed.push(user);
			} else {
				// Perform bulk action
				if (userIndex != -1) {
					const encapsuledParams: EncapsuledBulkParams = {
						encasuledBulkParam: itemParam,
						encapsuledUser: user,
						encapsuledIndex: userIndex,
					};
					const operationResult = Operation[operation](encapsuledParams);
					res.success = res.success.concat(operationResult);
				}
			}
		});
		// Out of Users ForEach
		if (users.length != 0) {
			res.successfulQueries.push(itemParam);
		}
	});
	return res;
}

const Operation: { [key: string]: any } = {
	delete: (item: EncapsuledBulkParams) => {
		Users.splice(item.encapsuledIndex, 1);
		return [item.encapsuledUser];
	},
	update: (item: EncapsuledBulkParams) => {
		return [item.encapsuledUser];
	},
};

interface EncapsuledBulkParams {
	encasuledBulkParam: BulkParams;
	encapsuledUser: User;
	encapsuledIndex: number;
}

function updateProcessErrorMessage(
	item: BulkParams,
	query: Query,
	index: number
): string {
	if (index != 0) {
		return `, ${query.params}`;
	}
	return `User with ${formatQueryParamsComplete(
		item.searchQuery
	)} does not have a ${query.params}`;
}

function formatBulkOperationMessage(
	bulkResult: BulkResults,
	operation: string
): string {
	const successCases: number = bulkResult.success.length;
	const failedCases: number = bulkResult.failed.length;
	const successUsers: User[] = bulkResult.success;
	const failQueries: BulkParams[] = bulkResult.failedQueries;
	const errors: ProcessedError[] = bulkResult.errors;
	const successHeading: string = formatSuccessHeading(successCases, operation);
	const successPredicate: string = formatSuccessPredicate(
		bulkResult.successfulQueries,
		successUsers,
		operation
	);
	const failedHeading: string = formatFailedHeading(failedCases, operation);
	const failedPredicate: string = formatFailedPredicate(
		successCases,
		failQueries,
		operation,
		errors
	);
	return successHeading + successPredicate + failedHeading + failedPredicate;
}

interface Quantum {
	pronoun: string;
	verb: string;
	exists: string;
}

function messageQuantum(num: number): Quantum {
	let res: Quantum = {
		pronoun: "User",
		verb: "was",
		exists: "exists",
	};
	if (num != 1) {
		res.pronoun = "Users";
		res.verb = "were";
		res.exists = "exist";
	}
	return res;
}

function formatSuccessHeading(successCases: number, operation: string): string {
	const Pronoun: string = messageQuantum(successCases).pronoun;
	if (successCases == 0) {
		return "";
	}
	return `Successfully ${operation}d ${successCases} ${Pronoun}.\n`;
}

function formatSuccessPredicate(
	queries: BulkParams[],
	users: User[],
	operation: string
): string {
	if (users.length == 0) {
		return "";
	}
	if (queries[0].operationQueries.length > 0) {
		return operationalQueriesSuccessPredicate(queries, operation);
	}
	return nullOperationalQueriesSuccessPredicate(users, operation);
}

function operationalQueriesSuccessPredicate(
	queries: BulkParams[],
	operation: string
): string {
	const q: Quantum = messageQuantum(queries.length);
	let userList: string = "";
	queries.forEach((bulkItem) => {
		bulkItem.operationQueries.forEach((query: Query, index: number) => {
			if (index == 0) {
				userList = `${formatQueryParamsComplete(
					bulkItem.searchQuery
				)}'s ${formatQueryParamShort(query)} was ${operation}d to ${
					query.query
				}`;
			} else {
				userList += ` & ${formatQueryParamShort(query)} was ${operation}d to ${
					query.query
				}`;
			}
		});
	});
	return `${q.pronoun} with ${userList}.\n`;
}

function nullOperationalQueriesSuccessPredicate(
	users: User[],
	operation: string
): string {
	const q: Quantum = messageQuantum(users.length);
	let userList: string = "";
	users.forEach(
		(user: User) => (userList += `${user.firstName} ${user.lastName} & `)
	);
	userList = trimAmp(userList);
	return `${q.pronoun} ${userList} ${q.verb} ${operation}d.\n`;
}

function formatFailedHeading(failedCases: number, operation: string): string {
	let res: string = "";
	if (failedCases == 0) {
		return res;
	}
	const userPronoun: string = failedCases == 1 ? "User" : "Users";
	// res = `${failedCases} ${userPronoun} could not be ${operation}d.`;
	return res;
}

function formatFailedPredicate(
	successCases: number,
	bulkItems: BulkParams[],
	operation: string,
	errors: ProcessedError[]
): string {
	if (bulkItems.length == 0 && errors.length == 0 && successCases > 0) {
		return "";
	}
	if (bulkItems.length == 0 && errors.length == 0) {
		return noFailItemsPredicate(bulkItems, operation);
	}
	if (errors.length > 0) {
		return errorPredicate(errors, operation);
	}
	return failedQueriesPredicate(bulkItems, operation);
}

function noFailItemsPredicate(
	bulkItems: BulkParams[],
	operation: string
): string {
	const q: Quantum = messageQuantum(bulkItems.length);
	const Hint: string = `Make sure ${q.pronoun} ${q.exists} or correct parameters are provided.`;
	return `No ${q.pronoun} could be ${operation}d. ${Hint}`;
}

function errorPredicate(errors: ProcessedError[], operation: string): string {
	const q: Quantum = messageQuantum(errors.length);
	const Hint: string = `Make sure ${q.pronoun} ${q.exists} or correct parameters are provided.`;
	let errorData: string = "";
	errors.forEach((processError: ProcessedError) => {
		errorData += formatProcessedError(processError, operation);
	});
	return `${q.pronoun} with ${errorData}. ${Hint}`;
}

function failedQueriesPredicate(
	bulkItems: BulkParams[],
	operation: string
): string {
	const q: Quantum = messageQuantum(bulkItems.length);
	const hint: string = `Make sure ${q.pronoun} ${q.exists} or correct parameters are provided.`;
	let formattedSearchQuery: string = "";
	bulkItems.forEach((bulkItem: BulkParams) => {
		formattedSearchQuery += formatSearchQuery(bulkItem, operation);
	});
	if (trimSearchQuery(formattedSearchQuery)) {
		formattedSearchQuery = trimAmp(formattedSearchQuery);
		return `${q.pronoun} with ${formattedSearchQuery} could not be ${operation}d. ${hint}`;
	}
	return `${q.pronoun} with ${formattedSearchQuery}. ${hint}`;
}

function trimSearchQuery(value: string): boolean {
	return value.substring(value.length - 3, value.length) == " & ";
}

function trimAmp(value: string): string {
	return (value = value.substring(0, value.length - 3));
}

function formatProcessedError(
	error: ProcessedError,
	operation: string
): string {
	const search: string = formatQueryParamsComplete(error.bulkItem.searchQuery);
	const operations: Query[] = error.bulkItem.operationQueries;
	let operationQuery: string = "";
	operations.forEach((item: Query) => {
		const formattedParams: string = formatQueryParamShort(item);
		operationQuery += `${formattedParams} could not be ${operation}d to ${item.query}`;
	});
	// full name Captain Morgan's first name could not be updated to Kraken neither could the last name be updated to Black
	return `${search}'s ${operationQuery}`;
}

function formatQueryParamShort(query: Query): string {
	const DoB = new Date(query.query.toString());
	if (query.params == "birthDate") {
		if (validateDate(DoB)) {
			return "date of birth";
		} else {
			return "invalid date of birth";
		}
	}
	return query.params.replace(/[N]/, " n");
}

function formatSearchQuery(bulkItem: BulkParams, operation: string): string {
	const operationQueriesQuantity: number = bulkItem.operationQueries.length;
	const formattedParam: string = formatQueryParamsComplete(
		bulkItem.searchQuery
	);
	if (operationQueriesQuantity == 0) {
		return `${formattedParam} & `;
	}
	let formattedOperationQueries: string = "";
	let additional: boolean = false;
	bulkItem.operationQueries.forEach((operationQuery: Query, index: number) => {
		if (index != 0) {
			additional = true;
		}
		formattedOperationQueries += formatOperationQuery(
			operationQuery,
			operation,
			additional
		);
	});
	return `${formattedParam}${formattedOperationQueries}`;
}

function formatOperationQuery(
	query: Query,
	operation: string,
	additional: boolean
): string {
	let formattedQuery: string = formatQueryParamShort(query);
	if (!additional) {
		return `'s ${formattedQuery} could not be ${operation}d to ${query.query}`;
	}
	return ` neither could the ${formattedQuery} be ${operation}d to ${query.query}`;
}

function formatQueryParamsComplete(query: Query): string {
	const DoB = new Date(query.query.toString());
	if (query.params == "birthDate") {
		if (validateDate(DoB)) {
			return `date of birth ${formatDate(DoB)}`;
		} else {
			return "invalid date of birth";
		}
	}
	return `${query.params.replace(/[N]/, " n")} ${query.query}`;
}

function formatDate(date: Date): string {
	return `${Months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
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
