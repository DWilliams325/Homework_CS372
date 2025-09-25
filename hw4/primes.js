function find_primes (x,y){
    for(let i =x; i<=y; i++) {
        let isPrime = true;

        if(i < 2){
            isPrime = false;
        }
        for(let z=2; z<= Math.sqrt(i); z++){
            if(i%z === 0){
                isPrime=false;
                break
            }
        }
     if(isPrime === true){
        console.log(i);
     }
    }
}

console.log(find_primes(1,10))
console.log(find_primes(-1,10))
console.log(find_primes(11,19))
console.log(find_primes(-1,1))
console.log(find_primes(100,10))