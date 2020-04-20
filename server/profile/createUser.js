import db from '../dbConfig/dbConnection';
import { isEmailId } from '../helper/validation';
import { v4 as uuidv4 } from 'uuid';


export const createUser = (UD) => new Promise((resolve, reject) => {
  if (UD.phone && !UD.iso2) {
    UD.iso2 = 'IN'
  }

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
              createFreshUser(UD).then((rslt2)=>{
                resolve(rslt2)
              })
            }
          })
        }
        else{
          createFreshUser(UD).then((rslt2)=>{
            resolve(rslt2)
          })
        }
      })
    }
    else if(UD.iso2 && UD.phone){
      checkUserByMob(UD.iso2,UD.phone).then((rslt2)=>{
        if(rslt2){
          resolve(rslt2)
        }
        else{
          createFreshUser(UD).then((rslt3)=>{
            resolve(rslt3)
          })              
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



export const checkUserByMail=(email) => new Promise((resolve, reject) => {
  if (isEmailId(email)) {
    db.any('SELECT email,userid,emailverified,issupplier FROM usersbymail WHERE email=$1', [email]).then((data)=>{
      if (data && data.length) {
        resolve(data[0]);
      }
      else{
        resolve(false);
      }
    })
    .catch((err)=>{
      resolve(false);
    })
  }
  else{
    resolve(false);
  }
})


export const checkUserByMob=(iso2,phone) => new Promise((resolve, reject) => {
  if (iso2 && phone) {
    db.any('SELECT iso2,phone,userid,phoneverified,issupplier FROM usersbymob WHERE iso2=$1 AND phone=$2',[iso2, phone]).then((data)=>{
      if (data && data.length) {
        resolve(data[0]);
      }
      else{
        resolve(false);
      }
    })
    .catch((err)=>{
      resolve(false);
    })
  }
  else{
    resolve(false);
  }
})


const createFreshUser = (UD) => new Promise((resolve,reject)=>{
  db.tx(async t => {
    const nanoid = require('../libs/genid/generate');

    UD.userid = uuidv4();

    if (!UD.iso2 && UD.phone) {
      UD.iso2 = 'IN'
    }
    else if (!UD.phone) {
      UD.iso2 = ''
      UD.phone = ''
    }

    if(!UD.email){
      UD.email = '';
    }

    UD.phoneverified = UD.phoneverified ? UD.phoneverified : false
    UD.email = isEmailId(UD.email) ? UD.email : ''
    UD.emailverified = UD.emailverified ? UD.emailverified : false
    UD.password = nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
    UD.registrationtime = new Date();
    UD.verificationcode = nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    UD.userip = UD.userip ? UD.userip : ''
    UD.issupplier = false;

    await t.none('INSERT INTO users VALUES (${userid}, ${iso2}, ${phone}, ${email}, ${registrationtime}, ${verificationcode}, ${userip})', UD);

    if (isEmailId(UD.email)) {
      await t.none('INSERT INTO usersbymail VALUES (${email}, ${userid}, ${emailverified}, ${issupplier}, ${password})', UD);
    }

    if (UD.iso2 && UD.phone) {
      await t.none('INSERT INTO usersbymob VALUES (${iso2}, ${phone}, ${userid}, ${issupplier}, ${phoneverified}, ${password})', UD);
    }
  }).then(() => {
    UD.userCreated = true;
    resolve(UD);
  }).catch(error => {
    resolve({ userCreated: false, error: error });
  });
})