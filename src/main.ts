import { from, Observer, fromEvent, Observable, defer } from 'rxjs';
import { map, filter, delay, flatMap, mergeMap, retry, retryWhen, scan, takeWhile } from 'rxjs/operators';
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

/* Red dot mouse */
let circle = document.getElementById('circle');
let source4 = fromEvent(document, "mousemove")
    .pipe(
        map((e: MouseEvent) => {
            return {
                x: e.clientX,
                y: e.clientY
            }
        }),
        filter(value => value.x < 500),
        delay(300)
    );

function onNext(value) {
    // circle.style.left = value.x;
    // circle.style.top = value.y;
}
source4.subscribe(
    onNext,
    //value => console.log(value),
    err => console.log(`error: ${err}`),
    () => console.log("complete")
);



/* load movies json data */
let button = document.getElementById('button');
let output = document.getElementById('output');

let click = fromEvent(button, "click");

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open("GET", url);
        xhr.send();
    }).pipe(
        //retry(3), 
        retryWhen(retryStrategy({ attempts: 3, _delay: 1500 }))
    );

}

function loadWithFetch(url: string) {
    return defer(() => {
        return from(fetch(url).then(r => r.json()))
    });
}

function retryStrategy({ attempts = 4, _delay = 1000 }) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                console.log(acc, value);
                return acc + 1;
            }, 0),
            takeWhile(acc => acc < attempts),
            delay(_delay)
        )
    }
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

click.pipe(mergeMap(() => loadWithFetch("movies.json")))
    .subscribe({
        next: renderMovies,
        error: (error) => console.log("Retry 3 times! Errored: ", error),
        complete: () => console.log("Completed")
    });


