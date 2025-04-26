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
  delay(2000);

  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).fill('user1');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('User12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  await page.getByRole('button', { name: 'Del' }).first().click();
  await page.getByRole('button', { name: 'Delete' }).click();
  delay(2000);
  await expect(page.getByText('User reviewYour reviewuser1lolEditDeluser1teste313123EditDelAdmin')).toBeVisible();
  delay(2000);
});