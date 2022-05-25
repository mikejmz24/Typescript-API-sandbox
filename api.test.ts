import {
	User,
	CreateUser,
	ViewUsers,
	ClearUsers,
	FindUser,
	UpdateUser,
	DeleteUser,
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
	it("Should return an error when an invalid parameter is enter such as an object", () => {
		const testUser1: User = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: DT_TrainOfThought,
		};
		expect(() => {
			CreateUser(testUser1.toString(), "name", DT_TrainOfThought);
		}).toThrowError(
			"User cannot be created with invalid parameters. Please provide first name, last name & date of birth"
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
	it("Should return and empty array when when no User is found with id 10", () => {
		expect(FindUser("id", "10")).toEqual([]);
	});
	it("Should return an empty array when User Don Julio is not found by searching by its first name", () => {
		expect(FindUser("firstName", "Don Julio")).toEqual([]);
	});
	it("Should return an empty array when User Elijah Craig is not found by searching by its last name", () => {
		expect(FindUser("lastName", "Craig")).toEqual([]);
	});
	it("Should return an empty array when User Jim Bean is not found by searching by its full name", () => {
		expect(FindUser("fullName", "Jim Bean")).toEqual([]);
	});
	it("Should return an empty array when no User is found with date of birth June 5, 2003", () => {
		expect(FindUser("birthDate", Epica_ThePhantomAgony.toString())).toEqual([]);
	});
	it("Should return an Error when the Search Parameter is Alias or anything unknown", () => {
		expect(() => {
			FindUser("alias", "Gentleman");
		}).toThrowError("alias is not a valid search parameter");
	});
	it("Should return User Jim Bean's data when searched by its ID", () => {
		const testUser1: User = {
			id: 1,
			firstName: "Jim",
			lastName: "Bean",
			birthDate: Epica_ThePhantomAgony,
		};
		CreateUser("Jim", "Bean", Epica_ThePhantomAgony);
		expect(FindUser("id", "1")).toEqual([testUser1]);
	});
	it("Should return User Johnnie Walker's data when searched by its first name", () => {
		const testUser2: User = {
			id: 2,
			firstName: "Johnnie",
			lastName: "Walker Black",
			birthDate: DT_TrainOfThought,
		};
		CreateUser("Johnnie", "Walker Black", DT_TrainOfThought);
		expect(FindUser("firstName", "Johnnie")).toEqual([testUser2]);
	});
	it("Should return Users Johnnie Walker Black & Johnnie Walker Green's data when searched by its first name", () => {
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
		expect(FindUser("firstName", "Johnnie")).toEqual([testUser2, testUser3]);
	});
	it("Should return user Elijah Craig's data by searching by its last name", () => {
		const testUser4: User = {
			id: 4,
			firstName: "Elijah",
			lastName: "Craig",
			birthDate: SX_Odyssey,
		};
		CreateUser("Elijah", "Craig", SX_Odyssey);
		expect(FindUser("lastName", "Craig")).toEqual([testUser4]);
	});
	it("Should return users Jose Cuervos' data when searching by their last names", () => {
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
		expect(FindUser("lastName", "Cuervo")).toEqual([testUser5, testUser6]);
	});
	it("Should return User Jack Daniels' data by searching by its full name 'Jack Daniels'", () => {
		const testUser7 = {
			id: 7,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(FindUser("fullName", "Jack Daniels")).toEqual([testUser7]);
	});
	it("Should return all 3 Jack Daniels Users by searching by their full name", () => {
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
		expect(FindUser("fullName", "Jack Daniels")).toEqual([
			testUser7,
			testUser8,
			testUser9,
		]);
	});
	it("Should return User Jose Cuervo's data when searched by his birthDate May 28, 2002", () => {
		const testUser6 = {
			id: 6,
			firstName: "Jose",
			lastName: "Cuervo",
			birthDate: DM_WorldMisanthropy,
		};
		expect(FindUser("birthDate", DM_WorldMisanthropy.toString())).toEqual([
			testUser6,
		]);
	});
	it("Should return User Jim Bean & Jack Daniels data when search by their birthDate (24)", () => {
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
		expect(FindUser("birthDate", Epica_ThePhantomAgony.toString())).toEqual([
			testUser1,
			testUser7,
		]);
	});
});

describe("UpdateUser modifies Users' data and returns their updated User data", () => {
	beforeAll(() => {
		ClearUsers();
	});
	let oldData: User[] = [];
	let newData: User[] = [];
	beforeEach(() => {
		oldData = [];
		newData = [];
	});
	it("Should return an empty array if no User data is provided to update", () => {
		expect(UpdateUser(oldData, newData)).toEqual([]);
	});
	// it("Should return an empty array if the old User data provided does not exist in the Users array", () => {
	// 	oldData = [
	// 		{
	// 			id: 1,
	// 			firstName: "Pappy",
	// 			lastName: "Van Winkle",
	// 			birthDate: DT_TrainOfThought,
	// 		},
	// 	];
	// 	expect(UpdateUser(oldData, newData)).toEqual([]);
	// });
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
				id: 2,
				firstName: "Johnnie",
				lastName: "Walker Black",
				birthDate: DT_TrainOfThought,
			},
			{
				id: 3,
				firstName: "Johnnie",
				lastName: "Walker Green",
				birthDate: Kamelot_Epica,
			},
			{
				id: 4,
				firstName: "Johnnie",
				lastName: "Walker Blue",
				birthDate: SX_Odyssey,
			},
		];
		expect(UpdateUser(oldData, newData)).toEqual(newData);
	});
	it("Should find User Bacardi Limon by its full name and update its lastname to Blanco", () => {
		oldData.push(CreateUser("Bacardi", "Limon", DT_TrainOfThought));
		newData = [
			{
				id: 5,
				firstName: "Bacardi",
				lastName: "Blanco",
				birthDate: DT_TrainOfThought,
			},
		];
		expect(UpdateUser(FindUser("fullName", "Bacardi Limon"), newData)).toEqual(
			newData
		);
	});
});

describe("DeleteUser removes Users from the Users array and returns the deleted Users's data", () => {
	beforeAll(() => {
		ClearUsers();
	});
	it("Should return an empty array when User with full name Courvoisier VSOP is not found", () => {
		expect(DeleteUser(FindUser("fullName", "Courvosier VSOP"))).toEqual([]);
	});
	it("Should delete User Jack Daniels when searching by its date of birth June 5th, 2003", () => {
		const testUser1 = {
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			birthDate: Epica_ThePhantomAgony,
		};
		CreateUser("Jack", "Daniels", Epica_ThePhantomAgony);
		expect(
			DeleteUser(FindUser("birthDate", Epica_ThePhantomAgony.toString()))
		).toEqual([testUser1]);
	});
	it("Should delete User Jim Bean and when searching the remaining users it should return every User except Jim Bean", () => {
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
		DeleteUser(FindUser("fullName", "Jim Bean"));
		expect(ViewUsers()).toEqual([testUser2, testUser3, testUser4]);
	});
});

// run tests with the "npx jest" commmand in the terminal
