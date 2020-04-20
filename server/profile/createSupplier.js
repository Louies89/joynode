import db from '../dbConfig/dbConnection';
import { isEmailId } from '../helper/validation';
import { v4 as uuidv4 } from 'uuid';
import { createDataJson,getUpdateParamString } from '../dbConfig/dbSchema';
import { checkUserByMail, checkUserByMob } from './createUser';

export const createSupplier = (UD) => new Promise((resolve, reject) => {
	if (UD.phone && !UD.iso2) {
		UD.iso2 = 'IN'
	}

  if (UD.email || UD.phone) {
		checkIsSupplier(UD).then((rslt)=>{
			if(rslt && rslt.userid && rslt.issupplier){
				resolve(rslt);
			}
			else if(rslt && rslt.userid && !rslt.issupplier){
				UD.isExistingUser = true;
				UD.userid = rslt.userid;
				createFreshSupplier(UD).then((rslt1)=>{
					resolve(rslt1);
				})
			}
			else{
				createFreshSupplier(UD).then((rslt2)=>{
					resolve(rslt2)
				})       
			}
		})
  }
  else{
		console.log(1)
    resolve(false)
  }
})



const checkIsSupplier=(UD) => new Promise((resolve, reject) => {
  if (UD.email || UD.phone) {
    if(UD.email){
      checkUserByMail(UD.email).then((rslt)=>{
        if(rslt){
          resolve(rslt)
        }
        else if(UD.iso2 && UD.phone){
          checkUserByMob(UD.iso2,UD.phone).then((rslt1)=>{
            if(rslt1){
              resolve(rslt1)
            }
            else{
							resolve(false);            
            }
          })
				}
				else{
					resolve(false)
				}
      })
		}
		else if(UD.iso2 && UD.phone){
			checkUserByMob(UD.iso2,UD.phone).then((rslt2)=>{
				if(rslt2){
					resolve(rslt2)
				}
				else{
					resolve(false);            
				}
			})
		}
		else{
			resolve(false)
		}
	}
	else{
    resolve(false)
  }
})


const createFreshSupplier = (UD) => new Promise((resolve, reject) => {
	if (UD.phone && !UD.iso2) {
		UD.iso2 = 'IN'
	}

	if (UD.email || UD.phone) {
			db.tx(async t => {
				const nanoid = require('../libs/genid/generate');

				if(!UD.isExistingUser){
					UD.userid = uuidv4();
				}

				UD.billingid = nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
				UD.companyname = UD.companyname ? UD.companyname : '';
				UD.contacttitle = UD.contacttitle ? UD.contacttitle : ''
				UD.contactname = UD.contactname ? UD.contactname : ''
				UD.address1 = UD.address1 ? UD.address1 : ''
				UD.address2 = UD.address2 ? UD.address2 : ''
				UD.city = UD.city ? UD.city : ''
				UD.state = UD.state ? UD.state : ''
				UD.postalcode = UD.postalcode ? UD.postalcode : ''
				UD.country = UD.country ? UD.country : 'INDIA'

				if (!UD.iso2 && UD.phone) {
					UD.iso2 = 'IN'
				}
				else if (!UD.phone) {
					UD.iso2 = ''
					UD.phone = ''
				}

				UD.email = isEmailId(UD.email) ? UD.email : ''
				UD.website = UD.website ? UD.website : ''
				UD.logo = UD.logo ? UD.logo : ''
				UD.ranking = 0
				UD.registrationtime = new Date();
				UD.verificationcode = nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
				UD.extranote = UD.extranote?UD.extranote:'';
				UD.userip = UD.userip ? UD.userip : ''

				await t.any('INSERT INTO supplier VALUES(${userid}, ${billingid}, ${companyname}, \
									${contacttitle}, ${contactname}, ${address1}, ${address2}, \
									${city}, ${state}, ${country}, ${postalcode}, ${iso2}, \
									${phone}, ${email}, ${website}, ${logo}, ${ranking}, \
									${registrationtime}, ${verificationcode}, ${extranote}, ${userip})', UD);

				UD.issupplier = true;

				if(UD.isExistingUser){
					if (isEmailId(UD.email)) {
						await t.none('UPDATE usersbymail SET issupplier = ${issupplier} WHERE email = ${email}', UD);
					}

					if (UD.iso2 && UD.phone) {
						await t.none('UPDATE usersbymob SET issupplier = ${issupplier} WHERE iso2 = ${iso2} AND phone = ${phone}', UD);
					}
				}
				else{
					UD.password = UD.password ? UD.password : nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

					if (isEmailId(UD.email)) {
						UD.emailverified = UD.emailverified ? UD.emailverified : false;
						await t.none('INSERT INTO usersbymail VALUES (${email}, ${userid}, ${emailverified}, ${issupplier}, ${password})', UD);
					}

					if (UD.iso2 && UD.phone) {
						UD.phoneverified = UD.phoneverified ? UD.phoneverified : false;
						await t.none('INSERT INTO usersbymob VALUES (${iso2}, ${phone}, ${userid}, ${issupplier}, ${phoneverified}, ${password})', UD);
					}
				}
			}).then(() => {
				UD.supplierCreated = true;
				resolve (UD)
			}).catch(err => {
				resolve ({ supplierCreated: false, err:err});
			});
	}
})


export const updateSupplierInfo = (UD) => new Promise((resolve,reject)=>{
	if (UD.email || UD.phone) {
		checkUserByMail(UD.email).then((rslt)=>{
			if(rslt && rslt.userid && rslt.issupplier){
				UD.userid = rslt.userid;
				updateSupplierData(UD).then((rslt1)=>{
					resolve(rslt1)
				})
			}
			else if(UD.iso2 && UD.phone){
				checkUserByMob(UD.iso2,UD.phone).then((rslt2)=>{
					if(rslt2 && rslt2.userid && rslt2.issupplier){
						updateSupplierData(UD).then((rslt3)=>{
							resolve(rslt3)
						})
					}
					else{
						resolve(false);            
					}
				})
			}
			else{
				resolve(false)
			}
		})
	}
})


const updateSupplierData = (UD) => new Promise((resolve,reject)=>{
	if (UD.userid) {
		db.tx(async t => {
			let data = createDataJson('supplier', UD)

			if (!data) {
				resolve(false);
			}

			let fields = getUpdateParamString('supplier', data, 'userid');
			await t.none('UPDATE supplier SET ' + fields + 'WHERE userid = ${userid}', UD);

		}).then(() => {
			UD.supplierUpdated = true;
			resolve(UD)
		}).catch(err => {
			resolve ({ supplierUpdated: false, err:err });
		});
	}
	else {
		resolve(false);
	}
})