const axios = require('axios');



const postRequestToPayTransfer = async (data) => {
    try {
        const endpoint = process.env.ZAMTEL_SDK_SCHEME_ADAPTER + '/requestToPayTransfer';

        const requestToPayTransferResponse = await axios.post(endpoint, data,
        {
            headers : {
              'Content-Type': 'application/json',
              'Accept': '*/*'
            }
        });

        const r2ptData = requestToPayTransferResponse.data;

        let msisdn = r2ptData.from.idValue;
        if (r2ptData.from.idValue.length > 9) msisdn = msisdn.slice(3);

        let zamtelEndpoint = process.env.BASE_URL + '/zamtel/collections/push-payment';

        const payload = {
            'transactionId': r2ptData.transactionRequestId,
            'mobile': msisdn,
            'amount': r2ptData.transferAmount,
            'reference': `Get ${r2ptData.transferAmount} from ${msisdn}`
        };

        const zamtelPushResponse = await axios.post(zamtelEndpoint, payload);

        console.log(`-> ${new Date()} :: POST ${process.env.ZAMTEL_URL}/zamtel/collections/push-payment: ${JSON.stringify(zamtelPushResponse.data)}`);

        // wait for 15 seconds before checking for the transaction status
        await new Promise(resolve => setTimeout(resolve, 10000));

        if (airtelPushResponse.data.status.response_code === 'DP00800001006') {
            let transactionStatus = null;
            transactionStatus = "Successful";
            if (transactionStatus === "Successful") {
                // transfer approved
                console.log(`-> ${new Date()} :: USSD Push Approved`);

                const internalEndpoint = process.env.ZAMTEL_SDK_SCHEME_ADAPTER + '/requestToPayTransfer/' + r2ptData.transactionRequestId;

                const response = await axios.put(internalEndpoint,
                {   acceptQuote: "true"  },
                {
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                console.log(`-> ${new Date()} :: PUT /requestToPayTransfer/${r2ptData.transactionRequestId}: {  "acceptQuote":"true"  }`);
                console.log("Response: ", response.data);

                return response.data;
            } else {
                // transfer declined
                console.log(`-> ${new Date()} :: USSD Push Declined`);

                const internalEndpoint = process.env.ZAMTEL_SDK_SCHEME_ADAPTER + '/requestToPayTransfer/' + r2ptData.transactionRequestId;

                const response = await axios.put(internalEndpoint,
                {   acceptQuote: "false"  },
                {
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                console.log(`-> ${new Date()} :: PUT /requestToPayTransfer/${r2ptData.transactionRequestId}: {  "acceptQuote":"false"  }`);
                console.log("Response: ", response.data);

                return response.data;
            }
        } else {
            console.log(`-> ${new Date()} :: USSD Push Failed!`);
            const internalEndpoint = process.env.ZAMTEL_SDK_SCHEME_ADAPTER + '/requestToPayTransfer/' + r2ptData.transactionRequestId;

            const response = await axios.put(internalEndpoint,
            {   acceptQuote: "false"  },
            {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });

            console.log(`-> ${new Date()} :: PUT /requestToPayTransfer/${r2ptData.transactionRequestId}: {  "acceptQuote":"false"  }`);
            console.log("Response: ", response.data);

            return response.data;
        }
    } catch (error) {
        console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
        return { error: error.message };
    }
};

module.exports = { postRequestToPayTransfer };
