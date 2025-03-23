import mongoose from 'mongoose';

const server = 'localhost:27017';
const database = 'medic';

class Database {
  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      await mongoose.connect(`mongodb://${server}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      console.log('Database connection successful');
      console.log('Conectado ao banco:', mongoose.connection.name);

      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections disponíveis:', collections.map(col => col.name));
      
    } catch (err) {
      console.error('Database connection error:', err);
    }
  }
}

export default new Database();
