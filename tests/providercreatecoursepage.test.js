require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const baseUrl = `http://localhost:${process.env.PORT || 3000}/provider-create-course`;

describe('Provider Create Course Page Tests', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('REQ-CREATE-1: Page loads and displays header "Create a New Course"', async () => {
    await driver.get(baseUrl);
    const header = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const headerText = await header.getText();
    assert.ok(headerText.includes('Create a New Course'), 'Header is missing or incorrect');
  });

  it('REQ-CREATE-2: Required fields validation errors are shown when submitting empty form', async () => {
    const submitBtn = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 10000);
    await submitBtn.click();
    const titleError = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Please input course title!')]")),
      10000
    );
    const descriptionError = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Please input course description!')]")),
      10000
    );

    const titleErrorText = await titleError.getText();
    const descriptionErrorText = await descriptionError.getText();
    assert.ok(titleErrorText.length > 0, 'Course title validation error not shown');
    assert.ok(descriptionErrorText.length > 0, 'Course description validation error not shown');
  });

  it('REQ-CREATE-3: File upload component is present and functional', async () => {
    const uploadBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(.,'Click to Upload')]")),
      10000
    );
    const isDisplayed = await uploadBtn.isDisplayed();
    assert.ok(isDisplayed, 'Upload button is not visible');
    await uploadBtn.click();
    await driver.sleep(500);
  });

  it('REQ-CREATE-4: Successful form submission clears the form and shows a success message', async () => {
    const titleInput = await driver.findElement(By.css("input[placeholder='Enter course title']"));
    const descInput = await driver.findElement(By.css("textarea[placeholder='Enter course description']"));
    const priceInput = await driver.findElement(By.css("input[placeholder='Please input course price!']"));
    const capacityInput = await driver.findElement(By.css("input[placeholder='Please input maximum capacity!']"));
    const categoryInput = await driver.findElement(By.css("input[placeholder='Enter category']"));
    const hoursInput = await driver.findElement(By.css("input[placeholder='']")); // For total training hours, using a generic selector

    await titleInput.clear();
    await titleInput.sendKeys('Test Course Title');
    await descInput.clear();
    await descInput.sendKeys('Test Course Description');
    await priceInput.clear();
    await priceInput.sendKeys('100');
    await capacityInput.clear();
    await capacityInput.sendKeys('30');
    await categoryInput.clear();
    await categoryInput.sendKeys('Test Category');
    await hoursInput.clear();
    await hoursInput.sendKeys('10');

    const submitBtn = await driver.findElement(By.xpath("//button[@type='submit']"));
    await submitBtn.click();

    const successMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Course created successfully!')]")),
      10000
    );
    const successText = await successMsg.getText();
    assert.ok(successText.includes('Course created successfully!'), 'Success message not shown');

    const titleValue = await titleInput.getAttribute('value');
    assert.strictEqual(titleValue, '', 'Form was not reset after submission');
  });
});