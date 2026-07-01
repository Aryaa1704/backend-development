import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';

let mongo;

test.before(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDatabase(mongo.getUri());
});

test.after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('register, login, and manage tasks', async () => {
  const register = await request(app).post('/api/v1/auth/register').send({
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
  });
  assert.equal(register.status, 201);
  assert.ok(register.body.token);

  const login = await request(app).post('/api/v1/auth/login').send({ email: 'demo@example.com', password: 'password123' });
  assert.equal(login.status, 200);

  const createTask = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({ title: 'Learn APIs', description: 'Build the first task' });
  assert.equal(createTask.status, 201);

  const listTasks = await request(app).get('/api/v1/tasks').set('Authorization', `Bearer ${login.body.token}`);
  assert.equal(listTasks.status, 200);
  assert.equal(listTasks.body.count, 1);
});
