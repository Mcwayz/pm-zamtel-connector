const axios = require('axios');

const getZamtelParties = async (data) => {
  try {
    const tokenResponse = await axios.post(process.env.AIRTEL_URL + '/auth/oauth2/token', {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET_KEY,
        grant_type: 'client_credentials'
    });
  
    const accessToken = tokenResponse.data.access_token;

    let msisdn = null;
    if (data.idValue.length == 9) msisdn = data.idValue;
    else if (data.idValue.length > 9) msisdn = data.idValue.slice(3);
    else msisdn = data.idValue;
  
    try {
        const kycResponse = await axios.get(process.env.AIRTEL_URL + '/standard/v1/users/' + msisdn, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Country': 'ZM',
                'X-Currency': 'ZMW',
                'Content-Type': 'application/json'
            }
        });

        console.log(`-> ${new Date()} :: GET ${process.env.AIRTEL_URL}/standard/v1/users/${msisdn}: ${JSON.stringify(kycResponse.data)}`);

        if (kycResponse.status === 200) {
            if (kycResponse.data.status.response_code == "200") {
                const returnData = {
                    'dateOfBirth': null,
                    'displayName': kycResponse.data.data.first_name + ' ' + kycResponse.data.data.last_name,
                    'extensionList': [
                        {
                            'key': 'string',
                            'value': 'string'
                        }
                    ],
                    'firstName': kycResponse.data.data.first_name,
                    'fspId': 'Airtel',
                    'idType': 'MSISDN',
                    'idValue': '260' + kycResponse.data.data.msisdn,
                    'lastName': kycResponse.data.data.last_name,
                    'merchantClassificationCode': '0',
                    'middleName': null,
                    'type': 'CONSUMER',
                    'supportedCurrencies': [
                        'ZMW'
                    ],
                    'kycInformation': 'string'
                };
                return returnData;
            } else if (kycResponse.data.status.response_code == "401") {
                const returnData = { "message": "User enquiry is failed.", "statusCode": "500" };
                return returnData;
            } else {
                const returnData = { "message": "Invalid MSISDN provided as input.", "statusCode": "404" };
                return returnData;
            }
        } else {
            const returnData = generateRandomData(msisdn);
            return returnData;
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log(`-> ${new Date()} :: GET ${process.env.AIRTEL_URL}/standard/v1/users/${msisdn}: KYC request failed with 403 Forbidden - ${error.response.data}`);
            const returnData = generateRandomData(msisdn);
            return returnData;
        } else {
            const returnData = { "message": `KYC request failed ${error.message}`, "statusCode": "500" };
            console.log(`-> ${new Date()} :: GET ${process.env.AIRTEL_URL}/standard/v1/users/${msisdn}: ERROR - ${JSON.stringify(returnData)}`);
            return returnData;
        }
    }    
  } catch (error) {
    console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
    return { error: error.message };
  }
};

module.exports = { getZamtelParties };