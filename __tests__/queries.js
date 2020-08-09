import app from "../src/server"
import supertest from "supertest"
import { stopDatabase } from "../src/database"

const request = supertest(app);

afterAll(async () => {
    await stopDatabase();
});

test("fetch users", async done => {
    request
        .post("/graphql")
        .send({
            query: "{ users { id, name } }"
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err)
            } else {
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.data.users.length).toEqual(3);
                done();
            }
        });
});