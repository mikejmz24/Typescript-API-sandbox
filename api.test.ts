import {
	User,
	CreateUser,
	ViewUsers,
	ClearUsers,
	FindUser,
	UpdateUser,
	DeleteUser,
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
	let testUser: User[];
	let query: Query;

	beforeEach(() => {
		ClearUsers();
		testUser = [];
		query = { params: "", query: "" };
	});
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
		testUser = [
			{
				id: 1,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: Epica_ThePhantomAgony,
			},
		];
		CreateUser("Jim", "Bean", Epica_ThePhantomAgony);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return User Johnnie Walker's data when searched by its first name", () => {
		query = { params: "firstName", query: "Johnnie" };
		testUser = [
			{
				id: 1,
				firstName: "Johnnie",
				lastName: "Walker Black",
				birthDate: DT_TrainOfThought,
			},
		];
		CreateUser("Johnnie", "Walker Black", DT_TrainOfThought);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return Users Johnnie Walker Black & Johnnie Walker Green's data when searched by its first name", () => {
		query = { params: "firstName", query: "Johnnie" };
		testUser = [
			{
				id: 1,
				firstName: "Johnnie",
				lastName: "Walker Black",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 2,
				firstName: "Johnnie",
				lastName: "Walker Green",
				birthDate: Kamelot_Epica,
			},
		];
		CreateUser("Johnnie", "Walker Black", DT_TrainOfThought);
		CreateUser("Johnnie", "Walker Green", Kamelot_Epica);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return user Elijah Craig's data by searching by its last name", () => {
		query = { params: "lastName", query: "Craig" };
		testUser = [
			{
				id: 1,
				firstName: "Elijah",
				lastName: "Craig",
				birthDate: SX_Odyssey,
			},
		];
		CreateUser("Elijah", "Craig", SX_Odyssey);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return users Jose Cuervos' data when searching by their last names", () => {
		query = { params: "lastName", query: "Cuervo" };
		testUser = [
			{
				id: 1,
				firstName: "Jose",
				lastName: "Cuervo",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 2,
				firstName: "Jose",
				lastName: "Cuervo",
				birthDate: DM_WorldMisanthropy,
			},
		];
		CreateUser("Jose", "Cuervo", DT_TrainOfThought);
		CreateUser("Jose", "Cuervo", DM_WorldMisanthropy);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return User Jack Daniels' data by searching by its full name 'Jack Daniels'", () => {
		query = { params: "fullName", query: "Jack Daniels" };
		testUser = [
			{
				id: 1,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Epica_ThePhantomAgony,
			},
		];
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return all 3 Jack Daniels Users by searching by their full name", () => {
		query = { params: "fullName", query: "Jack Daniels" };
		testUser = [
			{
				id: 1,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Epica_ThePhantomAgony,
			},
			{
				id: 2,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: SX_Odyssey,
			},
			{
				id: 3,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: SX_Odyssey,
			},
		];
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		CreateUser("Jack", "Daniels", SX_Odyssey);
		CreateUser("Jack", "Daniels", SX_Odyssey);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return User Jose Cuervo's data when searched by his birthDate May 28, 2002", () => {
		query = { params: "birthDate", query: DM_WorldMisanthropy.toString() };
		testUser = [
			{
				id: 1,
				firstName: "Jose",
				lastName: "Cuervo",
				birthDate: DM_WorldMisanthropy,
			},
		];
		CreateUser("Jose", "Cuervo", DM_WorldMisanthropy);
		expect(FindUser(query)).toEqual(testUser);
	});
	it("Should return User Jim Bean & Jack Daniels data when search by their birthDate (24)", () => {
		query = { params: "birthDate", query: Epica_ThePhantomAgony.toString() };
		testUser = [
			{
				id: 1,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: Epica_ThePhantomAgony,
			},
			{
				id: 2,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Epica_ThePhantomAgony,
			},
		];
		CreateUser("Jim", "Bean", Epica_ThePhantomAgony);
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(FindUser(query)).toEqual(testUser);
	});
});

// TODO: review testing for transactions, or consider executing individual tasks
describe("UpdateUser modifies Users' data and returns their updated User data", () => {
	let oldData: User[];
	let newData: User[];
	let query: Query;

	beforeAll(() => {
		ClearUsers();
	});
	beforeEach(() => {
		ClearUsers();
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
				id: 1,
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
				id: 1,
				firstName: "Johnnie",
				lastName: "Walker Black",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 2,
				firstName: "Johnnie",
				lastName: "Walker Green",
				birthDate: Kamelot_Epica,
			},
			{
				id: 3,
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
				id: 1,
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
		// CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		// query = { params: "birthDate", query: Epica_ThePhantomAgony.toString() };
		// testUser = FindUser(query);

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
	let queries: Query[];
	let query: Query;

	beforeEach(() => {
		ClearUsers();
		queries = [];
		testUser = [];
		results = {
			success: [],
			failed: [],
			failedQueries: [],
			message: "",
		};
	});
	// // TODO: Review a way to handle missed bulk operations or how to return more descriptive messages.
	it("Should return not a valid Bulk operation error message when entered Bulk action remove with undefined queries", () => {
		queries = undefined;
		expect(() => {
			BulkOperation("remove", queries);
		}).toThrowError("remove is not a valid Bulk operation.");
	});
	it("Should return a Bulk operation cannot be performed. Please provide valid parameters error message when entered Bulk action delete with undefined queries", () => {
		queries = undefined;
		expect(() => {
			BulkOperation("delete", queries);
		}).toThrowError(
			"delete Bulk operation cannot be performed. Please provide valid parameters."
		);
	});
	it("Should return not a valid Bulk operation error message when entered Bulk action remove with empty queries array", () => {
		expect(() => {
			BulkOperation("remove", queries);
		}).toThrowError("remove is not a valid Bulk operation.");
	});
	it("Should return an empty message when entered Bulk action delete with an empty queries array", () => {
		results = {
			success: [],
			failed: [],
			failedQueries: [],
			message:
				"No Users could be deleted. Make sure Users exist or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User with full name Captain Morgan", () => {
		query = { params: "fullName", query: "Captain Morgan" };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with full name Captain Morgan could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User with first name Johnny! Walkers", () => {
		query = { params: "firstName", query: "Johnny! Walkers" };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with first name Johnny! Walkers could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User with last name – Pérignon", () => {
		query = { params: "lastName", query: "– Pérignon" };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with last name – Pérignon could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User with an invalid date of birth", () => {
		query = {
			params: "birthDate",
			query: new Date("I like turtles").toString(),
		};
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with invalid date of birth could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by first name when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		query = { params: "firstName", query: "Jack" };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with first name Jack could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by last name when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		query = { params: "lastName", query: "Daniels" };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with last name Daniels could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by full name when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		query = { params: "fullName", query: "Jack Daniels" };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with full name Jack Daniels could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by date of birth when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		const COB_Hatebreeder = new Date("1999-4-26");
		query = { params: "birthDate", query: COB_Hatebreeder.toString() };
		queries = queries.concat(query);
		testUser = FindUser(query);
		results = {
			success: [],
			failed: testUser,
			failedQueries: queries,
			message:
				"User with date of birth April 26 1999 could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
	it("Should delete 10 Users and fail to delete 3 non-existing users", () => {
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		CreateUser("Jim", "Bean", DT_TrainOfThought);
		CreateUser("Johnnie", "Walker", SX_Odyssey);
		CreateUser("Don", "Julio", DM_WorldMisanthropy);
		CreateUser("Jose", "Cuervo", Epica_ThePhantomAgony);
		CreateUser("Pappy", "van Winkle", DT_TrainOfThought);
		CreateUser("Johnnie", "Walker Black", SX_Odyssey);
		CreateUser("Johnnie", "Walker Blue", DM_WorldMisanthropy);
		CreateUser("Johnnie", "Walker Green", Epica_ThePhantomAgony);
		CreateUser("Bacardi", "Limon", SX_Odyssey);
		queries = queries.concat({ params: "firstName", query: "Jack" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "lastName", query: "Bean" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "firstName", query: "Johnnie" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "fullName", query: "Don Julio" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "lastName", query: "Cuervo" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "firstName", query: "Pappy" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "fullName", query: "Bacardi Limon" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		// failed users
		queries = queries.concat({ params: "fullName", query: "Don Pedro" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "lastName", query: "Regal" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		queries = queries.concat({ params: "firstName", query: "William" });
		testUser = testUser.concat(FindUser(queries[queries.length - 1]));
		results = {
			success: testUser,
			failed: [],
			failedQueries: [
				{ params: "fullName", query: "Don Pedro" },
				{ params: "lastName", query: "Regal" },
				{ params: "firstName", query: "William" },
			],
			message:
				"Successfully deleted 10 Users.\n" +
				"Users Jack Daniels & Jim Bean & Johnnie Walker & Johnnie Walker Black & Johnnie Walker Blue & Johnnie Walker Green & Don Julio & Jose Cuervo & Pappy van Winkle & Bacardi Limon were deleted.\n" +
				"Users with full name Don Pedro & last name Regal & first name William could not be deleted. Make sure Users exist or correct parameters are provided.",
		};
		expect(BulkOperation("delete", queries)).toEqual(results);
	});
});

// run tests with the "npx jest" commmand in the terminal
