import {createUser} from '../../../server/profile/createUser';
import db from '../../../server/dbConfig/dbConnection';

describe ('Account creation by Email & Phone',()=>{
    let userData = {
        email:'user1@gmail.com',
        userip:'000.000.000.001',
        iso2:'IN',
        phone:'11111111111',
    }

    beforeAll(async ()=>{
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = $1", [userData.email]);
        if(usersbymail && usersbymail.length){
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymail[0].userid]);
            await db.any('DELETE FROM usersbymail WHERE email = $1',[usersbymail[0].email]);
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[userData.iso2,userData.phone]);
        }

    })
    
    test("Create new user with E-mail & Phone", async () => {
        let result = await createUser(userData);
        //User shall be registered with email id
        expect(result.userCreated).toEqual(true);
    
        //Users table shall be populated
        let users = await db.any("SELECT * FROM users WHERE userid = ${userid}", result);
        expect(users[0].email).toBe(userData.email);
        expect(users[0].iso2).toBe(userData.iso2);
        expect(users[0].phone).toBe(userData.phone);
        expect(users[0].registrationtime).toBeDefined();
        expect(users[0].verificationcode).toBeDefined();
        expect(users[0].userip).toBe(userData.userip);
    
    
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", userData);
        //User shall get registered with email
        expect(usersbymail[0].email).toBe(userData.email);
        expect(usersbymail[0].userid).toBeDefined();
        expect(usersbymail[0].emailverified).toBeDefined();
        expect(usersbymail[0].issupplier).toEqual(false);
        expect(usersbymail[0].password).toBeDefined();
    
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", userData);
        //User shall get registered with phone
        expect(usersbymob[0].iso2).toBe(userData.iso2);
        expect(usersbymob[0].phone).toBe(userData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(false);
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();
    });
})

describe ('Account creation only by Email',()=>{
    let userData = {
        email:'user2@gmail.com',
        userip:'000.000.000.002',
    }

    let iso2 = 'IN';  //Do not send iso2 & phone in 'userData'
    let phone = '11111111112'

    beforeAll(async ()=>{
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = $1", [userData.email]);
        if(usersbymail && usersbymail.length){
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymail[0].userid]);
            await db.any('DELETE FROM usersbymail WHERE email = $1',[usersbymail[0].email]);
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[iso2,phone]);
        }

    })
    
    test("Create new user with E-mail only", async () => {
        let result = await createUser(userData);
        //User shall be registered with email id
        expect(result.userCreated).toEqual(true);
    
        //Users table shall be populated
        let users = await db.any("SELECT * FROM users WHERE userid = ${userid}", result);
        expect(users[0].email).toBe(userData.email);
        expect(users[0].iso2).toBe(userData.iso2);
        expect(users[0].phone).toBe(userData.phone);
        expect(users[0].registrationtime).toBeDefined();
        expect(users[0].verificationcode).toBeDefined();
        expect(users[0].userip).toBe(userData.userip);
    
    
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", userData);
        //User shall get registered with email
        expect(usersbymail[0].email).toBe(userData.email);
        expect(usersbymail[0].userid).toBeDefined();
        expect(usersbymail[0].emailverified).toBeDefined();
        expect(usersbymail[0].issupplier).toEqual(false);
        expect(usersbymail[0].password).toBeDefined();
    
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", userData);
        //User shall get registered with phone
        expect(usersbymob).toEqual([]);
    });
})



describe ('Account creation by Only Phone',()=>{
    let userData = {
        userip:'000.000.000.003',
        iso2:'IN',
        phone:'11111111113',
    }

    beforeAll(async ()=>{
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", userData);
        if(usersbymob && usersbymob.length){
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[userData.iso2,userData.phone]);
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymob[0].userid]);
        }
    })
    
    test("Create new user only with Phone", async () => {
        let result = await createUser(userData);
        //User shall be registered with email id
        expect(result.userCreated).toEqual(true);
    
        //Users table shall be populated
        let users = await db.any("SELECT * FROM users WHERE userid = ${userid}", result);
        expect(users[0].email).toBe(userData.email);
        expect(users[0].iso2).toBe(userData.iso2);
        expect(users[0].phone).toBe(userData.phone);
        expect(users[0].registrationtime).toBeDefined();
        expect(users[0].verificationcode).toBeDefined();
        expect(users[0].userip).toBe(userData.userip);
    
    
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", userData);
        //User shall get registered with email
        expect(usersbymail).toEqual([]);

    
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", userData);
        //User shall get registered with phone
        expect(usersbymob[0].iso2).toBe(userData.iso2);
        expect(usersbymob[0].phone).toBe(userData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(false);
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();
    });
})