function extractWithNamedGroups(message) {
    const regex = /#(?<trxid>\d+).+ (?<nominal>\w+).(?<tujuan>\d+) .+ status Sukses. SN\/Ref: (?<sn>\d+)./;    
    const match = message.match(regex);
    console.log(match)
    
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
    'R#4292958 Transaksi Double TDM13B1B.082135421251 sdh pernah jam 16:16, status Sukses. SN/Ref: 03783900001382270599.'
];

testMessages.forEach(message => {
    console.log('Original Message:', message);
    console.log('Extracted Details:', extractWithNamedGroups(message));
    console.log('-'.repeat(50));
});