import 'jest-extended';
import {debounce$, throttle$} from '../methodDecorator';

describe('debounce$', () => {
    it('should be a function', () => expect(debounce$).toBeFunction());
    test('support method usage', (done) => {
        class A {
            count = 0;
            @debounce$(5)
            add() {this.count++} 
        }
        const a = new A();
        a.add()
        a.add()
        a.add()
        setTimeout(() => {
            expect(a.count).toBe(1);
            done();
        }, 5)
    });

    test('support property usage', (done) => {
        class A {
            count = 0;
            @debounce$(5)
            add = () => this.count++
        }
        const a = new A();
        a.add()
        a.add()
        a.add()
        setTimeout(() => {
            expect(a.count).toBe(1);
            done();
        }, 5)
    });
})

describe('throttle$', () => {
    it('should be a function', () => expect(throttle$).toBeFunction());
    test('support method usage', (done) => {
        class A {
            count = 0;
            @throttle$(5)
            add() {this.count++} 
        }
        const a = new A();
        a.add()
        a.add()
        a.add()
        setTimeout(() => {
            expect(a.count).toBe(1);
            done();
        }, 5)
    });

    test('support property usage', (done) => {
        class A {
            count = 0;
            @throttle$(5)
            add = () => this.count++
        }
        const a = new A();
        a.add()
        a.add()
        a.add()
        setTimeout(() => {
            expect(a.count).toBe(1);
            done();
        }, 5)
    });
})