/* eslint-disable no-unused-expressions, no-unused-vars */

import chai from 'chai';
import supertest from 'supertest';
import { User, Role } from '../../models';
import app from '../../../server';
import helper from '../helpers/specHelpers';

const request = supertest.agent(app);
const expect = chai.expect;

const adminRoleParam = helper.adminRole;
const regularRoleParam = helper.regularRole;
const adminUserParam = helper.adminUser1;
const regularUserParam = helper.regularUser;
const testUserParam = helper.userDetails;


describe('User api', () => {
  let adminRole;
  let regularRole;
  let adminUser;
  let regularUser;
  let adminToken;
  let testUser;
  let regularToken;

  before((done) => {
    Role.findOne({ where: { title: 'admin' } })
    .then((foundAdmin) => {
      adminRole = foundAdmin;
    });
    request.post('/users')
    .send(adminUserParam)
    .end((err, res) => {
      adminUser = res.body.user;
      adminToken = res.body.token;
      done();
    });
  });

  describe('User sign in', () => {
    it('signs a user in with correct email and password', (done) => {
      request.post('/users/login')
        .send({ email: adminUser.email,
          password: adminUserParam.password })
        .expect(200)
        .end((err, res) => {
          expect(typeof res.body.token).to.equal('string');
          done();
        });
    });

    it('fails on incorrect email and/or password', (done) => {
      request.post('/users/login')
        .send({ username: 'incorrect user',
          password: 'incorrect password' })
        .expect(401)
        .end((err, res) => {
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('logs a user out', (done) => {
      request.post('/users/logout')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('You have been Logged out');
          done();
        });
    });
  });

  describe('Create a user: Validation:', () => {
    it('creates a unique user', (done) => {
      request.post('/users')
        .send(adminUserParam)
        .expect(400)
        .end((err, res) => {
          expect(res.body.message[0]).to.equal('username must be unique');
          done();
        });
    });

    it('tests if new user has first name and last name', (done) => {
      request.post('/users')
        .set({ 'x-access-token': adminToken })
        .send(regularUserParam)
        .expect(200)
        .end((err, res) => {
          regularUser = res.body.user;
          regularToken = res.body.token;
          expect(regularUser.firstname).to.exist;
          expect(regularUser.lastname).to.exist;
          done();
        });
    });

    it('ensures new user has a role', (done) => {
      request.post('/users')
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .end((err, res) => {
          expect(regularUser).to.have.property('RoleId');
          expect(regularUser.RoleId).to.equal(2);
          done();
        });
    });

    it(`ensures user cannot be created if one of email or
     password is lacking.`, (done) => {
      testUserParam.email = null;
      testUserParam.password = null;
      request.post('/users')
        .set({ 'x-access-token': adminToken })
        .send(testUserParam)
        .expect(422)
        .end((err, res) => {
          expect(res.body.message[0]).to.equal('email cannot be null');
          expect(res.body.message[1]).to.equal('password cannot be null');
          done();
        });
    });
  });

  describe('Find a user', () => {
    it('fails to get request if token is invalid', (done) => {
      request.get('/users/')
        .set({ 'x-access-token': 'invalidXYZABCtoken' })
        .expect(406)
        .end((err, res) => {
          expect(res.body.message).to.be.equal('Invalid token');
          done();
        });
    });

    it('returns error message for invalid input', (done) => {
      request.get('/users/hello')
        .set({ 'x-access-token': adminToken })
        .expect(400)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to
          .equal('invalid input syntax for integer: "hello"');
          done();
        });
    });

    it('fails to return a user if id is invalid', (done) => {
      request.get('/users/123')
        .set({ 'x-access-token': adminToken })
        .expect(404)
        .end((err, res) => {
          expect(res.body.message).to.be.equal('User not found');
          done();
        });
    });

    it('returns all users with pagination', (done) => {
      const fields = ['id', 'username', 'lastname', 'email', 'RoleId'];
      request.get('/users?limit=1&offset=0')
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .end((err, res) => {
          expect(Array.isArray(res.body.users)).to.equal(true);
          fields.forEach((field) => {
            expect(res.body.users[0]).to.have.property(field);
          });
          expect(res.body.pagination).to.not.be.null;
          done();
        });
    });

    it('returns user with a correct id', (done) => {
      request.get(`/users/${regularUser.id}`)
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(regularUser.email).to.equal(regularUserParam.email);
          done();
        });
    });
  });

  describe('Update user', () => {
    it('returns error message for invalid input', (done) => {
      request.get('/users/hello')
        .set({ 'x-access-token': adminToken })
        .expect(400)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to
          .equal('invalid input syntax for integer: "hello"');
          done();
        });
    });

    it('fails to update a user that does not exist', (done) => {
      request.put('/users/783')
        .set({ 'x-access-token': adminToken })
        .expect(404)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns all users with pagination', (done) => {
      const fields = ['id', 'username', 'lastname', 'email', 'RoleId'];
      request.get('/users?limit=1&offset=0')
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .end((err, res) => {
          expect(Array.isArray(res.body.users)).to.equal(true);
          fields.forEach((field) => {
            expect(res.body.users[0]).to.have.property(field);
          });
          expect(res.body.pagination).to.not.be.null;
          done();
        });
    });

    it('returns user with a correct id', (done) => {
      request.get(`/users/${regularUser.id}`)
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(regularUser.email).to.equal(regularUserParam.email);
          done();
        });
    });

    it('fails to update a user if user is not authorized', (done) => {
      request.put('/users/783')
        .expect(401)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
          .to.equal('Token required for access');
          done();
        });
    });

    it('fails if a regular user is assigned an admin role by non-admin ',
    (done) => {
      request.put('/users/2')
        .set({ 'x-access-token': regularToken })
        .send({
          RoleId: 1,
          lastname: 'Ben',
        })
        .expect(401)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.error).to
          .equal('Not authorized');
          done();
        });
    });

    it('fails to update a user if request is not made by the user',
    (done) => {
      request.put('/users/1')
        .set({ 'x-access-token': regularToken })
        .send({
          firstname: 'Oluwaseyi',
          lastname: 'Aromokeye',
        })
        .expect(401)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.error).to.equal('Not authorized');
          done();
        });
    });

    it('edits and updates a user', (done) => {
      request.put(`/users/${adminUser.id}`)
        .set({ 'x-access-token': adminToken })
        .send({
          firstname: 'Aromokeye',
          lastname: 'Omolade',
          password: 'new password',
        })
        .expect(200)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.firstname).to.equal('Aromokeye');
          expect(res.body.lastname).to.equal('Omolade');
          done();
        });
    });
  });

  describe('Delete user', () => {
    it('returns error message for invalid input', (done) => {
      request.get('/users/hello')
        .set({ 'x-access-token': adminToken })
        .expect(400)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to
          .equal('invalid input syntax for integer: "hello"');
          done();
        });
    });

    it('fails to delete a user by non-admin user', (done) => {
      request.delete(`/users/${regularUser.id}`)
        .set({ 'x-access-token': regularToken })
        .expect(401)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.error)
            .to.equal('Not authorized');
          done();
        });
    });

    it('fails when admin wants to delete self', (done) => {
      request.delete(`/users/${adminUser.id}`)
        .set({ 'x-access-token': adminToken })
        .expect(401)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
            .to.equal('You cannot delete yourself');
          done();
        });
    });
    it('fails to delete a user if user is not authorized', (done) => {
      request.delete('/users/1')
        .expect(401)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('Token required for access');
          done();
        });
    });

    it('fail to delete a user that does not exist', (done) => {
      request.delete('/users/123')
        .set({ 'x-access-token': adminToken })
        .expect(404)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('finds and deletes a user if user exist', (done) => {
      request.delete(`/users/${regularUser.id}`)
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('User is deleted');
          done();
        });
    });
  });
});
