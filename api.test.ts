import { CreateUser, ViewUsers, ClearUsers, FindUser } from "./api";

describe("CreateUser creates users, adds them to the Users array and returns the created User", () => {
	beforeAll(() => {
		ClearUsers();
	});
	it("Should create User Jack Daniels and returns its id, firstname, lastname & age", () => {
		expect(CreateUser("Jack", "Daniels", 20)).toEqual({
			id: 1,
			firstName: "Jack",
			lastName: "Daniels",
			age: 20,
		});
	});
	it("Should create User Jim Bean with a different ID than User Jack Daniels", () => {
		CreateUser("Jim", "Bean", 22);
		let Users = ViewUsers();
		expect(Users[0].id).not.toBe(Users[1].id);
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
		CreateUser("Jack", "Daniels", 21);
		CreateUser("Jim", "Bean", 33);
		expect(ViewUsers()).toEqual([
			{
				id: 1,
				firstName: "Jack",
				lastName: "Daniels",
				age: 21,
			},
			{
				id: 2,
				firstName: "Jim",
				lastName: "Bean",
				age: 33,
			},
		]);
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
	it("Should return an empty array when no User is found with age 100", () => {
		expect(FindUser("age", "100")).toEqual([]);
	});
	it("Should return an Error when the Search Parameter is Alias or anything unknown", () => {
		expect(() => {
			FindUser("alias", "Gentleman");
		}).toThrowError("alias is not a valid search parameter");
	});
	it("Should return User Jim Bean's data when searched by its ID", () => {
		CreateUser("Jim", "Bean", 24);
		expect(FindUser("id", "1")).toEqual([
			{
				id: 1,
				firstName: "Jim",
				lastName: "Bean",
				age: 24,
			},
		]);
	});
	it("Should return User Johnnie Walker's data when searched by its first name", () => {
		CreateUser("Johnnie", "Walker Black", 22);
		expect(FindUser("firstName", "Johnnie")).toEqual([
			{
				id: 2,
				firstName: "Johnnie",
				lastName: "Walker Black",
				age: 22,
			},
		]);
	});
	it("Should return Users Johnnie Walker Black & Johnnie Walker Green's data when searched by its first name", () => {
		CreateUser("Johnnie", "Walker Green", 23);
		expect(FindUser("firstName", "Johnnie")).toEqual([
			{
				id: 2,
				firstName: "Johnnie",
				lastName: "Walker Black",
				age: 22,
			},
			{
				id: 3,
				firstName: "Johnnie",
				lastName: "Walker Green",
				age: 23,
			},
		]);
	});
	it("Should return user Elijah Craig's data by searching by its last name", () => {
		CreateUser("Elijah", "Craig", 25);
		expect(FindUser("lastName", "Craig")).toEqual([
			{
				id: 4,
				firstName: "Elijah",
				lastName: "Craig",
				age: 25,
			},
		]);
	});
	it("Should return users Jose Cuervo's data when searching by its last names", () => {
		CreateUser("Jose", "Cuervo", 26);
		CreateUser("Jose", "Cuervo", 27);
		expect(FindUser("lastName", "Cuervo")).toEqual([
			{
				id: 5,
				firstName: "Jose",
				lastName: "Cuervo",
				age: 26,
			},
			{
				id: 6,
				firstName: "Jose",
				lastName: "Cuervo",
				age: 27,
			}
		]);
	});
	it("Should return User Jack Daniels' data by searching by its full name 'Jack Daniels'", () => {
		CreateUser("Jack", "Daniels", 24);
		expect(FindUser("fullName", "Jack Daniels")).toEqual([
			{
				id: 7,
				firstName: "Jack",
				lastName: "Daniels",
				age: 24,
			},
		]);
	});
	it("Should return all 3 Users with by searching by the full name Jack Daniels", () => {
		CreateUser("Jack", "Daniels", 28);
		CreateUser("Jack", "Daniels", 29);
		expect(FindUser("fullName", "Jack Daniels")).toEqual([
			{
				id: 7,
				firstName: "Jack",
				lastName: "Daniels",
				age: 24,
			},
			{
				id: 8,
				firstName: "Jack",
				lastName: "Daniels",
				age: 28,
			},
			{
				id: 9,
				firstName: "Jack",
				lastName: "Daniels",
				age: 29,
			},
		]);
	});
	it("Should return User Jose Cuervo's data when searched by its age of 27", () => {
		expect(FindUser("age", "27")).toEqual([
			{
				id: 6,
				firstName: "Jose",
				lastName: "Cuervo",
				age: 27,
			}
		]);
	});
	it("Should return User Jim Bean & Jack Daniels data when search by its age of 24", () => {
		expect(FindUser("age", "24")).toEqual([
			{
				id: 1,
				firstName: "Jim",
				lastName: "Bean",
				age: 24,
			},
			{
				id: 7,
				firstName: "Jack",
				lastName: "Daniels",
				age: 24,
			}
		]);
	});
});

// describe("UpdateUser modifies User's data and returns the updated User", () => {
// 	beforeAll(() => {
// 		ClearUsers();
// 	});
// 	it("Should change User Jack Daniels' age from 20 to 21 and return its updated User object", () => {
// 		CreateUser("Jack", "Daniels", 20);
// 		UpdateUser(FindUser("fullName", "Jack Daniels")[0].id, ["age"], ["21"]).toEqual({
// 			id: 1,
// 			firstName: "Jack",
// 			lastName: "Daniels",
// 			age: 21,
// 		});
// 	});
// });

// run tests with the "npx jest" commmand in the terminal
