import { User } from "../src/api";
import { BulkParamsV3, bulkMessage } from "../src/bulkMessageV3";

describe("bulkMessage returns a descriptive message of the bulk operation performed including success, fails and errors", () => {
	let results: BulkParamsV3[] = [];
	let operation: string = "";
	let message: string = "";

	beforeEach(() => {
		results = [];
		operation = "";
		message = "";
	});
	it("Should return an empty message when no results provided", () => {
		message = "";
		results = [];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
});

describe("Success message suite", () => {
	let results: BulkParamsV3[] = [];
	let operation: string = "";
	let message: string = "";
	const Donkey_Kong_Country: Date = new Date("1994-11-21");

	beforeEach(() => {
		results = [];
		operation = "";
		message = "";
	});
	it("Should return delete success message for 1 User", () => {
		message =
			"Successfully deleted 1 User:\n" +
			"The following User was deleted:\n" +
			"\tID 12 Jack Daniels.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [
					{
						id: 12,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: Donkey_Kong_Country,
					},
				],
			},
		];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return update success message for 1 User", () => {
		message =
			"Successfully updated 1 User:\n" +
			"The following User was updated:\n" +
			"\tUser with full name Wild Turkey had the following fields updated:\n" +
			"\t\tUser ID 112 Wild Turkey's first name was updated to Wylde.\n" +
			"\t\tUser ID 112 Wild Turkey's last name was updated to Turk.\n" +
			"\t\tUser ID 112 Wild Turkey's date of birth was updated to September 19 2003.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Wild Turkey" },
				operationalQueries: [
					{ params: "firstName", query: "Wylde" },
					{ params: "lastName", query: "Turk" },
					{ params: "birthDate", query: new Date("2003-9-19").toString() },
				],
				users: [
					{
						id: 112,
						firstName: "Wild",
						lastName: "Turkey",
						birthDate: Donkey_Kong_Country,
					},
				],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return delete success message for 45 Users", () => {
		message =
			"Successfully deleted 45 Users:\n" +
			"The following Users were deleted:\n" +
			"\tID 1 Jack Daniels.\n" +
			"\tID 2 Jack Daniels.\n" +
			"\tID 3 Jack Daniels.\n" +
			"\tID 4 Jack Daniels.\n" +
			"\tID 5 Jack Daniels.\n" +
			"\tID 6 Jack Daniels.\n" +
			"\tID 7 Jack Daniels.\n" +
			"\tID 8 Jack Daniels.\n" +
			"\tID 9 Jack Daniels.\n" +
			"\tID 10 Jack Daniels.\n" +
			"\tID 11 Jack Daniels.\n" +
			"\tID 12 Jack Daniels.\n" +
			"\tID 13 Jack Daniels.\n" +
			"\tID 14 Jack Daniels.\n" +
			"\tID 15 Jack Daniels.\n" +
			"\tID 16 Jim Bean.\n" +
			"\tID 17 Jim Bean.\n" +
			"\tID 18 Jim Bean.\n" +
			"\tID 19 Jim Bean.\n" +
			"\tID 20 Jim Bean.\n" +
			"\tID 21 Jim Bean.\n" +
			"\tID 22 Jim Bean.\n" +
			"\tID 23 Jim Bean.\n" +
			"\tID 24 Jim Bean.\n" +
			"\tID 25 Jim Bean.\n" +
			"\tID 26 Jim Bean.\n" +
			"\tID 27 Jim Bean.\n" +
			"\tID 28 Jim Bean.\n" +
			"\tID 29 Jim Bean.\n" +
			"\tID 30 Jim Bean.\n" +
			"\tID 31 Johnny Walker.\n" +
			"\tID 32 Johnny Walker.\n" +
			"\tID 33 Johnny Walker.\n" +
			"\tID 34 Johnny Walker.\n" +
			"\tID 35 Johnny Walker.\n" +
			"\tID 36 Johnny Walker.\n" +
			"\tID 37 Johnny Walker.\n" +
			"\tID 38 Johnny Walker.\n" +
			"\tID 39 Johnny Walker.\n" +
			"\tID 40 Johnny Walker.\n" +
			"\tID 41 Johnny Walker.\n" +
			"\tID 42 Johnny Walker.\n" +
			"\tID 43 Johnny Walker.\n" +
			"\tID 44 Johnny Walker.\n" +
			"\tID 45 Johnny Walker.\n";

		let userArray: User[] = [];

		for (let i: number = 1; i < 16; i++) {
			userArray.push({
				id: i,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Donkey_Kong_Country,
			});
		}
		results.push({
			type: "success",
			searchQuery: { params: "fullName", query: "Jack Daniels" },
			operationalQueries: [],
			users: userArray,
		});
		userArray = [];

		for (let i: number = 16; i < 31; i++) {
			userArray.push({
				id: i,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: Donkey_Kong_Country,
			});
		}
		results.push({
			type: "success",
			searchQuery: { params: "fullName", query: "Jim Bean" },
			operationalQueries: [],
			users: userArray,
		});
		userArray = [];

		for (let i: number = 31; i < 46; i++) {
			userArray.push({
				id: i,
				firstName: "Johnny",
				lastName: "Walker",
				birthDate: Donkey_Kong_Country,
			});
		}
		results.push({
			type: "success",
			searchQuery: { params: "fullName", query: "Johnny Walker" },
			operationalQueries: [],
			users: userArray,
		});
		userArray = [];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return an update success message for 3 queries with 4 Users each", () => {
		message =
			"Successfully updated 12 Users:\n" +
			"The following Users were updated:\n" +
			"\tUsers with full name Jack Daniels had the following fields updated:\n" +
			"\t\tUser ID 1 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 1 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 1 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\t\tUser ID 11 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 11 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 11 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\t\tUser ID 111 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 111 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 111 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\t\tUser ID 1111 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 1111 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 1111 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\tUsers with date of birth September 12 1977 had the following fields updated:\n" +
			"\t\tUser ID 2 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 2 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 2 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\t\tUser ID 22 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 22 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 22 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\t\tUser ID 222 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 222 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 222 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\t\tUser ID 2222 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 2222 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 2222 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\tUsers with last name Harris had the following fields updated:\n" +
			"\t\tUser ID 3 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 3 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 3 Steve Harris's date of birth was updated to April 14 1980.\n" +
			"\t\tUser ID 33 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 33 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 33 Steve Harris's date of birth was updated to April 14 1980.\n" +
			"\t\tUser ID 333 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 333 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 333 Steve Harris's date of birth was updated to April 14 1980.\n" +
			"\t\tUser ID 3333 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 3333 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 3333 Steve Harris's date of birth was updated to April 14 1980.\n";

		let userArray: User[] = [];
		for (let i: number = 1; i < 1112; i = i * 10 + 1) {
			userArray.push({
				id: i,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: new Date("1999-1-1"),
			});
		}
		results.push({
			type: "success",
			searchQuery: {
				params: "fullName",
				query: "Jack Daniels",
			},
			operationalQueries: [
				{ params: "firstName", query: "Gentleman Jack" },
				{ params: "lastName", query: "Reserved" },
				{ params: "birthDate", query: new Date("1998-9-30").toString() },
			],
			users: userArray,
		});
		userArray = [];
		for (let i: number = 2; i < 2223; i = i * 10 + 2) {
			userArray.push({
				id: i,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: new Date("1999-01-01"),
			});
		}
		results.push({
			type: "success",
			searchQuery: {
				params: "birthDate",
				query: new Date("1977-9-12").toString(),
			},
			operationalQueries: [
				{ params: "firstName", query: "James" },
				{ params: "lastName", query: "McCallister" },
				{ params: "birthDate", query: new Date("1989-11-2").toString() },
			],
			users: userArray,
		});
		userArray = [];
		for (let i: number = 3; i < 3334; i = i * 10 + 3) {
			userArray.push({
				id: i,
				firstName: "Steve",
				lastName: "Harris",
				birthDate: new Date("1999-01-01"),
			});
		}
		results.push({
			type: "success",
			searchQuery: {
				params: "lastName",
				query: "Harris",
			},
			operationalQueries: [
				{ params: "firstName", query: "Eddie" },
				{ params: "lastName", query: "T Head" },
				{ params: "birthDate", query: new Date("1980-4-14").toString() },
			],
			users: userArray,
		});
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return update success message for 10 Users", () => {
		message =
			"Successfully updated 10 Users:\n" +
			"The following Users were updated:\n" +
			"\tUser with full name Jim Bean had the following fields updated:\n" +
			"\t\tUser ID 1 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 1 Jim Bean's last name was updated to Bean Jr.\n" +
			"\tUsers with first name Julio had the following field updated:\n" +
			"\t\tUser ID 2 Julio Limon's first name was updated to Don Julio.\n" +
			"\t\tUser ID 23 Julio Bacardi's first name was updated to Don Julio.\n" +
			"\tUser with last name Walker had the following fields updated:\n" +
			"\t\tUser ID 3 John Walker's first name was updated to Johnnie.\n" +
			"\t\tUser ID 3 John Walker's last name was updated to Walker Green.\n" +
			"\tUser with date of birth October 25 1999 had the following fields updated:\n" +
			"\t\tUser ID 4 Jose Cuervo's first name was updated to Jose.\n" +
			"\t\tUser ID 4 Jose Cuervo's last name was updated to Cuervo.\n" +
			"\t\tUser ID 4 Jose Cuervo's date of birth was updated to October 26 1999.\n" +
			"\tUser with full name Jack Daniels had the following fields updated:\n" +
			"\t\tUser ID 5 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 5 Jack Daniels's last name was updated to Daniels Reserved.\n" +
			"\tUser with first name Captain had the following field updated:\n" +
			"\t\tUser ID 6 Captain Morgan's first name was updated to Comodore.\n" +
			"\tUser with last name Buchannan had the following fields updated:\n" +
			"\t\tUser ID 7 James Buchannan's first name was updated to William.\n" +
			"\t\tUser ID 7 James Buchannan's last name was updated to Lawson.\n" +
			"\tUser with last name Regal had the following fields updated:\n" +
			"\t\tUser ID 8 Chivas Regal's first name was updated to Royal.\n" +
			"\t\tUser ID 8 Chivas Regal's last name was updated to Salute.\n" +
			"\tUser with date of birth August 31 2002 had the following fields updated:\n" +
			"\t\tUser ID 9 Courvoisier VS's first name was updated to Courvoisier.\n" +
			"\t\tUser ID 9 Courvoisier VS's last name was updated to XO.\n" +
			"\t\tUser ID 9 Courvoisier VS's date of birth was updated to November 20 1988.\n";
		results = [
			{
				type: "success",
				searchQuery: {
					params: "fullName",
					query: "Jim Bean",
				},
				operationalQueries: [
					{ params: "firstName", query: "James" },
					{ params: "lastName", query: "Bean Jr" },
				],
				users: [
					{
						id: 1,
						firstName: "Jim",
						lastName: "Bean",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "firstName",
					query: "Julio",
				},
				operationalQueries: [{ params: "firstName", query: "Don Julio" }],
				users: [
					{
						id: 2,
						firstName: "Julio",
						lastName: "Limon",
						birthDate: new Date("1999-01-01"),
					},
					{
						id: 23,
						firstName: "Julio",
						lastName: "Bacardi",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "lastName",
					query: "Walker",
				},
				operationalQueries: [
					{ params: "firstName", query: "Johnnie" },
					{ params: "lastName", query: "Walker Green" },
				],
				users: [
					{
						id: 3,
						firstName: "John",
						lastName: "Walker",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "birthDate",
					query: new Date("1999-10-26").toString(),
				},
				operationalQueries: [
					{ params: "firstName", query: "Jose" },
					{ params: "lastName", query: "Cuervo" },
					{ params: "birthDate", query: new Date("1999-10-27").toString() },
				],
				users: [
					{
						id: 4,
						firstName: "Jose",
						lastName: "Cuervo",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "fullName",
					query: "Jack Daniels",
				},
				operationalQueries: [
					{ params: "firstName", query: "Gentleman Jack" },
					{ params: "lastName", query: "Daniels Reserved" },
				],
				users: [
					{
						id: 5,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "firstName",
					query: "Captain",
				},
				operationalQueries: [{ params: "firstName", query: "Comodore" }],
				users: [
					{
						id: 6,
						firstName: "Captain",
						lastName: "Morgan",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "lastName",
					query: "Buchannan",
				},
				operationalQueries: [
					{ params: "firstName", query: "William" },
					{ params: "lastName", query: "Lawson" },
				],
				users: [
					{
						id: 7,
						firstName: "James",
						lastName: "Buchannan",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "lastName",
					query: "Regal",
				},
				operationalQueries: [
					{ params: "firstName", query: "Royal" },
					{ params: "lastName", query: "Salute" },
				],
				users: [
					{
						id: 8,
						firstName: "Chivas",
						lastName: "Regal",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "birthDate",
					query: new Date("2002-8-31").toString(),
				},
				operationalQueries: [
					{ params: "firstName", query: "Courvoisier" },
					{ params: "lastName", query: "XO" },
					{ params: "birthDate", query: new Date("1988-11-21").toString() },
				],
				users: [
					{
						id: 9,
						firstName: "Courvoisier",
						lastName: "VS",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
});
describe("Fail message suite", () => {
	let results: BulkParamsV3[] = [];
	let operation: string = "";
	let message: string = "";

	beforeEach(() => {
		results = [];
		operation = "";
		message = "";
	});
	it("Should return a failed delete message for 1 User", () => {
		message =
			"The following User could not be deleted:\n" +
			"\tUser with full name James Buchannan.\n";
		results = [
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "James Buchannan" },
				operationalQueries: [],
				users: [],
			},
		];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a failed delete message for 4 Users", () => {
		message =
			"The following Users could not be deleted:\n" +
			"\tUser with full name James Buchannan.\n" +
			"\tUser with first name Jim.\n" +
			"\tUser with last name Glenfiddich.\n" +
			"\tUser with date of birth June 10 1990.\n";
		results = [
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "James Buchannan" },
				operationalQueries: [],
				users: [],
			},
			{
				type: "fail",
				searchQuery: { params: "firstName", query: "Jim" },
				operationalQueries: [],
				users: [],
			},
			{
				type: "fail",
				searchQuery: { params: "lastName", query: "Glenfiddich" },
				operationalQueries: [],
				users: [],
			},
			{
				type: "fail",
				searchQuery: {
					params: "birthDate",
					query: new Date("1990-6-10").toString(),
				},
				operationalQueries: [],
				users: [],
			},
		];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a failed update message for 1 User", () => {
		message =
			"The following User could not be updated:\n" +
			"\tUser with full name Jose Cuervo had the following incident:\n" +
			"\t\tdate of birth could not be updated to January 23 1989.\n";
		results = [
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Jose Cuervo" },
				operationalQueries: [
					{ params: "birthDate", query: new Date("1989-1-23").toString() },
				],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a failed update message for 4 Users", () => {
		message =
			"The following Users could not be updated:\n" +
			"\tUser with full name Jose Cuervo had the following incidents:\n" +
			"\t\tfirst name could not be updated to Don.\n" +
			"\t\tlast name could not be updated to Julio.\n" +
			"\tUser with first name Jack had the following incident:\n" +
			"\t\tfirst name could not be updated to Jackinton.\n" +
			"\tUser with last name Morgan had the following incident:\n" +
			"\t\tlast name could not be updated to Kraken.\n" +
			"\tUser with date of birth September 10 1999 had the following incident:\n" +
			"\t\tdate of birth could not be updated to July 17 1998.\n";
		results = [
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Jose Cuervo" },
				operationalQueries: [
					{ params: "firstName", query: "Don" },
					{ params: "lastName", query: "Julio" },
				],
				users: [],
			},
			{
				type: "fail",
				searchQuery: { params: "firstName", query: "Jack" },
				operationalQueries: [{ params: "firstName", query: "Jackinton" }],
				users: [],
			},
			{
				type: "fail",
				searchQuery: { params: "lastName", query: "Morgan" },
				operationalQueries: [{ params: "lastName", query: "Kraken" }],
				users: [],
			},
			{
				type: "fail",
				searchQuery: {
					params: "birthDate",
					query: new Date("1999-9-10").toString(),
				},
				operationalQueries: [
					{ params: "birthDate", query: new Date("1998-7-17").toString() },
				],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
});
describe("Error message suite", () => {
	let results: BulkParamsV3[] = [];
	let operation: string = "";
	let message: string = "";

	beforeEach(() => {
		results = [];
		operation = "";
		message = "";
	});
	it("Should return an error message for 1 User", () => {
		message =
			"The following User could not be updated:\n" +
			"\tUser with full name Jim Bean does not have the following field:\n" +
			"\t\tNumber of Distilleries.\n";
		results = [
			{
				type: "error",
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationalQueries: [{ params: "Number of Distilleries", query: "12" }],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return an error message for 4 Users", () => {
		message =
			"The following Users could not be updated:\n" +
			"\tUser with full name Jim Bean does not have the following fields:\n" +
			"\t\tNumber of pets.\n" +
			"\t\tNumber of children.\n" +
			"\tUser with first name Jack does not have the following field:\n" +
			"\t\tFavorite color.\n" +
			"\tUser with last name Rittenhouse does not have the following field:\n" +
			"\t\tTeam alliance.\n" +
			"\tUser with date of birth March 10 1973 does not have the following field:\n" +
			"\t\tYears of service.\n";
		results = [
			{
				type: "error",
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationalQueries: [
					{ params: "Number of pets", query: "2" },
					{ params: "Number of children", query: "0" },
				],
				users: [],
			},
			{
				type: "error",
				searchQuery: { params: "firstName", query: "Jack" },
				operationalQueries: [{ params: "Favorite color", query: "Green" }],
				users: [],
			},
			{
				type: "error",
				searchQuery: { params: "lastName", query: "Rittenhouse" },
				operationalQueries: [
					{ params: "Team alliance", query: "Pittsburgh Steelers" },
				],
				users: [],
			},
			{
				type: "error",
				searchQuery: {
					params: "birthDate",
					query: new Date("1973-3-10").toString(),
				},
				operationalQueries: [{ params: "Years of service", query: "43" }],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
});
describe("Full test, Success + Fail + Error integration suite", () => {
	let results: BulkParamsV3[] = [];
	let operation: string = "";
	let message: string = "";

	beforeEach(() => {
		results = [];
		operation = "";
		message = "";
	});
	it("Should return a success delete message for 1 User and a fail delete message for 1 User", () => {
		message =
			"Successfully deleted 1 User:\n" +
			"The following User was deleted:\n" +
			"\tID 1 Jack Daniels.\n" +
			"The following User could not be deleted:\n" +
			"\tUser with full name Chivas Regal.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [
					{
						id: 1,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: new Date(),
					},
				],
			},
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Chivas Regal" },
				operationalQueries: [],
				users: [],
			},
		];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success delete message for 100 Users and a fail delete message for 100 Users", () => {
		let successUsers: string = "";
		let failedUsers: string = "";
		for (let i: number = 1; i < 101; i++) {
			successUsers += `\tID ${i} Jack Daniels.\n`;
			failedUsers += `\tUser with full name Chivas Regal.\n`;
			results.push({
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [
					{
						id: i,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: new Date(),
					},
				],
			});
			results.push({
				type: "fail",
				searchQuery: { params: "fullName", query: "Chivas Regal" },
				operationalQueries: [],
				users: [],
			});
		}
		message =
			"Successfully deleted 100 Users:\n" +
			"The following Users were deleted:\n" +
			successUsers +
			"The following Users could not be deleted:\n" +
			failedUsers;
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success update message for 1 User and a fail message for 1 User", () => {
		message =
			"Successfully updated 1 User:\n" +
			"The following User was updated:\n" +
			"\tUser with full name Jim Bean had the following field updated:\n" +
			"\t\tUser ID 1 Jim Bean's first name was updated to James.\n" +
			"The following User could not be updated:\n" +
			"\tUser with full name Don Julio had the following incident:\n" +
			"\t\tfirst name could not be updated to Patron.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: [
					{
						id: 1,
						firstName: "Jim",
						lastName: "Bean",
						birthDate: new Date(),
					},
				],
			},
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Don Julio" },
				operationalQueries: [{ params: "firstName", query: "Patron" }],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success update message for 100 Users and a fail message for 100 Users", () => {
		let successUsers: string = "";
		let failedUsers: string = "";
		let successArray: User[] = [];
		let failedArray: BulkParamsV3[] = [];
		for (let i: number = 1; i < 101; i++) {
			successUsers += `\t\tUser ID ${i} Jim Bean's first name was updated to James.\n`;
			failedUsers += `\tUser with full name Don Julio had the following incident:\n\t\tfirst name could not be updated to Patron.\n`;
			successArray.push({
				id: i,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: new Date(),
			});
			failedArray.push({
				type: "fail",
				searchQuery: { params: "fullName", query: "Don Julio" },
				operationalQueries: [{ params: "firstName", query: "Patron" }],
				users: [],
			});
		}
		message =
			"Successfully updated 100 Users:\n" +
			"The following Users were updated:\n" +
			"\tUsers with full name Jim Bean had the following field updated:\n" +
			successUsers +
			"The following Users could not be updated:\n" +
			failedUsers;
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: successArray,
			},
		];
		results = results.concat(failedArray);
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success update message for 1 User and an error message for 1 User", () => {
		message =
			"Successfully updated 1 User:\n" +
			"The following User was updated:\n" +
			"\tUser with full name Grey Goose had the following field updated:\n" +
			"\t\tUser ID 1 Grey Goose's date of birth was updated to May 1 1991.\n" +
			"The following User could not be updated:\n" +
			"\tUser with last name Perignon does not have the following field:\n" +
			"\t\tFavorite vacation spot.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Grey Goose" },
				operationalQueries: [
					{ params: "birthDate", query: new Date("1991-5-1").toString() },
				],
				users: [
					{
						id: 1,
						firstName: "Grey",
						lastName: "Goose",
						birthDate: new Date(),
					},
				],
			},
			{
				type: "error",
				searchQuery: { params: "lastName", query: "Perignon" },
				operationalQueries: [
					{
						params: "Favorite vacation spot",
						query: "Hameau de Vertuelle, Louvois",
					},
				],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success update message for 100 Users and an error message for 100 Users", () => {
		let successUsers: string = "";
		let errorUsers: string = "";
		let successArray: User[] = [];
		let errorArray: BulkParamsV3[] = [];
		for (let i: number = 1; i < 101; i++) {
			successUsers += `\t\tUser ID ${i} Grey Goose's date of birth was updated to May 1 1991.\n`;
			errorUsers += `\tUser with last name Perignon does not have the following field:\n\t\tFavorite vacation spot.\n`;
			successArray.push({
				id: i,
				firstName: "Grey",
				lastName: "Goose",
				birthDate: new Date(),
			});
			errorArray.push({
				type: "error",
				searchQuery: { params: "lastName", query: "Perignon" },
				operationalQueries: [
					{
						params: "Favorite vacation spot",
						query: "Hameau de Vertuelle, Louvois",
					},
				],
				users: [],
			});
		}
		message =
			"Successfully updated 100 Users:\n" +
			"The following Users were updated:\n" +
			"\tUsers with full name Grey Goose had the following field updated:\n" +
			successUsers +
			"The following Users could not be updated:\n" +
			errorUsers;
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Grey Goose" },
				operationalQueries: [
					{ params: "birthDate", query: new Date("1991-5-1").toString() },
				],
				users: successArray,
			},
		];
		results = results.concat(errorArray);
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a fail update message for 1 User and an error message for 1 User", () => {
		message =
			"The following Users could not be updated:\n" +
			"\tUser with last name Bulleit had the following incidents:\n" +
			"\t\tfirst name could not be updated to Tom.\n" +
			"\t\tdate of birth could not be updated to September 1 1830.\n" +
			"\tUser with last name Smirnoff does not have the following field:\n" +
			"\t\tFavorite cocktail.\n";
		results = [
			{
				type: "fail",
				searchQuery: { params: "lastName", query: "Bulleit" },
				operationalQueries: [
					{ params: "firstName", query: "Tom" },
					{ params: "birthDate", query: new Date("1830-9-2").toString() },
				],
				users: [],
			},
			{
				type: "error",
				searchQuery: { params: "lastName", query: "Smirnoff" },
				operationalQueries: [
					{
						params: "Favorite cocktail",
						query: "Yorsh",
					},
				],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a fail update message for 100 Users and an error message for 100 Users", () => {
		let failUsers: string = "";
		let errorUsers: string = "";
		let failArray: BulkParamsV3[] = [];
		let errorArray: BulkParamsV3[] = [];
		for (let i: number = 1; i < 101; i++) {
			failUsers +=
				"\tUser with last name Bulleit had the following incidents:\n\t\tfirst name could not be updated to Tom.\n\t\tdate of birth could not be updated to September 1 1830.\n";
			errorUsers +=
				"\tUser with last name Smirnoff does not have the following field:\n\t\tFavorite cocktail.\n";
			failArray.push({
				type: "fail",
				searchQuery: { params: "lastName", query: "Bulleit" },
				operationalQueries: [
					{ params: "firstName", query: "Tom" },
					{ params: "birthDate", query: new Date("1830-9-2").toString() },
				],
				users: [],
			});
			errorArray.push({
				type: "error",
				searchQuery: { params: "lastName", query: "Smirnoff" },
				operationalQueries: [
					{
						params: "Favorite cocktail",
						query: "Yorsh",
					},
				],
				users: [],
			});
		}
		message =
			"The following Users could not be updated:\n" + failUsers + errorUsers;
		results = results.concat(failArray);
		results = results.concat(errorArray);
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success update message for 1 User, fail update message for 1 User and an error update message for 1 User", () => {
		message =
			"Successfully updated 1 User:\n" +
			"The following User was updated:\n" +
			"\tUser with full name John Jameson had the following fields updated:\n" +
			"\t\tUser ID 1 John Jameson's first name was updated to Johnny.\n" +
			"\t\tUser ID 1 John Jameson's date of birth was updated to June 20 1988.\n" +
			"The following Users could not be updated:\n" +
			"\tUser with first name Captain had the following incident:\n" +
			"\t\tfirst name could not be updated to Admiral.\n" +
			"\tUser with last name Bacardi does not have the following field:\n" +
			"\t\tFavorite band.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "John Jameson" },
				operationalQueries: [
					{ params: "firstName", query: "Johnny" },
					{ params: "birthDate", query: new Date("1988-6-20").toString() },
				],
				users: [
					{
						id: 1,
						firstName: "John",
						lastName: "Jameson",
						birthDate: new Date(),
					},
				],
			},
			{
				type: "fail",
				searchQuery: { params: "firstName", query: "Captain" },
				operationalQueries: [{ params: "firstName", query: "Admiral" }],
				users: [],
			},
			{
				type: "error",
				searchQuery: { params: "lastName", query: "Bacardi" },
				operationalQueries: [
					{ params: "Favorite band", query: "Earth, Wind & Fire" },
				],
				users: [],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return a success update message for 100 Users, fail update message for 100 Users and an error update message for 100 Users", () => {
		let successUsers: string = "";
		let failedUsers: string = "";
		let errorUsers: string = "";
		let successArray: User[] = [];
		let failedArray: BulkParamsV3[] = [];
		let errorArray: BulkParamsV3[] = [];
		for (let i: number = 1; i < 101; i++) {
			successUsers += `\t\tUser ID ${i} John Jameson's first name was updated to Johnny.\n\t\tUser ID ${i} John Jameson's date of birth was updated to June 20 1988.\n`;
			failedUsers += `\tUser with first name Captain had the following incident:\n\t\tfirst name could not be updated to Admiral.\n`;
			errorUsers += `\tUser with last name Bacardi does not have the following field:\n\t\tFavorite band.\n`;
			successArray.push({
				id: i,
				firstName: "John",
				lastName: "Jameson",
				birthDate: new Date(),
			});
			failedArray.push({
				type: "fail",
				searchQuery: { params: "firstName", query: "Captain" },
				operationalQueries: [{ params: "firstName", query: "Admiral" }],
				users: [],
			});
			errorArray.push({
				type: "error",
				searchQuery: { params: "lastName", query: "Bacardi" },
				operationalQueries: [
					{ params: "Favorite band", query: "Earth, Wind & Fire" },
				],
				users: [],
			});
		}
		message =
			"Successfully updated 100 Users:\n" +
			"The following Users were updated:\n" +
			"\tUsers with full name John Jameson had the following fields updated:\n" +
			successUsers +
			"The following Users could not be updated:\n" +
			failedUsers +
			errorUsers;
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "John Jameson" },
				operationalQueries: [
					{ params: "firstName", query: "Johnny" },
					{ params: "birthDate", query: new Date("1988-6-20").toString() },
				],
				users: successArray,
			},
		];
		results = results.concat(failedArray).concat(errorArray);
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
});
