import {
	User,
	CreateUser,
	ViewUsers,
	ClearUsers,
	FindUser,
	UpdateUser,
	DeleteUser,
	DeleteUsersBulk,
	bulkResults,
	BulkOperation,
	Query,
} from "./api";

const DT_TrainOfThought: Date = new Date("2003-11-11");
const Kamelot_Epica: Date = new Date("2003-1-13");
const SX_Odyssey: Date = new Date("2002-11-5");
const Epica_ThePhantomAgony: Date = new Date("2003-6-5");
const DM_WorldMisanthropy: Date = new Date("2002-5-28");

describe("CreateUser creates users, adds them to the Users array and returns the created User", () => {
	beforeAll(() => {
		ClearUsers();
	});
	it("Should create User Jack Daniels and returns its id, firstname, lastname & birthDate", () => {
		const testUser1: User = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: DT_TrainOfThought,
		};
		expect(CreateUser("Jack", "Daniels", DT_TrainOfThought)).toEqual(testUser1);
	});
	it("Should create User Jim Bean with a different ID than User Jack Daniels", () => {
		const Users: User[] = ViewUsers();
		CreateUser("Jim", "Bean", Kamelot_Epica);
		expect(Users[0].id).not.toBe(Users[1].id);
	});
	it("Should return an error when an invalid parameter like an object is provided", () => {
		const testUser1: User = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: DT_TrainOfThought,
		};
		expect(() => {
			CreateUser(testUser1.toString(), "name", DT_TrainOfThought);
		}).toThrowError(
			"User cannot be created with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
});

describe("ViewUsers returns a list of all created Users", () => {
	beforeAll(() => {
		ClearUsers();
	});
	it("Should return an empty array when there are no created Users", () => {
		expect(ViewUsers()).toEqual([]);
	});
	it("Should return an array with Users Jack Daniels & Jim Bean's data", () => {
		const testUser1: User = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: DT_TrainOfThought,
		};
		const testUser2: User = {
			id: 2,
			firstName: "Jim",
			lastName: "Bean",
			birthDate: Kamelot_Epica,
		};
		CreateUser("Jack", "Daniels", DT_TrainOfThought);
		CreateUser("Jim", "Bean", Kamelot_Epica);
		expect(ViewUsers()).toEqual([testUser1, testUser2]);
	});
});

describe("FindUser searches Users array and returns all Users whose criteria matches", () => {
	beforeAll(() => {
		ClearUsers();
	});
	let query: Query;
	it("Should return and empty array when when no User is found with id 10", () => {
		query = { params: "id", query: "10" };
		expect(FindUser(query)).toEqual([]);
	});
	it("Should return an empty array when User Don Julio is not found by searching by its first name", () => {
		query = { params: "firstName", query: "Don Julio" };
		expect(FindUser(query)).toEqual([]);
	});
	it("Should return an empty array when User Elijah Craig is not found by searching by its last name", () => {
		query = { params: "lastName", query: "Craig" };
		expect(FindUser(query)).toEqual([]);
	});
	it("Should return an empty array when User Jim Bean is not found by searching by its full name", () => {
		query = { params: "fullName", query: "Jim Bean" };
		expect(FindUser(query)).toEqual([]);
	});
	it("Should return an empty array when no User is found with date of birth June 5, 2003", () => {
		query = { params: "birthDate", query: Epica_ThePhantomAgony.toString() };
		expect(FindUser(query)).toEqual([]);
	});
	it("Should return an Error when the Search Parameter is Alias or anything unknown", () => {
		query = { params: "alias", query: "Gentleman" };
		expect(() => {
			FindUser(query);
		}).toThrowError("alias is not a valid search parameter");
	});
	it("Should return User Jim Bean's data when searched by its ID", () => {
		query = { params: "id", query: "1" };
		const testUser1: User = {
			id: 1,
			firstName: "Jim",
			lastName: "Bean",
			birthDate: Epica_ThePhantomAgony,
		};
		CreateUser("Jim", "Bean", Epica_ThePhantomAgony);
		expect(FindUser(query)).toEqual([testUser1]);
	});
	it("Should return User Johnnie Walker's data when searched by its first name", () => {
		query = { params: "firstName", query: "Johnnie" };
		const testUser2: User = {
			id: 2,
			firstName: "Johnnie",
			lastName: "Walker Black",
			birthDate: DT_TrainOfThought,
		};
		CreateUser("Johnnie", "Walker Black", DT_TrainOfThought);
		expect(FindUser(query)).toEqual([testUser2]);
	});
	it("Should return Users Johnnie Walker Black & Johnnie Walker Green's data when searched by its first name", () => {
		query = { params: "firstName", query: "Johnnie" };
		const testUser2: User = {
			id: 2,
			firstName: "Johnnie",
			lastName: "Walker Black",
			birthDate: DT_TrainOfThought,
		};
		const testUser3: User = {
			id: 3,
			firstName: "Johnnie",
			lastName: "Walker Green",
			birthDate: Kamelot_Epica,
		};
		CreateUser("Johnnie", "Walker Green", Kamelot_Epica);
		expect(FindUser(query)).toEqual([testUser2, testUser3]);
	});
	it("Should return user Elijah Craig's data by searching by its last name", () => {
		query = { params: "lastName", query: "Craig" };
		const testUser4: User = {
			id: 4,
			firstName: "Elijah",
			lastName: "Craig",
			birthDate: SX_Odyssey,
		};
		CreateUser("Elijah", "Craig", SX_Odyssey);
		expect(FindUser(query)).toEqual([testUser4]);
	});
	it("Should return users Jose Cuervos' data when searching by their last names", () => {
		query = { params: "lastName", query: "Cuervo" };
		const testUser5: User = {
			id: 5,
			firstName: "Jose",
			lastName: "Cuervo",
			birthDate: DT_TrainOfThought,
		};
		const testUser6: User = {
			id: 6,
			firstName: "Jose",
			lastName: "Cuervo",
			birthDate: DM_WorldMisanthropy,
		};
		CreateUser("Jose", "Cuervo", DT_TrainOfThought);
		CreateUser("Jose", "Cuervo", DM_WorldMisanthropy);
		expect(FindUser(query)).toEqual([testUser5, testUser6]);
	});
	it("Should return User Jack Daniels' data by searching by its full name 'Jack Daniels'", () => {
		query = { params: "fullName", query: "Jack Daniels" };
		const testUser7 = {
			id: 7,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(FindUser(query)).toEqual([testUser7]);
	});
	it("Should return all 3 Jack Daniels Users by searching by their full name", () => {
		query = { params: "fullName", query: "Jack Daniels" };
		const testUser7 = {
			id: 7,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		const testUser8 = {
			id: 8,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: SX_Odyssey,
		};
		const testUser9 = {
			id: 9,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: SX_Odyssey,
		};
		CreateUser("Jack", "Daniels", SX_Odyssey);
		CreateUser("Jack", "Daniels", SX_Odyssey);
		expect(FindUser(query)).toEqual([testUser7, testUser8, testUser9]);
	});
	it("Should return User Jose Cuervo's data when searched by his birthDate May 28, 2002", () => {
		query = { params: "birthDate", query: DM_WorldMisanthropy.toString() };
		const testUser6 = {
			id: 6,
			firstName: "Jose",
			lastName: "Cuervo",
			birthDate: DM_WorldMisanthropy,
		};
		expect(FindUser(query)).toEqual([testUser6]);
	});
	it("Should return User Jim Bean & Jack Daniels data when search by their birthDate (24)", () => {
		query = { params: "birthDate", query: Epica_ThePhantomAgony.toString() };
		const testUser1 = {
			id: 1,
			firstName: "Jim",
			lastName: "Bean",
			birthDate: Epica_ThePhantomAgony,
		};
		const testUser7 = {
			id: 7,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		expect(FindUser(query)).toEqual([testUser1, testUser7]);
	});
});

// TODO: review testing for transactions, or consider executing individual tasks
describe("UpdateUser modifies Users' data and returns their updated User data", () => {
	beforeAll(() => {
		ClearUsers();
	});
	let oldData: User[];
	let newData: User[];
	let query: Query;
	beforeEach(() => {
		oldData = [];
		newData = [];
	});
	it("Should return an empty array if no old or new User data is provided to update", () => {
		expect(UpdateUser(oldData, newData)).toEqual([]);
	});
	it("Should return an empty array if no old User data is provided", () => {
		newData = [
			{
				id: 1,
				firstName: "Macallan",
				lastName: "Eighteen years old",
				birthDate: DM_WorldMisanthropy,
			},
		];
		expect(UpdateUser(oldData, newData)).toEqual([]);
	});
	it("Should return an empty array if no new User data is provided", () => {
		CreateUser("Pappy", "Van Winkle II", Epica_ThePhantomAgony);
		expect(UpdateUser(oldData, newData)).toEqual([]);
	});
	it("Should return an empty array if the old User data provided does not exist in the Users array", () => {
		oldData = [
			{
				id: 2,
				firstName: "Pappy",
				lastName: "Van Winkle",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(UpdateUser(oldData, newData)).toEqual([]);
	});
	it("Should return an error if the new User data contains invalid first name parameters", () => {
		oldData.push(CreateUser("Captain", "Morgan", SX_Odyssey));
		newData = [
			{
				id: 3,
				firstName: "Le Capitaine$#",
				lastName: "Morgan",
				birthDate: Epica_ThePhantomAgony,
			},
		];
		expect(() => {
			UpdateUser(oldData, newData);
		}).toThrowError(
			"User cannot be updated with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error if the new User data contains invalid last name parameters", () => {
		oldData.push(CreateUser("Captain", "Morgan", SX_Odyssey));
		newData = [
			{
				id: 3,
				firstName: "Le Capitaine",
				lastName: "M. Morgan!",
				birthDate: Epica_ThePhantomAgony,
			},
		];
		expect(() => {
			UpdateUser(oldData, newData);
		}).toThrowError(
			"User cannot be updated with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error if the new User data contains invalid birth date parameters", () => {
		oldData.push(CreateUser("Captain", "Morgan", SX_Odyssey));
		newData = [
			{
				id: 3,
				firstName: "Le Capitaine",
				lastName: "Morgan",
				birthDate: new Date("foo"),
			},
		];
		expect(() => {
			UpdateUser(oldData, newData);
		}).toThrowError(
			"User cannot be updated with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should change User Jack Daniels' birthDate from November 11, 2003 to November 5, 2002 and return its updated User object", () => {
		oldData.push(CreateUser("Jack", "Daniels", DT_TrainOfThought));
		newData = [
			{
				id: 5,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: SX_Odyssey,
			},
		];
		expect(UpdateUser(oldData, newData)).toEqual(newData);
	});
	it("Should update all 3 Johnnie Walker's first name from Johnny to Johnnie", () => {
		oldData.push(CreateUser("Johnny", "Walker Black", DT_TrainOfThought));
		oldData.push(CreateUser("Johnny", "Walker Green", Kamelot_Epica));
		oldData.push(CreateUser("Johnny", "Walker Blue", SX_Odyssey));
		newData = [
			{
				id: 6,
				firstName: "Johnnie",
				lastName: "Walker Black",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 7,
				firstName: "Johnnie",
				lastName: "Walker Green",
				birthDate: Kamelot_Epica,
			},
			{
				id: 8,
				firstName: "Johnnie",
				lastName: "Walker Blue",
				birthDate: SX_Odyssey,
			},
		];
		expect(UpdateUser(oldData, newData)).toEqual(newData);
	});
	it("Should find User Bacardi Limon by its full name and update its lastname to Blanco", () => {
		query = { params: "fullName", query: "Bacardi Limon" };
		oldData.push(CreateUser("Bacardi", "Limon", DT_TrainOfThought));
		newData = [
			{
				id: 9,
				firstName: "Bacardi",
				lastName: "Blanco",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(UpdateUser(FindUser(query), newData)).toEqual(newData);
	});
});

// TODO: review testing for transactions, or consider executing individual tasks
describe("DeleteUser removes Users from the Users array and returns the deleted Users's data", () => {
	let query: Query;
	beforeAll(() => {
		ClearUsers();
	});
	it("Should return an empty array when User with full name Courvoisier VSOP is not found", () => {
		query = { params: "fullName", query: "Courvosier VSOP" };
		expect(DeleteUser(FindUser(query))).toEqual([]);
	});
	it("Should return an error when the user to be deleted contains an invalid first name", () => {
		const testUser10: User[] = [
			{
				id: 1,
				firstName: "Remy –",
				lastName: "Martin",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(() => {
			DeleteUser(testUser10);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error when the user to be deleted contains an invalid last name", () => {
		const testUser11: User[] = [
			{
				id: 2,
				firstName: "Remy",
				lastName: "Martin!",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(() => {
			DeleteUser(testUser11);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error when the user to be deleted contains an invalid date of birth", () => {
		const testUser12: User[] = [
			{
				id: 3,
				firstName: "Remy",
				lastName: "Martin",
				birthDate: new Date("I like turtles"),
			},
		];
		expect(() => {
			DeleteUser(testUser12);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error when the third user to be deleted contains an invalid last name", () => {
		const testUser13: User[] = [
			{
				id: 4,
				firstName: "Dom",
				lastName: "Perignon",
				birthDate: SX_Odyssey,
			},
			{
				id: 5,
				firstName: "Glen",
				lastName: "Moray",
				birthDate: Epica_ThePhantomAgony,
			},
			{
				id: 6,
				firstName: "Bunnahabhain",
				lastName: "& Glenfiddich",
				birthDate: Kamelot_Epica,
			},
		];
		expect(() => {
			DeleteUser(testUser13);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should delete User Jack Daniels when searching by its date of birth June 5th, 2003", () => {
		query = { params: "birthDate", query: Epica_ThePhantomAgony.toString() };
		const testUser1 = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(DeleteUser(FindUser(query))).toEqual([testUser1]);
	});
	it("Should delete User Jim Bean and when searching the remaining users it should return every User except Jim Bean", () => {
		query = { params: "fullName", query: "Jim Bean" };
		const testUser2 = {
			id: 2,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		const testUser3 = {
			id: 3,
			firstName: "Don Julio",
			lastName: "Reposado",
			birthDate: SX_Odyssey,
		};
		const testUser4 = {
			id: 4,
			firstName: "Johnnie",
			lastName: "Walker Blue",
			birthDate: Kamelot_Epica,
		};
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Reposado", SX_Odyssey);
		CreateUser("Johnnie", "Walker Blue", Kamelot_Epica);
		CreateUser("Jim", "Bean", DT_TrainOfThought);
		DeleteUser(FindUser(query));
		expect(ViewUsers()).toEqual([testUser2, testUser3, testUser4]);
	});
});

describe("DeleteUsersBulk deletes a group of Users from the Users array and returns a message with the number of success and failed operations including the Users' data", () => {
	let testUser: User[];
	let results: bulkResults;
	let query: Query;
	beforeAll(() => {
		ClearUsers();
	});
	// TODO: Review a way to handle missed bulk operations or how to return more descriptive messages.
	it("Should return an error message when entered Bulk action remove", () => {
		expect(() => {
			BulkOperation("remove", query, testUser);
		}).toThrowError("remove is not a valid Bulk operation");
	});
	it("Should return a message that user with ID i was successfully deleted", () => {
		query = { params: "fullName", query: "Captain Morgan" };
		const testUser: User[] = FindUser(query);
		const results: bulkResults = {
			success: [],
			failed: testUser,
			message: "User with full name Captain Morgan could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", query, testUser)).toEqual(results);
	});
	// it("Should return a message that no Users could be deleted when the User to be deleted contains an invalid first name", () => {
	// 	const testUser: User[] = [
	// 		{
	// 			id: 1,
	// 			firstName: "Remy –",
	// 			lastName: "Martin",
	// 			birthDate: DT_TrainOfThought,
	// 		},
	// 	];
	// 	const results: bulkResults = {
	// 		success: [],
	// 		failed: testUser,
	// 		message:
	// 			"Successfully deleted 0 Users with 1 failed delete operation.\n" +
	// 			"No Users were deleted.\n" +
	// 			"User Remy – Martin could not be deleted. Make sure User exists or correct parameters are provided.",
	// 	};
	// 	expect(DeleteUsersBulk(query, testUser)).toEqual(results);
	// });
	// it("Should return a message that no Users could be deleted when the User to be deleted contains an invalid last name", () => {
	// 	const testUser: User[] = [
	// 		{
	// 			id: 2,
	// 			firstName: "Remy",
	// 			lastName: "Martin!",
	// 			birthDate: DT_TrainOfThought,
	// 		},
	// 	];
	// 	const results: bulkResults = {
	// 		success: [],
	// 		failed: testUser,
	// 		message:
	// 			"Successfully deleted 0 Users with 1 failed delete operation.\n" +
	// 			"No Users were deleted.\n" +
	// 			"User Remy Martin! could not be deleted. Make sure User exists or correct parameters are provided.",
	// 	};
	// 	expect(DeleteUsersBulk(query, testUser)).toEqual(results);
	// });
	// it("Should return a message that no Users could be deleted when the User to be deleted contains an invalid date of birth", () => {
	// 	const testUser: User[] = [
	// 		{
	// 			id: 3,
	// 			firstName: "Remy",
	// 			lastName: "Martin",
	// 			birthDate: new Date("I like turtles"),
	// 		},
	// 	];
	// 	const results: bulkResults = {
	// 		success: [],
	// 		failed: testUser,
	// 		message:
	// 			"Successfully deleted 0 Users with 1 failed delete operation.\n" +
	// 			"No Users were deleted.\n" +
	// 			"User Remy Martin could not be deleted. Make sure User exists or correct parameters are provided.",
	// 	};
	// 	expect(DeleteUsersBulk(query, testUser)).toEqual(results);
	// });
	// it("Should return a message that no Users could be deleted when there are no valid users to delete", () => {
	// 	const testUser14: User[] = [
	// 		{
	// 			id: 0,
	// 			firstName: "Don",
	// 			lastName: "Julio",
	// 			birthDate: DM_WorldMisanthropy,
	// 		},
	// 	];
	// 	const results2: bulkResults = {
	// 		success: [],
	// 		failed: [
	// 			{
	// 				id: 0,
	// 				firstName: "Don",
	// 				lastName: "Julio",
	// 				birthDate: DM_WorldMisanthropy,
	// 			},
	// 		],
	// 		message:
	// 			"Successfully deleted 0 Users with 1 failed delete operation.\n" +
	// 			"No Users were deleted.\n" +
	// 			"User Don Julio could not be deleted. Make sure User exists or correct parameters are provided.",
	// 	};
	// 	expect(DeleteUsersBulk(query, testUser14)).toEqual(results2);
	// });
	// it("Should successfully delete Users Jack Daniels & Jim Bean but fail to delete non-existing User Jose Cuervo while returning their data", () => {
	// 	const testUser15: User[] = [
	// 		{
	// 			id: 1,
	// 			firstName: "Jack",
	// 			lastName: "Daniels",
	// 			birthDate: Epica_ThePhantomAgony,
	// 		},
	// 		{
	// 			id: 2,
	// 			firstName: "Jim",
	// 			lastName: "Bean",
	// 			birthDate: DM_WorldMisanthropy,
	// 		},
	// 		{
	// 			id: 0,
	// 			firstName: "Jose",
	// 			lastName: "Cuervo",
	// 			birthDate: Kamelot_Epica,
	// 		},
	// 	];
	// 	const results1: bulkResults = {
	// 		success: [
	// 			{
	// 				id: 1,
	// 				firstName: "Jack",
	// 				lastName: "Daniels",
	// 				birthDate: Epica_ThePhantomAgony,
	// 			},
	// 			{
	// 				id: 2,
	// 				firstName: "Jim",
	// 				lastName: "Bean",
	// 				birthDate: DM_WorldMisanthropy,
	// 			},
	// 		],
	// 		failed: [
	// 			{
	// 				id: 0,
	// 				firstName: "Jose",
	// 				lastName: "Cuervo",
	// 				birthDate: Kamelot_Epica,
	// 			},
	// 		],
	// 		message:
	// 			"Successfully deleted 2 Users with 1 failed delete operation.\n" +
	// 			"Users Jack Daniels & Jim Bean were deleted.\n" +
	// 			"User Jose Cuervo could not be deleted. Make sure User exists or correct parameters are provided.",
	// 	};
	// 	CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
	// 	CreateUser("Jim", "Bean", DM_WorldMisanthropy);
	// 	expect(DeleteUsersBulk(query, testUser15)).toEqual(results1);
	// });
});

// run tests with the "npx jest" commmand in the terminal
