require("dotenv").config(); // Load environment variables
const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Contact Us Page Tests", function () {
  this.timeout(30000); // Timeout for all tests

  let driver;
  // Update the base URL to point to your Contact Us page.
  // const baseUrl = "http://localhost:" + process.env.REACT_APP_TESTING_PORT + "/contactus";
  const baseUrl = "http://localhost:3000/contactus"; //put this first if you want to test a single file

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  describe("Contact Us Form Testing", function () {
    it("should load the page with the correct title", async () => {
      await driver.get(baseUrl);
      const title = await driver.getTitle();
      console.log("Page title:", title);
      assert.strictEqual(title, "SC2006 Project");
    });

    it("should display all required form elements", async () => {
      await driver.get(baseUrl);
      // Wait for the "Contact Us" header (Ant Design's Title renders as h2)
      const header = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'Contact Us')]")),
        10000
      );
      assert.ok(await header.isDisplayed());

      // Check for Name input field by placeholder
      const nameField = await driver.findElement(
        By.xpath("//input[@placeholder='Your name']")
      );
      assert.ok(await nameField.isDisplayed());

      // Check for Email input field by placeholder
      const emailField = await driver.findElement(
        By.xpath("//input[@placeholder='Your email']")
      );
      assert.ok(await emailField.isDisplayed());

      // Check for Subject input field by placeholder
      const subjectField = await driver.findElement(
        By.xpath("//input[@placeholder='Subject']")
      );
      assert.ok(await subjectField.isDisplayed());

      // Check for Message textarea by placeholder
      const messageField = await driver.findElement(
        By.xpath("//textarea[@placeholder='Your message']")
      );
      assert.ok(await messageField.isDisplayed());
    });

    it("should allow submitting the Contact Us form", async () => {
      await driver.get(baseUrl);
    
      // Fill in the Name field
      await driver.findElement(By.xpath("//input[@placeholder='Your name']")).sendKeys("John Doe");
      // Fill in the Email field
      await driver.findElement(By.xpath("//input[@placeholder='Your email']")).sendKeys("john@example.com");
    
      // Click the feedback type dropdown trigger
      const selectTrigger = await driver.findElement(
        By.xpath("//div[contains(@class, 'ant-select-selector')]")
      );
      await selectTrigger.click();
    
      // Wait for the dropdown option "General Feedback" to be visible and clickable.
      const option = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class, 'ant-select-item-option-content') and normalize-space(text())='General Feedback']"
          )
        ),
        5000
      );
      await option.click();
    
      // Fill in the Subject field
      await driver.findElement(By.xpath("//input[@placeholder='Subject']")).sendKeys("Test Subject");
      // Fill in the Message field
      await driver.findElement(By.xpath("//textarea[@placeholder='Your message']")).sendKeys("Test Message");
    
      // Locate and click the "Submit Feedback" button using its type attribute
      const submitBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[@type='submit']")),
        5000
      );
      await submitBtn.click();
    
      // Wait for a success message: first wait for it to be located,
      // then wait until it is visible.
      const successMessageElement = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(@class, 'ant-message-success')]")),
        10000
      );
      await driver.wait(until.elementIsVisible(successMessageElement), 5000);
      assert.ok(await successMessageElement.isDisplayed());
    });
    
  });
});
