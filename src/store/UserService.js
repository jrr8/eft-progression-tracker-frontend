/**
 * Service for user lookups
 */
import User from "../models/User";

const options = {
  get userKey() { return 'user'; },
};

export default {
  fetchUser() {
    return new Promise((resolve) => {
      const userData = localStorage.getItem(options.userKey);

      const user = userData ? JSON.parse(userData) : {};

      resolve(new User(user));
    });
  }
}
