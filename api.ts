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
	if (
		validateNameString(newUser.firstName) ||
		validateNameString(newUser.lastName)
	) {
		throw new Error(
			"User cannot be created with invalid parameters. Please provide first name, last name & date of birth"
		);
	}
	Users.push(newUser);
	id++;
	return newUser;
}

function validateNameString(str: string): boolean {
	return !/^[a-zA-Z\s]+$/.test(str);
}

export function ViewUsers(): User[] {
	return Users;
}

export function FindUser(searchParam: string, query: string | User): User[] {
	try {
		return Param[searchParam](query);
	} catch (err) {
		throw new Error(`${searchParam} is not a valid search parameter`);
	}
}

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
	birthDate: (birthDate: Date) => {
		return Users.filter((user) => {
			return user.birthDate == birthDate;
		});
	},
	// exactMatch: (userObject: User) => {
	// 	return Users.filter((user) => {
	// 		return (
	// 			user.id == userObject.id &&
	// 			user.firstName == userObject.firstName &&
	// 			user.lastName == userObject.lastName &&
	// 			user.birthDate == userObject.birthDate
	// 		);
	// 	});
	// },
};

export function UpdateUser(oldUsers: User[], newUsers: User[]): User[] {
	oldUsers.forEach((value, index) => {
		value.firstName = newUsers[index].firstName;
		value.lastName = newUsers[index].lastName;
		value.birthDate = newUsers[index].birthDate;
	});
	return oldUsers;
	// oldUsers.forEach((value, index) => {
	// 	if (FindUser("exactMatch", value).length < 1) {
	// 		return [];
	// 	} else if (newUsers.length < 1) {
	// 		return [];
	// 	}
	// 	value.firstName = newUsers[index].firstName;
	// 	value.lastName = newUsers[index].lastName;
	// 	value.birthDate = newUsers[index].birthDate;
	// });
	// return oldUsers;
}

export function DeleteUser(usersToDelete: User[]): User[] {
	const deletedUsers: User[] = [];
	usersToDelete.forEach((value) => {
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
