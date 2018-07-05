const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

const todos = [{
    text: 'First test todo',
    _id: new ObjectID()
}, {
    text: 'Second test todo',
    _id: new ObjectID(),
    completedAt: 333,
    completed: true
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    })

    it('should not create todo when passing invalid input', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })

    it('should return a 400 if id is invalid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(400)
            .end(done);
    })
})

describe('DELETE /todos/:id', () => {
    it('should delete todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    done(err);
                } else {
                    Todo.findById(hexId).then((todo) => {
                        expect(todo).toBeNull();
                        done();
                    }, (e) => {
                        done(e);
                    })
                }
            });
    })
    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })

    it('should return a 400 if id is invalid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(400)
            .end(done);
    })
})

describe('PATCH /todos/:id', () => {
    var hexId = todos[0]._id.toHexString();
    it('should update the todo', (done) => {
        var text = 'Test text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    })

    it('should clear completedAt when todo is set to not completed', (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .send({completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    })
})