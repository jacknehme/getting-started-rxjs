import { from, Observer } from 'rxjs';

let numbers = from([1, 5, 10]);

class MyObserver implements Observer<number>{

    next(value){
        console.log(`value: ${value}`);
    }

    error(e) {
        console.log(`error: ${e}`);
    }

    complete() {
        console.log("complete")
    }
}

numbers.subscribe(new MyObserver());
numbers.subscribe(
    value => console.log(`value: ${value}`),
    err => console.log(`error: ${err}`),
    () => console.log("complete")
)