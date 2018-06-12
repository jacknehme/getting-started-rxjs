import { from, Observer, Observable } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, filter } from 'rxjs/operators';
/*
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
);

numbers.pipe(map((val: number) => val * 10 )).subscribe(new MyObserver());


let numbers2 = [1, 5, 10];

let source = Observable.create(observer => {
    for (let n of numbers2) {
        // if(n === 5){
        //     observer.error("something went wrong");
        // }
        observer.next(n)
    }
    observer.complete();
})

source.subscribe(
    value => console.log(`value: ${value}`),
    err => console.log(`error: ${err}`),
    () => console.log("complete")
);
 */
let numbers3 = [1, 5, 10];

let source3 = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers3[index++]);

        if (index < numbers3.length) {
            setTimeout(produceValue, 250);
        } else {
            observer.complete();
        }
    }
    produceValue();
}).pipe(
    map((n: number) => n * 2),
    filter(n => n > 4)
);

source3.subscribe(
    value => console.log(`value: ${value}`),
    err => console.log(`error: ${err}`),
    () => console.log("complete")
);

let source4 = fromEvent(document, "mousemove")
    // .pipe(
    //     map((n: number) => n * 2),
    //     filter(n => n > 4)
    // );

    source4.subscribe(
        value => console.log(value),
        err => console.log(`error: ${err}`),
        () => console.log("complete")
    );




