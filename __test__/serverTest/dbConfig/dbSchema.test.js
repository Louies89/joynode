
import db from '../../../server/dbConfig/dbConnection';
import { getTableSchema, createDataJson, getUpdateParamString,getInsertParamString} from '../../../server/dbConfig/dbSchema';


let allTables = [];

beforeAll(async () => {
	let tables = await db.any("SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema='public';");
	for (let i = 0; i < tables.length; i++) {
		allTables.push(tables[i].table_name);
	}
})

describe('Check if all tables listed or not', () => {

	test('All tables has been listed', async () => {
		for (let i = 0; i < allTables.length; i++) {
			expect(getTableSchema(allTables[i]).length).toBeGreaterThan(0);
		}
	})

	describe('Check if table columns are listed or not', () => {

		test('Match each table columns', async () => {
			for (let i = 0; i < allTables.length; i++) {
				let data = await db.any("SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_catalog='joy' AND table_name = $1;", [allTables[i]])
				let columnNames = [];
				for (let j = 0; j < data.length; j++) {
					columnNames.push(data[j].column_name)
				}
				expect(getTableSchema(allTables[i]).sort()).toEqual(columnNames.sort());
			}
		})
	})

	describe('Check functionality of createDataJson()', () => {
		
		test('Check all the columns shall be returned if all columns are filled with data ', async () => {
			for (let i = 0; i < allTables.length; i++) {
				let data = await db.any("SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_catalog='joy' AND table_name = $1;", [allTables[i]])
				
				let tableData = {};
				for (let j = 0; j < data.length; j++) {
					tableData[data[j].column_name] = 'dummy';
				}
				expect(createDataJson(allTables[i],tableData)).toMatchObject(tableData);
			}
		})

		test('Check only the columns which has data shall be returned', async () => {
			for (let i = 0; i < allTables.length; i++) {
				let data = await db.any("SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_catalog='joy' AND table_name = $1;", [allTables[i]])
				
				let tableData = {};
				for (let j = 0; j < data.length; j++) {
					if(j%2==0){
						tableData[data[j].column_name] = 'dummy';
					}
				}
				expect(createDataJson(allTables[i],tableData)).toMatchObject(tableData);
			}
		})
	})
})



test('Check getUpdateParamString()', () => {
	let data = {
		userid:'dummy',
		iso2:'dummy',
		phone:'dummy',
		email:'dummy',
		userip:'dummy'
	}
	expect(getUpdateParamString('users',data,'userid')).toEqual('iso2=${iso2}, phone=${phone}, email=${email}, userip=${userip}');
	expect(getUpdateParamString('users',data,['userid','iso2'])).toEqual('phone=${phone}, email=${email}, userip=${userip}');
})


test('Check getInsertParamString()', () => {
	let data = {
		userid:'dummy',
		iso2:'dummy',
		phone:'dummy',
		email:'dummy',
		userip:'dummy'
	}
	expect(getInsertParamString('users',data)).toEqual('${userid}, ${iso2}, ${phone}, ${email}, ${userip}');
})