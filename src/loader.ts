import { Observable, defer, from, throwError } from "rxjs";
import { retryWhen, scan, takeWhile, delay } from "rxjs/operators";


export function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        let onLoad = () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        }

        xhr.addEventListener("load", onLoad);

        xhr.open("GET", url);
        xhr.send();

        return () => {
            console.log("Cleanup");
            xhr.removeEventListener('load', onLoad);
            xhr.abort();
        }

    }).pipe(
        //retry(3),
        retryWhen(retryStrategy({ attempts: 3, _delay: 1500 }))
    );
};

export function loadWithFetch(url: string) {
    return defer(() => {
        return from(fetch(url).then(r => {
            if (r.status === 200) {
                return r.json();
            } else {
                return Promise.reject(r);
            }
        }))
    }).pipe(
        retryWhen(retryStrategy())
    );
}

function retryStrategy({ attempts = 4, _delay = 1000 } = {}) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(`${value}`)
                }
            }, 0),
            delay(_delay)
        )
    }
}