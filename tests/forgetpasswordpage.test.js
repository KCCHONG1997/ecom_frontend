require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const baseUrl = `http://localhost:${process.env.PORT || 3000}/forgot-password`;

describe('Forget Password Page Tests', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('REQ-FORGOT-1: Page loads and displays email input, Reset Password button, and Back to Login link', async () => {
    await driver.get(baseUrl);

    const emailInput = await driver.wait(
      until.elementLocated(By.css("input[type='text']")),
      10000
    );
    const resetBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Reset Password']")),
      10000
    );
    const backToLogin = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Back to Login']")),
      10000
    );

    assert.ok(await emailInput.isDisplayed(), 'Email input is not visible');
    assert.ok(await resetBtn.isDisplayed(), 'Reset Password button is not visible');
    assert.ok(await backToLogin.isDisplayed(), 'Back to Login link is not visible');
  });

  it('REQ-FORGOT-2: Submitting an empty form shows validation error for missing email', async () => {
    await driver.get(baseUrl);

    const resetBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Reset Password']")),
      10000
    );
    await resetBtn.click();

    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Please enter your email!')]")),
      10000
    );
    const errorText = await errorMsg.getText();
    assert.ok(errorText.includes('Please enter your email!'), 'Missing email validation error not shown');
  });

  it('REQ-FORGOT-3: Submitting an invalid email shows validation error for email format', async () => {
    await driver.get(baseUrl);

    const emailInput = await driver.findElement(By.css("input[type='text']"));
    await emailInput.clear();
    await emailInput.sendKeys("invalid-email");

    const resetBtn = await driver.findElement(By.xpath("//button[text()='Reset Password']"));
    await resetBtn.click();

    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Invalid email format!')]")),
      10000
    );
    const errorText = await errorMsg.getText();
    assert.ok(errorText.includes('Invalid email format!'), 'Invalid email format validation error not shown');
  });

  it('REQ-FORGOT-4: Submitting a valid email displays a success message', async () => {
    await driver.get(baseUrl);

    const emailInput = await driver.findElement(By.css("input[type='text']"));
    await emailInput.clear();
    await emailInput.sendKeys("user@example.com");

    const resetBtn = await driver.findElement(By.xpath("//button[text()='Reset Password']"));
    await resetBtn.click();

    const successMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Password reset link sent! Check your email.')]")),
      10000
    );
    const successText = await successMsg.getText();
    assert.ok(
      successText.includes('Password reset link sent! Check your email.'),
      'Success message not shown on valid submission'
    );
  });

  it('REQ-FORGOT-5: Clicking "Back to Login" navigates to the login page', async () => {
    await driver.get(baseUrl);

    const backToLogin = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Back to Login']")),
      10000
    );
    await backToLogin.click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes('/login');
    }, 10000);

    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/login'), 'Did not navigate to the login page after clicking Back to Login');
  });
});