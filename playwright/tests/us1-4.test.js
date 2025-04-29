import { test, expect } from '@playwright/test';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('test', async ({ page }) => {
  //US1-4 Delete a review
  await page.goto('https://deksomboon-massage.vercel.app/');
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  delay(2000);
  await expect(page.locator('div').filter({ hasText: /^user1The service is not satisfactory\.$/ }).first()).toBeVisible();
  await expect(page.locator('body')).toContainText('user1The service is not satisfactory.');
  delay(3000);

  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).fill('user1');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('User12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  await page.locator('div').filter({ hasText: /^user1The service is not satisfactory\.EditDelete$/ }).getByRole('button').nth(1).click();
  delay(2000);
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  delay(3000);
});