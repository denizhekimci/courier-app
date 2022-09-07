db.auth('root', 'courier123');
db.createSiblings('courierdb');
db.createUser(
    {
        user: "root",
        pwd: "courier123",
        roles: [
          { role: "readWrite", db: "courierdb" }
        ]
    })
db.createCollection('couriers');