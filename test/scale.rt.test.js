import Scale from '../src/scale.js';

let item = {
    left: 100,
    top: 100,
    rotate: 0,
    width: 100,
    height: 100,
    opcaity:1,  
}

Scale.start(200, 100, item)
console.log()

test('rt scale', () => {
    let res = Scale.rt(250, 50)
    expect(res).toEqual({
        "height": 150,
        "left": 100,
        "top": 50,
        "width": 150,
    });
});

