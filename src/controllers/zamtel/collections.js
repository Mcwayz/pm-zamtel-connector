const axios = require('axios');
const xml2js = require('xml2js');

const pushZamtelPayment = async (data) => {
  const headers = {
    'Content-Type': 'text/xml',
    'SOAPAction': '#POST',
  };

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:req="http://example.com/req" xmlns:com="http://example.com/com">
      <soapenv:Header/>
      <soapenv:Body>
        <req:Request>
          <req:Identity>
            <req:Initiator>
              <req:IdentifierType>11</req:IdentifierType>
              <req:Identifier>${data.initiatorIdentifier}</req:Identifier>
              <req:SecurityCredential>${data.securityCredential}</req:SecurityCredential>
              <req:ShortCode>${data.shortCode}</req:ShortCode>
            </req:Initiator>
            <req:ReceiverParty>
              <req:IdentifierType>1</req:IdentifierType>
              <req:Identifier>${data.receiverPartyIdentifier}</req:Identifier>
            </req:ReceiverParty>
          </req:Identity>
          <req:TransactionRequest>
            <req:Parameters>
              <req:Amount>${data.amount}</req:Amount>
              <req:Currency>${data.currency}</req:Currency>
              <req:ReasonType>${data.reasonType}</req:ReasonType>
            </req:Parameters>
          </req:TransactionRequest>
          <req:ReferenceData>
            <req:ReferenceItem>
              <com:Key>Comment2Customer</com:Key>
              <com:Value>${data.comment}</com:Value>
            </req:ReferenceItem>
          </req:ReferenceData>
        </req:Request>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.ZAMTEL_URL, soapBody, { headers });
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    return result;
  } catch (error) {
    console.error('Error Sending Zamtel B2C Payment:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { pushZamtelPayment };
