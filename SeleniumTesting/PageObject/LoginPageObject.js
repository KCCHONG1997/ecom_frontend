const { By } = require("selenium-webdriver");

class LoginPage {
  constructor(driver) {
    this.driver = driver;

    // Define locators
    this.usernameInput = By.xpath('//*[@id="login_username"]');
    this.passwordInput = By.xpath('//*[@id="login_password"]');
    this.submitButton = By.xpath(
      '//*[@id="login"]/div[4]/div/div/div/div/button'
    );
  }

  // Navigate to the login page
  async open(baseUrl) {
    await this.driver.get(`${baseUrl}/login`);
  }

  // Input username
  async enterUsername(username) {
    const usernameField = await this.driver.findElement(this.usernameInput);
    await usernameField.sendKeys(username);
  }

  // Input password
  async enterPassword(password) {
    const passwordField = await this.driver.findElement(this.passwordInput);
    await passwordField.sendKeys(password);
  }

  // Click the submit button
  async clickSubmit() {
    const submitButton = await this.driver.findElement(this.submitButton);
    await submitButton.click();
  }

  // Perform a full login
  async login(baseUrl, username, password) {
    await this.open(baseUrl); // Navigate to login page
    await this.enterUsername(username); // Input username
    await this.enterPassword(password); // Input password
    await this.clickSubmit(); // Click submit button
  }
}

module.exports = LoginPage;
