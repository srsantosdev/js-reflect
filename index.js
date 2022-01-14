'use strict'

const assert = require('assert')

// GARANTIR SEMANTICA E SEGURANCA NOS OBJETOS

// ===== apply

const myObject = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue
  }
}

assert.deepStrictEqual(myObject.add.apply({ arg1: 10, arg2: 20 }, [100]), 130)

// PROBLEMA QUE PODE ACONTECER (RARO)
// Function.prototype.apply = () => {
//   throw new TypeError('Erro no apply')
// }

// PROBLEMA QUE ACONTECE 
myObject.add.apply = function () {
  throw new TypeError('Erro no apply no myObject')
}

assert.throws(() => myObject.add.apply({}, []), {
  name: 'TypeError',
  message: 'Erro no apply no myObject'
})

// USANDO O REFLECT
const result = Reflect.apply(myObject.add, { arg1: 10, arg2: 20 }, [100])
assert.deepStrictEqual(result, 130)

// ===== apply

// QUESTOES SEMANTICAS

// ====== defineProperty
function MyDate() { }

Object.defineProperty(MyDate, 'withObject', { value: () => 'Hey there' })

Reflect.defineProperty(MyDate, 'withReflection', { value: () => 'Hello World' })

assert.deepStrictEqual(MyDate.withObject(), 'Hey there')
assert.deepStrictEqual(MyDate.withReflection(), 'Hello World')
// ====== defineProperty

// ====== deleteProperty

const withDelete = { user: 'Samuel Ramos' }
// SEM PERFORMANCE (EVITAR AO MAXIMO)
delete withDelete.user

assert.deepStrictEqual(!!withDelete.user, false)
assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false)

const withReflection = { user: 'Samuel Santos' }
Reflect.deleteProperty(withReflection, 'user')

assert.deepStrictEqual(withReflection.hasOwnProperty('user'), false)
assert.deepStrictEqual(!!withReflection.user, false)

// ====== deleteProperty

// ====== GET

// Deveriamos fazer get somente em instancias de referencia
assert.deepStrictEqual(1['username'], undefined)

// COM REFLECTION, UMA EXCECAO É LANCADA
assert.throws(() => Reflect.get(1, 'username'), TypeError)

// ====== GET

// ====== HAS
assert.ok('user' in { user: 'samuel' })
assert.ok(!('user' in { age: 24 }))

assert.ok(Reflect.has({ user: 'samuel' }, 'user'))
assert.ok(!Reflect.has({ age: 24 }, 'user'))
// ====== HAS

// ===== ownKeys
const user = Symbol('user')
const databaseUser = { 
  id: 1,
  [Symbol.for('password')]: 123,
  [user]: 'samuelramos'
}

/**
 * Com os metodos de object, temos que fazer duas requisicoes
 */
const objectKeys = [
  ...Object.getOwnPropertyNames(databaseUser),
  ...Object.getOwnPropertySymbols(databaseUser)
]
assert.deepStrictEqual(objectKeys, ['id', Symbol.for('password'), user])

Reflect.ownKeys(databaseUser)
assert.deepStrictEqual(Reflect.ownKeys(databaseUser), ['id', Symbol.for('password'), user])