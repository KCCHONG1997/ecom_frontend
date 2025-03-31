require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const baseUrl = `http://localhost:${process.env.PORT || 3000}/provider-dashboard`;

describe('Provider Dashboard Page Tests', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('REQ-PROVIDER-1: Page loads and displays dashboard header', async () => {
    await driver.get(baseUrl);
    const header = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const headerText = await header.getText();
    assert.ok(headerText.includes('Provider Management Dashboard'), 'Dashboard header not visible or incorrect');
  });

  it('REQ-PROVIDER-2: "My Courses" tab is active with course table and New Course button', async () => {
    const courseTable = await driver.wait(until.elementLocated(By.css('table')), 10000);
    const newCourseBtn = await driver.wait(until.elementLocated(By.xpath("//button[text()='New Course']")), 10000);
    
    const tableDisplayed = await courseTable.isDisplayed();
    const btnDisplayed = await newCourseBtn.isDisplayed();
    
    assert.ok(tableDisplayed, 'Course table is not visible');
    assert.ok(btnDisplayed, 'New Course button is not visible');
  });

  it('REQ-PROVIDER-3: Clicking "Update" on a course opens the update modal', async () => {
    const updateBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Update']")),
      10000
    );
    await updateBtn.click();
    
    const modal = await driver.wait(until.elementLocated(By.css('.ant-modal')), 10000);
    await driver.wait(until.elementIsVisible(modal), 10000);

    const modalContent = await modal.findElement(By.css('form'));
    const isModalDisplayed = await modalContent.isDisplayed();
    
    assert.ok(isModalDisplayed, 'Update modal did not open correctly');

    const closeBtn = await driver.wait(
      until.elementLocated(By.css('.ant-modal-close')),
      10000
    );
    await closeBtn.click();
  });

  it('REQ-PROVIDER-4: "Delete" on a course triggers a confirmation dialog', async () => {
    const deleteBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(@class, 'ant-btn-danger') and text()='Delete']")),
      10000
    );
    await deleteBtn.click();
    
    const confirmDialog = await driver.wait(until.elementLocated(By.css('.ant-modal-confirm')), 10000);
    const confirmTitle = await confirmDialog.findElement(By.css('.ant-modal-confirm-title'));
    const titleText = await confirmTitle.getText();
    
    assert.ok(titleText.includes('Are you sure you want to delete this course?'), 'Confirmation dialog not shown');
    
    const cancelBtn = await confirmDialog.findElement(By.xpath("//button[text()='Cancel']"));
    await cancelBtn.click();
  });

  it('REQ-PROVIDER-5: "Enrollments" tab displays the enrollments table with Remove Learner actions', async () => {
    const enrollmentsTab = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(@class, 'ant-tabs-tab') and contains(., 'Enrollments')]")),
      10000
    );
    await enrollmentsTab.click();
    
    const enrollmentTable = await driver.wait(until.elementLocated(By.css('table')), 10000);
    const rows = await driver.findElements(By.css('table tbody tr'));
    
    if (rows.length > 0) {
      const removeBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Remove Learner']")),
        10000
      );
      const btnDisplayed = await removeBtn.isDisplayed();
      assert.ok(btnDisplayed, 'Remove Learner button not visible in enrollment row');
    } else {
      console.log('No enrollments found — skipping Remove Learner button test.');
    }
  });
});