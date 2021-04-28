function log (certificate, numcas){
if (numcas ==3){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 5000);
}

if (numcas ==4){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 6000);
}

if (numcas ==5){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 7000);
}

if (numcas ==6){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 8000);
}

if (numcas ==7){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 10000);
}

if (numcas ==8){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 11000);
}

if (numcas ==9){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 12000);
}

if (numcas ==10){
    setTimeout(() => {
        console.log(certificate)
        console.log('certificate has been signed by ', numcas, ' CAs')
    }, 12000);
}
}

module.exports = {log}