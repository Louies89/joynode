

export function getTableSchema(table){
    if(table == 'category'){
        return([
            'categoryid',
            'categoryname'
        ])
    }
    else if(table == 'catagoryandsupplier'){
        return([
            'catagorysupplierid',
            'categoryid',
            'userid'
        ])
    }
    else if(table == 'supplier'){
        return([
            'userid',
            'billingid',
            'companyname',
            'contacttitle',
            'contactname',
            'address1',
            'address2',
            'city',
            'state',
            'country',
            'postalcode',
            'iso2',
            'phone',
            'email',
            'website',
            'logo',
            'ranking',
            'registrationtime',
            'verificationcode',
            'extranote',
            'userip'
        ])
    }
    else if(table == 'businessworkinghours'){
        return([
            'userid',
            'dayofweek',
            'opentime',
            'closetime',
        ])
    }
    else if(table == 'product'){
        return([
            'productid',
            'productname',
            'productshortdescription',
            'productlongdescription',
            'productislive',
            'productloactions',
            'productcreatedat',
            'productupdatedat',
            'productthumb',
            'productvideo',
            'productimages',
            'categoryid',
            'productdimension',
            'productquantityperunit',
            'productunitprice',
            'productdiscountprice',
            'productdiscountavailable',
            'productdiscountpercentage',
            'producttaxpercentage',
            'productunitweight',
            'productranking',
            'productunitsinstock',
            'productunitsonorder',
            'productreorderlevel',
            'variantgroupid',
            'userid',
            'extranote',
            'tags'
        ])
    }
    else if(table == 'sku'){
        return([
            'skuid',
            'productid',
            'skuname',
            'skushortdescription',
            'skulongdescription',
            'skuislive',
            'skuloactions',
            'skuthumb',
            'skuimages',
            'skudimension',
            'skuprice',
            'skudiscountprice',
            'skudiscountavailable',
            'skudiscountpercentage',
            'skuunitweight',
            'skuranking',
            'skuunitsinstock',
            'skuunitsonorder',
            'skureorderlevel',
            'variantid',
            'extranote',
            'tags'
        ])
    }
    else if(table == 'variant'){
        return([
            'variantid',
            'variantgroupid',
            'variantname',
            'size',
            'color',
            'weight'
        ])
    }
    else if(table == 'variantgroup'){
        return([
            'variantgroupid',
            'variantgroupname',
        ])
    }
    else if(table == 'ratingreview'){
        return([
            'ratingid',
            'productid',
            'skuid',
            'ratedby',
            'ratedat',
            'rating',
            'comment'
        ])
    }
    else if(table == 'orders'){
        return([
            'orderid',
            'userid',
            'orderdetailsid',
            'orderstate',
            'paymentid',
            'orderdate',
            'shippingaddress1',
            'shippingaddress2',
            'shippingcity',
            'shippingstate',
            'shippingpostalcode',
            'shippingcountry',
            'enduserphone',
            'isordershipped',
            'ordertrackingid',
            'orderamount',
            'ordertax',
            'orderdiscountamount'
        ])
    }
    else if(table == 'users'){
        return([
            'userid',
            'iso2',
            'phone',
            'email',
            'registrationtime',
            'verificationcode',
            'userip'
        ])
    }
    else if(table == 'usersbymail'){
        return([
            'email',
            'userid',
            'emailverified',
            'issupplier',
            'password'
        ])
    }
    else if(table == 'usersbymob'){
        return([
            'iso2',
            'phone',
            'userid',
            'issupplier',
            'phoneverified',
            'password'
        ])
    }
    else if(table == 'orderdetails'){
        return([
            'orderdetailsid',
            'skuid',
            'skuquantity',
            'skuunitprice',
            'skudiscountamount'
        ])
    }
    else if(table == 'cartitems'){
        return([
            'cartid',
            'userid',
            'skuid',
            'skuquantity',
            'skuunitprice',
            'skudiscountamount',
            'cartstate'
        ])
    }
    else{
        return [];
    }
}


export function createDataJson(tableName,tableData){
    let columnNames = getTableSchema(tableName);
    if(columnNames){
        let dataJson = {};
        columnNames.forEach(column => {
            if(tableData.hasOwnProperty(column)){
                dataJson[column] = tableData[column];
            }
        });

        return dataJson;
    }
    else{
        return false;
    }
}

export function getUpdateParamString(tableName,data,pk){
    if(typeof pk == 'string'){
        pk = [pk]
    }

    let columnNames = getTableSchema(tableName);
    let dataKeys = Object.keys(data);

    let fields = columnNames.filter((column)=>{
        return(pk.indexOf(column) == -1 && dataKeys.indexOf(column)>-1)
    })

    let result = fields.map((key)=>{
        return (key + '=${' + key + '}')
    })

    return result.join(', ')
}

export function getInsertParamString(tableName,data){
    let columnNames = getTableSchema(tableName);
    let dataKeys = Object.keys(data);

    let fields = columnNames.filter((column)=>{
        return(dataKeys.indexOf(column)>-1)
    })

    let result = fields.map((key)=>{
        return ('${' + key + '}')
    })
    
    return result.join(', ')
}