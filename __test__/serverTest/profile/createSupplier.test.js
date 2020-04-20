import {createSupplier,updateSupplierInfo} from '../../../server/profile/createSupplier';
import {createUser} from '../../../server/profile/createUser';
import db from '../../../server/dbConfig/dbConnection';

describe ('Create supplier for a new user',()=>{
    let supplierData = {
        companyname:'companyname',
        contacttitle:'contacttitle',
        contactname:'contactname',
        address1:'address1',
        address2:'address2',
        city:'city',
        state:'state',
        country:'country',
        postalcode:'752104',
        iso2:'IN',
        phone:'11111111111',
        email:'supplier1@gmail.com',
        website:'www.supplier1.com',
        logo:'https://logo.png',
        ranking:4.5,
        extranote:'extranote',
        userip:'000.000.000.001'
    }

    beforeAll(async ()=>{
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        if(usersbymob && usersbymob.length){
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
            await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymob[0].userid]);
            await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
        }
    })
    
    test("Create new supplier for a new user", async () => {
        let result = await createSupplier(supplierData);
        

        //supplier shall be registered
        expect(result.supplierCreated).toEqual(true);
    
        //Users table shall be populated
        let supplier = await db.any("SELECT * FROM supplier WHERE userid = ${userid}", result);
        
        expect(supplier[0].companyname).toBe(supplierData.companyname);
        expect(supplier[0].contacttitle).toBe(supplierData.contacttitle);
        expect(supplier[0].contactname).toBe(supplierData.contactname);
        expect(supplier[0].address1).toBe(supplierData.address1);
        expect(supplier[0].address2).toBe(supplierData.address2);
        expect(supplier[0].city).toBe(supplierData.city);
        expect(supplier[0].state).toBe(supplierData.state);
        expect(supplier[0].country).toBe(supplierData.country);
        expect(supplier[0].postalcode).toBe(supplierData.postalcode);
        expect(supplier[0].iso2).toBe(supplierData.iso2);
        expect(supplier[0].phone).toBe(supplierData.phone);
        expect(supplier[0].email).toBe(supplierData.email);
        expect(supplier[0].website).toBe(supplierData.website);
        expect(supplier[0].logo).toBe(supplierData.logo);
        expect(supplier[0].ranking).toBe(0);
        expect(supplier[0].extranote).toBe(supplierData.extranote);
        expect(supplier[0].registrationtime).toBeDefined();
        expect(supplier[0].verificationcode).toBeDefined();
        expect(supplier[0].userip).toBe(supplierData.userip);
    
    
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", supplierData);
        //User shall get registered with email
        expect(usersbymail[0].email).toBe(supplierData.email);
        expect(usersbymail[0].userid).toBeDefined();
        expect(usersbymail[0].emailverified).toBeDefined();
        expect(usersbymail[0].issupplier).toEqual(true);
        expect(usersbymail[0].password).toBeDefined();

    
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        //User shall get registered with phone
        expect(usersbymob[0].iso2).toBe(supplierData.iso2);
        expect(usersbymob[0].phone).toBe(supplierData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(true);
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();
    });
})


describe ('Create supplier for a existing user',()=>{
    let userData = {
        email:'supplier2@gmail.com',
        userip:'000.000.000.001',
        iso2:'IN',
        phone:'11111111112',
    }

    let supplierData = {
        companyname:'companyname',
        contacttitle:'contacttitle',
        contactname:'contactname',
        address1:'address1',
        address2:'address2',
        city:'city',
        state:'state',
        country:'country',
        postalcode:'752104',
        iso2:'IN',
        phone:'11111111112',
        email:'supplier2@gmail.com',
        website:'www.supplier2.com',
        logo:'https://logo.png',
        ranking:4.5,
        extranote:'extranote',
        userip:'000.000.000.002'
    }

    beforeAll(async ()=>{
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        if(usersbymob && usersbymob.length){
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
            await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymob[0].userid]);
            await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymob[0].userid]);
        }
    })
    
    test("Create new supplier for a existing user", async () => {
        await createUser(userData);

        // Check that the existing user has not been marked as supplier 
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", supplierData);
        expect(usersbymail[0].email).toBe(supplierData.email);
        expect(usersbymail[0].userid).toBeDefined();
        expect(usersbymail[0].emailverified).toBeDefined();
        expect(usersbymail[0].issupplier).toEqual(false); // <--- This is the important part
        expect(usersbymail[0].password).toBeDefined();
        
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        expect(usersbymob[0].iso2).toBe(supplierData.iso2);
        expect(usersbymob[0].phone).toBe(supplierData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(false); // <--- This is the important part
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();


        let result = await createSupplier(supplierData);

        //supplier shall be registered
        expect(result.supplierCreated).toEqual(true);
    
        //Users table shall be populated
        let supplier = await db.any("SELECT * FROM supplier WHERE userid = ${userid}", result);
        
        expect(supplier[0].companyname).toBe(supplierData.companyname);
        expect(supplier[0].contacttitle).toBe(supplierData.contacttitle);
        expect(supplier[0].contactname).toBe(supplierData.contactname);
        expect(supplier[0].address1).toBe(supplierData.address1);
        expect(supplier[0].address2).toBe(supplierData.address2);
        expect(supplier[0].city).toBe(supplierData.city);
        expect(supplier[0].state).toBe(supplierData.state);
        expect(supplier[0].country).toBe(supplierData.country);
        expect(supplier[0].postalcode).toBe(supplierData.postalcode);
        expect(supplier[0].iso2).toBe(supplierData.iso2);
        expect(supplier[0].phone).toBe(supplierData.phone);
        expect(supplier[0].email).toBe(supplierData.email);
        expect(supplier[0].website).toBe(supplierData.website);
        expect(supplier[0].logo).toBe(supplierData.logo);
        expect(supplier[0].ranking).toBe(0);
        expect(supplier[0].extranote).toBe(supplierData.extranote);
        expect(supplier[0].registrationtime).toBeDefined();
        expect(supplier[0].verificationcode).toBeDefined();
        expect(supplier[0].userip).toBe(supplierData.userip);
    
    
        usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", supplierData);
        //User shall get registered with email
        expect(usersbymail[0].email).toBe(supplierData.email);
        expect(usersbymail[0].userid).toBeDefined();
        expect(usersbymail[0].emailverified).toBeDefined();
        expect(usersbymail[0].issupplier).toEqual(true);
        expect(usersbymail[0].password).toBeDefined();

    
        usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        //User shall get registered with phone
        expect(usersbymob[0].iso2).toBe(supplierData.iso2);
        expect(usersbymob[0].phone).toBe(supplierData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(true);
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();
    });
})



describe ('Do not create supplier if the user is already a supplier',()=>{
    let userData = {
        email:'supplier3@gmail.com',
        userip:'000.000.000.003',
        iso2:'IN',
        phone:'11111111113',
    }

    let supplierData = {
        companyname:'companyname',
        contacttitle:'contacttitle',
        contactname:'contactname',
        address1:'address1',
        address2:'address2',
        city:'city',
        state:'state',
        country:'country',
        postalcode:'752104',
        iso2:'IN',
        phone:'11111111113',
        email:'supplier3@gmail.com',
        website:'www.supplier3.com',
        logo:'https://logo.png',
        ranking:4.5,
        extranote:'extranote',
        userip:'000.000.000.003'
    }

    beforeAll(async ()=>{
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        if(usersbymob && usersbymob.length){
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
            await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymob[0].userid]);
            await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymob[0].userid]);
        }
        else{
            let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", supplierData);
            if(usersbymail && usersbymail.length){
                await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
                await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymail[0].userid]);
                await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
                await db.any('DELETE FROM users WHERE userid = $1',[usersbymail[0].userid]);
            }
            else{
                await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
                await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
            }
        }
    })
    
    test("Do not create supplier if the user is already a supplier", async () => {
        let x = await createUser(userData);

        // Check that the existing user has not been marked as supplier 
        let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", supplierData);
        expect(usersbymail[0].email).toBe(supplierData.email);
        expect(usersbymail[0].userid).toBeDefined();
        expect(usersbymail[0].emailverified).toBeDefined();
        expect(usersbymail[0].issupplier).toEqual(false); // <--- This is the important part
        expect(usersbymail[0].password).toBeDefined();
        
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        expect(usersbymob[0].iso2).toBe(supplierData.iso2);
        expect(usersbymob[0].phone).toBe(supplierData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(false); // <--- This is the important part
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();


        let result1 = await createSupplier(supplierData);
       //supplier shall be registered
        expect(result1.supplierCreated).toEqual(true);

        //Retrying to create supplier, shall intimate that bthe user is already a supplier
        let result2 = await createSupplier(supplierData);
        expect(result2.userid).toEqual(result1.userid);
        expect(result2.issupplier).toEqual(true);
        

    });
})



describe ('Do not create supplier if the user is already a supplier and registered by phone only',()=>{
    let userData = {
        // email:'supplier4@gmail.com',
        userip:'000.000.000.004',
        iso2:'IN',
        phone:'11111111114',
    }

    let supplierData = {
        companyname:'companyname',
        contacttitle:'contacttitle',
        contactname:'contactname',
        address1:'address1',
        address2:'address2',
        city:'city',
        state:'state',
        country:'country',
        postalcode:'752104',
        iso2:'IN',
        phone:'11111111114',
        // email:'supplier4@gmail.com',
        // website:'www.supplier4.com',
        logo:'https://logo.png',
        ranking:4.5,
        extranote:'extranote',
        userip:'000.000.000.004'
    }

    beforeAll(async ()=>{
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        if(usersbymob && usersbymob.length){
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
            await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymob[0].userid]);
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymob[0].userid]);
        }
    })
    
    test("Do not create supplier if the user is already a supplier and registered by phone only", async () => {
        let x = await createUser(userData);
        
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        expect(usersbymob[0].iso2).toBe(supplierData.iso2);
        expect(usersbymob[0].phone).toBe(supplierData.phone);
        expect(usersbymob[0].userid).toBeDefined();
        expect(usersbymob[0].issupplier).toEqual(false); // <--- This is the important part
        expect(usersbymob[0].phoneverified).toBeDefined();
        expect(usersbymob[0].password).toBeDefined();


        let result1 = await createSupplier(supplierData);
       //supplier shall be registered
        expect(result1.supplierCreated).toEqual(true);

        //Retrying to create supplier, shall intimate that bthe user is already a supplier
        let result2 = await createSupplier(supplierData);
        expect(result2.userid).toEqual(result1.userid);
        expect(result2.issupplier).toEqual(true);
    });
})



describe ('Update Supplier Info',()=>{

    let supplierData = {
        companyname:'companyname',
        contacttitle:'contacttitle',
        contactname:'contactname',
        address1:'address1',
        address2:'address2',
        city:'city',
        state:'state',
        country:'country',
        postalcode:'752104',
        iso2:'IN',
        phone:'11111111115',
        email:'supplier5@gmail.com',
        website:'www.supplier5.com',
        logo:'https://logo.png',
        ranking:3.5,
        extranote:'extranote',
        userip:'000.000.000.005'
    }

    beforeAll(async ()=>{
        let usersbymob = await db.any("SELECT * FROM usersbymob WHERE iso2 = ${iso2} AND phone=${phone}", supplierData);
        if(usersbymob && usersbymob.length){
            await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
            await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymob[0].userid]);
            await db.any('DELETE FROM users WHERE userid = $1',[usersbymob[0].userid]);
        }
        else{
            let usersbymail = await db.any("SELECT * FROM usersbymail WHERE email = ${email}", supplierData);
            if(usersbymail && usersbymail.length){
                await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
                await db.any('DELETE FROM supplier WHERE userid = $1',[usersbymail[0].userid]);
                await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
                await db.any('DELETE FROM users WHERE userid = $1',[usersbymail[0].userid]);
            }
            else{
                await db.any('DELETE FROM usersbymob WHERE iso2 = $1 AND phone = $2',[supplierData.iso2,supplierData.phone]);
                await db.any('DELETE FROM usersbymail WHERE email = $1',[supplierData.email]);
            }
        }
    })
    
    test("Update Supplier Info", async () => {
        
        let result1 = await createSupplier(supplierData);
       //supplier shall be registered
        expect(result1.supplierCreated).toEqual(true);

        let supplier = await db.any("SELECT * FROM supplier WHERE userid = ${userid}", result1);
        
        expect(supplier[0].companyname).toBe(supplierData.companyname);
        expect(supplier[0].contacttitle).toBe(supplierData.contacttitle);
        expect(supplier[0].contactname).toBe(supplierData.contactname);
        expect(supplier[0].address1).toBe(supplierData.address1);
        expect(supplier[0].address2).toBe(supplierData.address2);
        expect(supplier[0].city).toBe(supplierData.city);
        expect(supplier[0].state).toBe(supplierData.state);
        expect(supplier[0].country).toBe(supplierData.country);
        expect(supplier[0].postalcode).toBe(supplierData.postalcode);
        expect(supplier[0].iso2).toBe(supplierData.iso2);
        expect(supplier[0].phone).toBe(supplierData.phone);
        expect(supplier[0].email).toBe(supplierData.email);
        expect(supplier[0].website).toBe(supplierData.website);
        expect(supplier[0].logo).toBe(supplierData.logo);
        expect(supplier[0].ranking).toBe(supplierData.ranking);
        expect(supplier[0].extranote).toBe(supplierData.extranote);
        expect(supplier[0].registrationtime).toBeDefined();
        expect(supplier[0].verificationcode).toBeDefined();
        expect(supplier[0].userip).toBe(supplierData.userip);

        let supplierData1 = {
            companyname:'companyname1',
            contacttitle:'contacttitle1',
            contactname:'contactname1',
            address1:'address11',
            address2:'address21',
            city:'city1',
            state:'state1',
            country:'country1',
            postalcode:'7521041',
            iso2:'IN',
            phone:'11111111115',           //<---- Do not change phone
            email:'supplier5@gmail.com',   //<---- Do not change mail
            website:'www.supplier51.com',
            logo:'https://logo1.png',
            ranking:4.5,
            extranote:'extranote1',
            userip:'000.000.000.0051'
        }

        //Supplier data shall be updated
        await updateSupplierInfo(supplierData1);

        supplier = await db.any("SELECT * FROM supplier WHERE userid = ${userid}", result1);
        
        expect(supplier[0].companyname).toBe(supplierData1.companyname);
        expect(supplier[0].contacttitle).toBe(supplierData1.contacttitle);
        expect(supplier[0].contactname).toBe(supplierData1.contactname);
        expect(supplier[0].address1).toBe(supplierData1.address1);
        expect(supplier[0].address2).toBe(supplierData1.address2);
        expect(supplier[0].city).toBe(supplierData1.city);
        expect(supplier[0].state).toBe(supplierData1.state);
        expect(supplier[0].country).toBe(supplierData1.country);
        expect(supplier[0].postalcode).toBe(supplierData1.postalcode);
        expect(supplier[0].iso2).toBe(supplierData1.iso2);
        expect(supplier[0].phone).toBe(supplierData1.phone);
        expect(supplier[0].email).toBe(supplierData1.email);
        expect(supplier[0].website).toBe(supplierData1.website);
        expect(supplier[0].logo).toBe(supplierData1.logo);
        expect(supplier[0].ranking).toBe(supplierData1.ranking);
        expect(supplier[0].extranote).toBe(supplierData1.extranote);
        expect(supplier[0].registrationtime).toBeDefined();
        expect(supplier[0].verificationcode).toBeDefined();
        expect(supplier[0].userip).toBe(supplierData1.userip);
    });
})