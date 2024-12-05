require("dotenv").config(); // Load environment variables
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../PageObject/LoginPageObject");
const { baseUrl } = require("../config");

describe("Authentication Features", function () {
  this.timeout(10000); // Set the timeout for this suite
  let driver;
  let loginPage;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    loginPage = new LoginPage(driver);
  });

  after(async function () {
    await driver.quit(); // Close WebDriver after all tests
  });

  describe("Authentication: Login Testing", function () {
    beforeEach(async function () {
      await loginPage.open(baseUrl); // Navigate to the login page
    });

    it("AUTH-1: Login Page should load the username/email and password input field together with submit button", async function () {
      const usernameField = await driver.findElement(loginPage.usernameInput);
      assert.ok(
        await usernameField.isDisplayed(),
        "Username input is not displayed"
      );

      const passwordField = await driver.findElement(loginPage.passwordInput);
      assert.ok(
        await passwordField.isDisplayed(),
        "Password input is not displayed"
      );

      const submitButton = await driver.findElement(loginPage.submitButton);
      assert.ok(
        await submitButton.isDisplayed(),
        "Submit button is not displayed"
      );
    });

    it("AUTH-2: When user inputs invalid username and password, an error message should show up", async function () {
      await loginPage.enterUsername("randomTestUsername_1");
      await loginPage.enterPassword("enterAnyPassword");

      await loginPage.clickSubmit();

      const errorMessage = await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(), 'Login Failed: Invalid credentials')]")
        ),
        15000 // Wait up to 15 seconds
      );

      await driver.wait(until.elementIsVisible(errorMessage), 10000);

      const errorText = await errorMessage.getText();

      assert.strictEqual(
        errorText,
        "Login Failed: Invalid credentials",
        "Error message text is incorrect"
      );
    });

    it("AUTH-3: When user submits an empty form, error messages below the inputs should show up", async function () {
      await loginPage.clickSubmit();

      const errorMessage1 = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//*[contains(text(), 'Please input your username or email!')]"
          )
        ),
        15000 // Wait up to 15 seconds
      );

      const errorMessage2 = await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(), 'Please input your password!')]")
        ),
        15000 // Wait up to 15 seconds
      );

      await driver.wait(until.elementIsVisible(errorMessage1), 5000);
      await driver.wait(until.elementIsVisible(errorMessage2), 5000);

      const errorText1 = await errorMessage1.getText();
      const errorText2 = await errorMessage2.getText();

      assert.strictEqual(
        errorText1,
        "Please input your username or email!",
        "Error message text is incorrect"
      );

      assert.strictEqual(
        errorText2,
        "Please input your password!",
        "Error message text is incorrect"
      );
    });

    it("AUTH-4: When user enters a valid username and password, the system should redirect to the home page", async function () {
      // Enter valid credentials
      await loginPage.enterUsername("john_doe");
      await loginPage.enterPassword("hashed_password_1");
      await loginPage.clickSubmit();

      // Wait for the page URL to change to the home page
      await driver.wait(
        async () => {
          const currentUrl = await driver.getCurrentUrl();
          return currentUrl === baseUrl + "/";
        },
        15000, // Wait up to 15 seconds
        "Did not redirect to the home page"
      );

      // Verify the current URL
      const currentUrl = await driver.getCurrentUrl();
      console.log("Redirected URL:", currentUrl);
      assert.strictEqual(
        currentUrl,
        baseUrl + "/",
        "Redirection to the home page failed"
      );

      // Wait for the top-right nav bar user dropdown to be located
      const userDropdown = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="root"]/div/header/div[2]/div/div/div[2]/div')
        ),
        15000, // Wait up to 15 seconds
        "User dropdown not found"
      );

      // Wait for the user dropdown to be visible
      await driver.wait(until.elementIsVisible(userDropdown), 5000);

      // Retrieve the text inside the dropdown container
      const fullDropdownText = await userDropdown.getText();

      // Retrieve the text inside the span
      const spanElement = await userDropdown.findElement(By.xpath(".//span"));
      const spanText = await spanElement.getText();

      // Remove the span text from the full dropdown text to isolate the second text
      const secondText = fullDropdownText.replace(spanText, "").trim();

      // Verify the second text is the username
      assert.strictEqual(
        secondText,
        "john_doe", // Replace with the expected second text
        "Username is not displayed correctly as the second text in the dropdown"
      );
    });

  });
});
