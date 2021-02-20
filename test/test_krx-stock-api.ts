import krx from 'krx-stock-api';

class Person {
    //name : string
    constructor( private name: string) {
        
    }
   
    greet() {
      console.log(`Hi! I'm ${this.name}`);
    }
  }
   
const person = new Person('Sam');
person.greet();

(async () => {
try {
    const list = krx.getStockList();
    console.log(list); 
  const stock = await krx.getStock('005930');
  console.log(`${stock.name} : ${stock.price}원`); 
} catch (error) {
    console.error("에러",error);
}
    
}) ()


