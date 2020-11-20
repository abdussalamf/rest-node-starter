/**
 * Retrieves environment variable and throws if missing without default
 *
 * @param name name of environment variable
 * @param defaultVal
 */
const parseEnv = (name, defaultVal) => {
    let env = process.env[name];
    if (!env) {
      if (isNullOrUndefined(defaultVal)) {
        throw new Error(`Missing environment variable for ${name}`);
      }
      env = defaultVal;
    }
  
    return env;
  }
  
  /**
   * Retrieves environment variable as a number and throws if missing without default
   *
   * @param name name of environment variable
   * @param defaultVal
   */
const parseEnvNumber = (name, defaultVal) => {
    const number = parseInt(parseEnv(name, `${defaultVal}`));
    if (isNaN(number)) {
      throw new Error(`Bad environment variable for ${name}: Not a Number`);
    }
    return number;
}
  
  /**
   * Retrieves environment variable as a boolean and throws if missing without default
   *
   * @param name name of environment variable
   * @param defaultVal
   */
const parseEnvBoolean = (name, defaultVal) => {
    return parseEnv(name, `${defaultVal}`).toLowerCase() === "true";
}

exports.parseEnv = parseEnv;
exports.parseEnvNumber = parseEnvNumber;
exports.parseEnvBoolean = parseEnvBoolean;