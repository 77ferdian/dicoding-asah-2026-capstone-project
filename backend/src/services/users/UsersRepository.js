const bcrypt = require('bcrypt');
const pool = require('../../utils/dbPool');
const InvariantError = require('../../exceptions/InvariantError');

class UsersRepository {
  async addUser({ id, username, password, fullname }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (id, username, password, fullname)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [id, username, hashedPassword, fullname]
    );
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user.');
    }
    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length) {
      throw new InvariantError('Username sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE username = $1',
      [username]
    );
    if (!result.rows.length) {
      throw new InvariantError('Kredensial yang diberikan salah.');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new InvariantError('Kredensial yang diberikan salah.');
    }

    return id;
  }
}

module.exports = UsersRepository;
