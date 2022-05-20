import { CreateUser, ViewUsers, ClearUsers } from "./api"

describe("CreateUser creates users, adds them to the Users array and returns the created User", () => {
    beforeAll(() => {
        ClearUsers();
    }),
    it("Should create User Jack Daniels and returns its id, firstname, lastname & age", () => {
        expect(CreateUser("Jack", "Daniels", 20)).toEqual({
            "id": 1,
            "firstName": "Jack",
            "lastName": "Daniels",
            "age": 20
        });
    }),
    it("Should create User Jim Bean with a different ID than User Jack Daniels", () => {
        CreateUser("Jim", "Bean", 22);
        let Users = ViewUsers();
        expect(Users[0].id).not.toBe(Users[1].id);
    });
});

describe("ViewUsers returns a list of all created Users", () =>{
    beforeAll(() => {
        ClearUsers();
    }),
    it("Should return an empty array when there are no created Users", () =>{
        expect(ViewUsers()).toEqual([]);
    }),
    it("Should return an array with Users Jack Daniels & Jim Bean's data", () => {
        CreateUser("Jack", "Daniels", 21);
        CreateUser("Jim", "Bean", 33);
        expect(ViewUsers()).toEqual([
            {
                "id": 1,
                "firstName": "Jack",
                "lastName": "Daniels",
                "age": 21
            },
            {
                "id": 2,
                "firstName": "Jim",
                "lastName": "Bean",
                "age": 33
            }
        ]);
    });
});

// run tests with the "npx jest" commmand in the terminal