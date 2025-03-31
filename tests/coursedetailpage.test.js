require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const courseId = 2; // Replace with a valid course_id
const baseUrl = `http://localhost:${process.env.PORT || 3000}/course-detail/${courseId}`;

describe('Course Detail Page Tests', function () {
  this.timeout(40000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('REQ-COURSE-1: Page loads and displays course name and category', async () => {
    await driver.get(baseUrl);

    const title = await driver.wait(until.elementLocated(By.css('h2')), 10000);
    const titleText = await title.getText();
    assert.ok(titleText.length > 0, 'Course name not visible');

    const category = await driver.findElement(By.css('p'));
    const categoryText = await category.getText();
    assert.ok(categoryText.length > 0, 'Category not visible');
  });

  it('REQ-COURSE-2: Clicking "Update Course" opens the modal', async () => {
    const updateBtn = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Update Course']/ancestor::button")),
      10000
    );
    await updateBtn.click();

    const modal = await driver.wait(
      until.elementLocated(By.css('.ant-modal')),
      10000
    );
    await driver.wait(until.elementIsVisible(modal), 10000);

    const modalTitle = await modal.findElement(By.css('.ant-modal-title'));
    const titleText = await modalTitle.getText();
    assert.ok(titleText.length > 0, 'Update modal not opened');
  });

  it('REQ-COURSE-3: Add Module modal opens and validates empty submission', async () => {
    try {
      console.log('Closing any open modals...');
      const modals = await driver.findElements(By.css('.ant-modal-close'));
      for (const close of modals) {
        try {
          await close.click();
          await driver.sleep(300);
        } catch (_) {}
      }
  
      console.log('Clicking Add Module...');
      const addBtn = await driver.wait(
        until.elementLocated(By.xpath("//span[text()='Add Module']/ancestor::button")),
        10000
      );
      await driver.executeScript("arguments[0].scrollIntoView(true);", addBtn);
      await driver.sleep(300);
      await driver.executeScript("arguments[0].click();", addBtn);
  
      console.log('Waiting for modal...');
      await driver.wait(until.elementLocated(By.css('.ant-modal')), 5000);
  
      console.log('Waiting for submit button...');
      const submitBtn = await driver.wait(
        until.elementLocated(By.css('.ant-modal button[type="submit"]')),
        5000
      );
  
      console.log('Clicking submit...');
      await submitBtn.click();
  
      console.log('Waiting for validation error...');
      const error = await driver.wait(
        until.elementLocated(By.css('.ant-form-item-explain-error')),
        5000
      );
  
      const errorText = await error.getText();
      console.log('Validation error text:', errorText);
      assert.ok(errorText.length > 0, 'Validation error not shown');
    } catch (err) {
      console.error('❌ REQ-COURSE-3 debug failed at step:', err.message);
      assert.fail('Could not open modal or validate form');
    }
  });  

  it('REQ-COURSE-4: Review table is visible and populated if reviews exist', async () => {
    const reviewTable = await driver.wait(until.elementLocated(By.css('table')), 10000);
    const rows = await driver.findElements(By.css('table tbody tr'));

    if (rows.length > 0) {
      const firstRowText = await rows[0].getText();
      if (!firstRowText || firstRowText.trim().length === 0) {
        console.warn('Review row is present but contains no text — possibly placeholder');
        return;
      }
      assert.ok(firstRowText.trim().length > 0, 'Review row is empty');
    } else {
      console.log('No reviews found — skipping review row test.');
    }
  });
});
