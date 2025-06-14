function extractWithNamedGroups(message) {
    const regex = /<mlinkResponse>.+<message>.+ (?<product>\w+) KE (?<tujuan>\w+) , TELAH (?<status>\w+). .+<\/message><sn>(?<sn>\w+)<\/sn><ref_id>(?<refid>\d+)<\/ref_id><\/mlinkResponse>/;    
    const match = message.match(regex);
    console.log(match)
}
const testMessages = [
   `
        <mlinkResponse><trx_id>4639801</trx_id><trx_status>000</trx_status><message>TRANSAKSI BERULANG ISI TRP100L3 KE 08993319172 , TELAH SUKSES. SAL=726772,HRG=95595,ID=749002855325,SN=0604GM11339319</message><sn>0604GM11339319</sn><ref_id>1749002855325</ref_id></mlinkResponse>
    `
];

testMessages.forEach(message => {
    console.log('Original Message:', message);
    console.log('Extracted Details:', extractWithNamedGroups(message));
    console.log('-'.repeat(50));
});