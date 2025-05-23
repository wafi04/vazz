function extractWithNamedGroups(message) {
    const regex = /#2R(?<trxid>\d+).+ (?<nominal>\w+).(?<tujuan>\d+) SUKSES. SN\/Ref: (?<sn>.+). Saldo (?<SaldoAwal>.+)-(?<HargaJual>.+)=(?<SaldoAkhir>.+)@+/;    
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
    '#2R4471389  ITP12.085712248830 SUKSES. SN/Ref: 085641118963 berhasil melakukan transfer pulsa ke 085712248830 dg transid 9151291747980386888093. Saldo 1.790.463-12.467=1.777.996 @23/05 13:06:37#TRX NORMAL BOSKU'
];

testMessages.forEach(message => {
    console.log('Original Message:', message);
    console.log('Extracted Details:', extractWithNamedGroups(message));
    console.log('-'.repeat(50));
});