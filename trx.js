function extractWithNamedGroups(message) {
    const regex = /R#(?<trxid>\d+).+ (?<nominal>\w+).(?<tujuan>\d+) SUKSES. SNRef: (?<sn>.+). Saldo (?<SaldoAwal>.+)-(?<HargaJual>.+)=(?<SaldoAkhir>.+)@/;    
    const match = message.match(regex);
    console.log(match)
    
    if(match){
        const { trxid, nominal, tujuan, sn,SaldoAwal,HargaJual,SaldoAkhir } = match.groups;
        
        return {
            trxid,
            nominal,
            tujuan,
            sn,
            SaldoAwal,
            HargaJual,
            SaldoAkhir,

        };
    }
    
}
const testMessages = [
    'R#4475953 TDM2A.081231077567 SUKSES. SNRef: API7756720250523173755RRV.  Saldo 1.037.563 - 10.985=1.026.578 @23/05 17:38:10 * STP TURUN'
];

testMessages.forEach(message => {
    console.log('Original Message:', message);
    console.log('Extracted Details:', extractWithNamedGroups(message));
    console.log('-'.repeat(50));
});