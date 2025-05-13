function extractWithNamedGroups(message) {
    const regex = /#(?<trxid>\d+) (?<nomimal>\w+).(?<tujuan>\d+) SUKSES. SN\/Ref: (?<sn>.+)/;    
    const match = message.match(regex);
    
    console.log('Match result:', match);
    
    if(match){
        const { trxid, nominal, tujuan, sn } = match.groups;
        
        return {
            trxid,
            nominal,
            tujuan,
            sn
        };
    }
    
}
const testMessages = [
    'dddw232421 #4251432 GOPAY100.08561434542 SUKSES. SN/Ref: GOPAY - 08561434542'
];

testMessages.forEach(message => {
    console.log('Original Message:', message);
    console.log('Extracted Details:', extractWithNamedGroups(message));
    console.log('-'.repeat(50));
});