import {
	User,
	CreateUser,
	ViewUsers,
	ClearUsers,
	FindUser,
	UpdateUser,
	DeleteUser,
	BulkResults,
	BulkOperation,
	Query,
	BulkParams,
} from "./api";

const DT_TrainOfThought: Date = new Date("2003-11-11");
const Kamelot_Epica: Date = new Date("2003-1-13");
const SX_Odyssey: Date = new Date("2002-11-5");
const Epica_ThePhantomAgony: Date = new Date("2003-6-5");
const DM_WorldMisanthropy: Date = new Date("2002-5-28");

describe("CreateUser creates users, adds them to the Users array and returns the created User", () => {
	let testUser: User;
	let testUsers: User[];
	beforeAll(() => {
		ClearUsers();
	});
	it("Should create User Jack Daniels and returns its id, firstname, lastname & birthDate", () => {
		testUser = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: DT_TrainOfThought,
		};
		expect(CreateUser("Jack", "Daniels", DT_TrainOfThought)).toEqual(testUser);
	});
	it("Should create User Jim Bean with a different ID than User Jack Daniels", () => {
		testUsers = ViewUsers();
		CreateUser("Jim", "Bean", Kamelot_Epica);
		expect(testUsers[0].id).not.toBe(testUsers[1].id);
	});
	it("Should return an error when an invalid parameter like an object is provided", () => {
		testUser = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: DT_TrainOfThought,
		};
		expect(() => {
			CreateUser(testUser.toString(), "name", DT_TrainOfThought);
		}).toThrowError(
			"User cannot be created with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
});

describe("ViewUsers returns a list of all created Users", () => {
	let testUsers: User[];
	beforeAll(() => {
		ClearUsers();
	});
	it("Should return an empty array when there are no created Users", () => {
		expect(ViewUsers()).toEqual([]);
	});
	it("Should return an array with Users Jack Daniels & Jim Bean's data", () => {
		testUsers = [
			{
				id: 1,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 2,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: Kamelot_Epica,
			},
		];
		CreateUser("Jack", "Daniels", DT_TrainOfThought);
		CreateUser("Jim", "Bean", Kamelot_Epica);
		expect(ViewUsers()).toEqual(testUsers);
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
				id: 1,
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
				id: 1,
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
				id: 1,
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
				id: 1,
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
	it("Should update and return 5 Users' information out of a total of 500 existing Users when searched by their IDs", () => {
		const COB_Hatebreeder = new Date("1999-4-26");
		for (let i: number = 0; i < 100; i++) {
			oldData.push(CreateUser("John", "Doe", DT_TrainOfThought));
			oldData.push(CreateUser("Jim", "Bean", Epica_ThePhantomAgony));
			oldData.push(CreateUser("Johnnie", "Walker", SX_Odyssey));
			oldData.push(CreateUser("Elijah", "Craig", DM_WorldMisanthropy));
			oldData.push(CreateUser("Jack", "Daniels", Kamelot_Epica));
		}
		newData = [
			{
				id: 69,
				firstName: "Don Julio",
				lastName: "Blanco",
				birthDate: COB_Hatebreeder,
			},
			{
				id: 130,
				firstName: "Ron Bacardi",
				lastName: "Limon",
				birthDate: COB_Hatebreeder,
			},
			{
				id: 223,
				firstName: "Tonayan",
				lastName: "Reposado",
				birthDate: COB_Hatebreeder,
			},
			{
				id: 312,
				firstName: "LA Cetto",
				lastName: "Cabernet Sauvignon",
				birthDate: COB_Hatebreeder,
			},
			{
				id: 487,
				firstName: "Jose Cuervo",
				lastName: "Tradicional Anejo",
				birthDate: COB_Hatebreeder,
			},
		];
		expect(UpdateUser(oldData, newData)).toEqual(newData);
	});
});

// TODO: review testing for transactions, or consider executing individual tasks
describe("DeleteUser removes Users from the Users array and returns the deleted Users's data", () => {
	let query: Query;
	let testUsers: User[];
	beforeAll(() => {
		ClearUsers();
	});
	beforeEach(() => {
		ClearUsers();
		query = { params: "", query: "" };
		testUsers = [];
	});
	it("Should return an empty array when User with full name Courvoisier VSOP is not found", () => {
		query = { params: "fullName", query: "Courvosier VSOP" };
		expect(DeleteUser(FindUser(query))).toEqual([]);
	});
	it("Should return an error when the user to be deleted contains an invalid first name", () => {
		testUsers = [
			{
				id: 1,
				firstName: "Remy –",
				lastName: "Martin",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(() => {
			DeleteUser(testUsers);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error when the user to be deleted contains an invalid last name", () => {
		testUsers = [
			{
				id: 1,
				firstName: "Remy",
				lastName: "Martin!",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(() => {
			DeleteUser(testUsers);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error when the user to be deleted contains an invalid date of birth", () => {
		testUsers = [
			{
				id: 1,
				firstName: "Remy",
				lastName: "Martin",
				birthDate: new Date("I like turtles"),
			},
		];
		expect(() => {
			DeleteUser(testUsers);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should return an error when the third user to be deleted contains an invalid last name", () => {
		testUsers = [
			{
				id: 1,
				firstName: "Dom",
				lastName: "Perignon",
				birthDate: SX_Odyssey,
			},
			{
				id: 2,
				firstName: "Glen",
				lastName: "Moray",
				birthDate: Epica_ThePhantomAgony,
			},
			{
				id: 3,
				firstName: "Bunnahabhain",
				lastName: "& Glenfiddich",
				birthDate: Kamelot_Epica,
			},
		];
		expect(() => {
			DeleteUser(testUsers);
		}).toThrowError(
			"User cannot be deleted with invalid parameters. Please provide a valid first name, last name & date of birth"
		);
	});
	it("Should delete User Jack Daniels when searching by its date of birth June 5th, 2003", () => {
		query = { params: "birthDate", query: Epica_ThePhantomAgony.toString() };
		testUsers = [
			{
				id: 1,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Epica_ThePhantomAgony,
			},
		];
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(DeleteUser(FindUser(query))).toEqual(testUsers);
	});
	it("Should delete User Jim Bean and when searching the remaining users it should return every User except Jim Bean", () => {
		query = { params: "fullName", query: "Jim Bean" };
		testUsers = [
			{
				id: 1,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Epica_ThePhantomAgony,
			},
			{
				id: 2,
				firstName: "Don Julio",
				lastName: "Reposado",
				birthDate: SX_Odyssey,
			},
			{
				id: 3,
				firstName: "Johnnie",
				lastName: "Walker Blue",
				birthDate: Kamelot_Epica,
			},
		];
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Reposado", SX_Odyssey);
		CreateUser("Johnnie", "Walker Blue", Kamelot_Epica);
		CreateUser("Jim", "Bean", DT_TrainOfThought);
		DeleteUser(FindUser(query));
		expect(ViewUsers()).toEqual(testUsers);
	});
	it("Should delete 5 Users when searching by their IDs out of a total 100 existing Users", () => {
		for (let i: number = 0; i < 100; i++) {
			CreateUser("John", "Doe", DT_TrainOfThought);
			CreateUser("Jim", "Bean", Epica_ThePhantomAgony);
			CreateUser("Johnnie", "Walker", SX_Odyssey);
			CreateUser("Elijah", "Craig", DM_WorldMisanthropy);
			CreateUser("Jack", "Daniels", Kamelot_Epica);
		}
		testUsers = [
			{
				id: 69,
				firstName: "John",
				lastName: "Doe",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 130,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: Epica_ThePhantomAgony,
			},
			{
				id: 223,
				firstName: "Johnnie",
				lastName: "Walker",
				birthDate: SX_Odyssey,
			},
			{
				id: 312,
				firstName: "Elijah",
				lastName: "Craig",
				birthDate: DM_WorldMisanthropy,
			},
			{
				id: 487,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Kamelot_Epica,
			},
		];
		expect(DeleteUser(testUsers)).toEqual(testUsers);
	});
});

describe("DeleteUsersBulk deletes a group of Users from the Users array and returns a message with the number of success and failed operations including the Users' data", () => {
	let searchingQuery: Query;
	let searchingQueries: Query[];
	let bulkParam: BulkParams;
	let parameters: BulkParams[];
	let testUser: User[];
	let results: BulkResults;

	beforeEach(() => {
		ClearUsers();
		searchingQuery = { params: "", query: "" };
		searchingQueries = [];
		bulkParam = {
			searchQuery: { params: "", query: "" },
			operationQueries: [],
		};
		parameters = [];
		testUser = [];
		results = {
			success: [],
			failed: [],
			successfulQueries: [],
			failedQueries: [],
			errors: [],
			message: "",
		};
	});
	it("Should return not a valid Bulk operation error message when entered Bulk action remove with undefined parameters", () => {
		expect(() => {
			BulkOperation("remove", undefined);
		}).toThrowError("remove is not a valid Bulk operation.");
	});
	it("Should return a Bulk operation cannot be performed. Please provide valid parameters error message when entered Bulk action delete with undefined parameters", () => {
		expect(() => {
			BulkOperation("delete", undefined);
		}).toThrowError(
			"delete Bulk operation cannot be performed. Please provide valid parameters."
		);
	});
	it("Should return not a valid Bulk operation error message when entered Bulk action remove with empty parameters array", () => {
		expect(() => {
			BulkOperation("remove", parameters);
		}).toThrowError("remove is not a valid Bulk operation.");
	});
	it("Should return an empty message when entered Bulk action delete with an empty parameters array", () => {
		parameters = [];
		results = {
			success: [],
			failed: [],
			successfulQueries: [],
			failedQueries: [],
			errors: [],
			message:
				"No Users could be deleted. Make sure Users exist or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User with full name Captain Morgan", () => {
		searchingQuery = { params: "fullName", query: "Captain Morgan" };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with full name Captain Morgan could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User with first name Johnny! Walkers", () => {
		searchingQuery = { params: "firstName", query: "Johnny! Walkers" };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with first name Johnny! Walkers could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User with last name – Pérignon", () => {
		searchingQuery = { params: "lastName", query: "– Pérignon" };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with last name – Pérignon could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User with an invalid date of birth", () => {
		searchingQuery = {
			params: "birthDate",
			query: new Date("I like turtles").toString(),
		};
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with invalid date of birth could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User with date of birth May 29, 2000", () => {
		const BraveNewWorld: Date = new Date("2000-5-29");
		searchingQuery = { params: "birthDate", query: BraveNewWorld.toString() };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with date of birth May 29 2000 could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by first name when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		searchingQuery = { params: "firstName", query: "Jack" };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with first name Jack could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by last name when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		searchingQuery = { params: "lastName", query: "Daniels" };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with last name Daniels could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by full name when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		searchingQuery = { params: "fullName", query: "Jack Daniels" };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with full name Jack Daniels could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
	it("Should fail to delete non-existing User Jack Daniels when searching by date of birth when there are multiple users registered", () => {
		CreateUser("Johnny", "Walker", Epica_ThePhantomAgony);
		CreateUser("Don Julio", "Blanco", SX_Odyssey);
		CreateUser("Jose", "Cuervo Tradicional", DT_TrainOfThought);
		CreateUser("Jim", "Bean", DM_WorldMisanthropy);
		CreateUser("Don", "Pedro", Kamelot_Epica);
		const COB_Hatebreeder = new Date("1999-4-26");
		searchingQuery = { params: "birthDate", query: COB_Hatebreeder.toString() };
		searchingQueries = searchingQueries.concat(searchingQuery);
		testUser = FindUser(searchingQuery);
		parameters = [
			{
				searchQuery: searchingQuery,
				operationQueries: [],
			},
		];
		results = {
			success: [],
			failed: testUser,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with date of birth April 26 1999 could not be deleted. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
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

		for (let i: number = 0; i < 100; i++) {
			CreateUser("John", "Doe", DT_TrainOfThought);
			CreateUser("Mike", "Jimenez", Epica_ThePhantomAgony);
			CreateUser("Anne", "Rice", SX_Odyssey);
			CreateUser("Patrick", "Stewart", DM_WorldMisanthropy);
			CreateUser("Victor", "Lemonte Wooten", Kamelot_Epica);
		}

		let queryArray: Query[] = [
			{ params: "firstName", query: "Jack" },
			{ params: "lastName", query: "Bean" },
			{ params: "firstName", query: "Johnnie" },
			{ params: "fullName", query: "Don Julio" },
			{ params: "lastName", query: "Cuervo" },
			{ params: "firstName", query: "Pappy" },
			{ params: "fullName", query: "Bacardi Limon" },
			// failed users
			{ params: "fullName", query: "Don Pedro" },
			{ params: "lastName", query: "Regal" },
			{ params: "firstName", query: "William" },
		];
		queryArray.forEach((item: Query) => {
			searchingQueries = searchingQueries.concat(item);
			testUser = testUser.concat(
				FindUser(searchingQueries[searchingQueries.length - 1])
			);
			bulkParam = {
				searchQuery: item,
				operationQueries: [],
			};
			parameters.push(bulkParam);
		});

		results = {
			success: testUser,
			failed: [],
			successfulQueries: [
				{
					searchQuery: { params: "firstName", query: "Jack" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "lastName", query: "Bean" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "firstName", query: "Johnnie" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "fullName", query: "Don Julio" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "lastName", query: "Cuervo" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "firstName", query: "Pappy" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "fullName", query: "Bacardi Limon" },
					operationQueries: [],
				},
			],
			failedQueries: [
				{
					searchQuery: { params: "fullName", query: "Don Pedro" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "lastName", query: "Regal" },
					operationQueries: [],
				},
				{
					searchQuery: { params: "firstName", query: "William" },
					operationQueries: [],
				},
			],
			errors: [],
			message:
				"Successfully deleted 10 Users.\n" +
				"Users Jack Daniels & Jim Bean & Johnnie Walker & Johnnie Walker Black & Johnnie Walker Blue & Johnnie Walker Green & Don Julio & Jose Cuervo & Pappy van Winkle & Bacardi Limon were deleted.\n" +
				"Users with full name Don Pedro & last name Regal & first name William could not be deleted. Make sure Users exist or correct parameters are provided.",
		};
		expect(BulkOperation("delete", parameters)).toEqual(results);
	});
});

describe("UpdateUsersBulk updates a group of Users from the Users array and returns a message with the number of success and failed operations includinf the Users' data", () => {
	let searchingQuery: Query;
	let operationalQueries: Query[];
	let bulkParam: BulkParams;
	let parameters: BulkParams[];
	let testUsers: User[];
	let results: BulkResults;

	beforeEach(() => {
		ClearUsers();
		searchingQuery = { params: "", query: "" };
		operationalQueries = [];
		bulkParam = {
			searchQuery: { params: "", query: "" },
			operationQueries: [],
		};
		parameters = [];
		testUsers = [];
		results = {
			success: [],
			failed: [],
			successfulQueries: [],
			failedQueries: [],
			errors: [],
			message: "",
		};
	});
	it("Should return a not valid Bulk operation error message when entered Bulk action change with undefined parameters", () => {
		expect(() => {
			BulkOperation("change", undefined);
		}).toThrowError("change is not a valid Bulk operation.");
	});
	it("Should return a Bulk operation cannot be performed. Please provide valid parameters error message when entered bulk action update with undefined parameters", () => {
		expect(() => {
			BulkOperation("update", undefined);
		}).toThrowError(
			"update Bulk operation cannot be performed. Please provide valid parameters."
		);
	});
	it("Should return not a valid Bulk operatoin error message when entered Bulk action change with empty parameters", () => {
		expect(() => {
			BulkOperation("change", parameters);
		}).toThrowError("change is not a valid Bulk operation.");
	});
	it("Should return an empty message when entered Bulk action update with empty parameters", () => {
		results = {
			success: [],
			failed: [],
			successfulQueries: [],
			failedQueries: [],
			errors: [],
			message:
				"No Users could be updated. Make sure Users exist or correct parameters are provided.",
		};
		expect(BulkOperation("update", parameters)).toEqual(results);
	});
	it("Should fail to update non-existing User with full name Evan Williams' non-existing nick name parameter", () => {
		searchingQuery = { params: "fullName", query: "Evan Williams" };
		operationalQueries = [{ params: "nickName", query: "100-proof" }];
		testUsers = FindUser(searchingQuery);
		bulkParam = {
			searchQuery: searchingQuery,
			operationQueries: operationalQueries,
		};
		parameters.push(bulkParam);
		results = {
			success: [],
			failed: testUsers,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with full name Evan Williams's nick name could not be updated to 100-proof. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("update", parameters)).toEqual(results);
	});

	it("Should fail to update non-existing User with full name Captain Morgan's first & last name", () => {
		searchingQuery = { params: "fullName", query: "Captain Morgan" };
		operationalQueries = [
			{
				params: "firstName",
				query: "Kraken",
			},
			{ params: "lastName", query: "Black" },
		];
		testUsers = FindUser(searchingQuery);
		bulkParam = {
			searchQuery: searchingQuery,
			operationQueries: operationalQueries,
		};
		parameters.push(bulkParam);
		results = {
			success: [],
			failed: testUsers,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with full name Captain Morgan's first name could not be updated to Kraken neither could the last name be updated to Black. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("update", parameters)).toEqual(results);
	});
	it("Should fail to update non-existing User with date of birth November 11, 2003 first & last name", () => {
		searchingQuery = {
			params: "birthDate",
			query: DT_TrainOfThought.toString(),
		};
		operationalQueries = [
			{ params: "firstName", query: "Lillet" },
			{ params: "lastName", query: "Blanc" },
		];
		testUsers = FindUser(searchingQuery);
		bulkParam = {
			searchQuery: searchingQuery,
			operationQueries: operationalQueries,
		};
		parameters.push(bulkParam);
		results = {
			success: [],
			failed: testUsers,
			successfulQueries: [],
			failedQueries: parameters,
			errors: [],
			message:
				"User with date of birth November 10 2003's first name could not be updated to Lillet neither could the last name be updated to Blanc. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("update", parameters)).toEqual(results);
	});
	it("Should fail to update User Ron Solera's non-existing parameter nick name and return a not a valid parameter error message", () => {
		CreateUser("Ron", "Solera", SX_Odyssey);
		searchingQuery = { params: "firstName", query: "Ron" };
		operationalQueries = [
			{
				params: "nickName",
				query: "Dorado 1873",
			},
		];
		testUsers = FindUser(searchingQuery);
		bulkParam = {
			searchQuery: searchingQuery,
			operationQueries: operationalQueries,
		};
		parameters.push(bulkParam);
		results = {
			success: [],
			failed: testUsers,
			successfulQueries: parameters,
			failedQueries: [],
			errors: [
				{
					bulkItem: {
						searchQuery: searchingQuery,
						operationQueries: operationalQueries,
					},
					message:
						"User with first name Ron does not have a nickName. Please provide valid parameters.",
				},
			],
			message:
				"User with first name Ron's nick name could not be updated to Dorado 1873. Make sure User exists or correct parameters are provided.",
		};
		expect(BulkOperation("update", parameters)).toEqual(results);
	});
	it("Should update User Jack Daniel's information and return the updated info", () => {
		for (let i: number = 0; i < 100; i++) {
			CreateUser("John", "Doe", DT_TrainOfThought);
			CreateUser("Mike", "Jimenez", Epica_ThePhantomAgony);
			CreateUser("Anne", "Rice", SX_Odyssey);
			CreateUser("Patrick", "Stewart", DM_WorldMisanthropy);
			CreateUser("Victor", "Lemonte Wooten", Kamelot_Epica);
		}
		CreateUser("Jack", "Daniels", Kamelot_Epica);

		searchingQuery = {
			params: "fullName",
			query: "Jack Daniels",
		};
		operationalQueries = [
			{ params: "firstName", query: "Mr. Jack" },
			{ params: "lastName", query: "Daniels Sr." },
		];
		testUsers = FindUser(searchingQuery);
		bulkParam = {
			searchQuery: searchingQuery,
			operationQueries: operationalQueries,
		};
		parameters.push(bulkParam);
		results = {
			success: testUsers,
			failed: [],
			successfulQueries: parameters,
			failedQueries: [],
			errors: [],
			message:
				"Successfully updated 1 User.\n" +
				"User with full name Jack Daniels's first name was updated to Mr. Jack & last name was updated to Daniels Sr..\n",
		};
		expect(BulkOperation("update", parameters)).toEqual(results);
	});
});

// run tests with the "npx jest" commmand in the terminal
