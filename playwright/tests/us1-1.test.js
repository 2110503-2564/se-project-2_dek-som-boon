import { test, expect } from '@playwright/test';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('test', async ({ page }) => {
  //US1-1 System show all reviews
  await page.goto('https://deksomboon-massage.vercel.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).fill('user1');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('User12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  await expect(page.getByRole('heading', { name: 'Review Summary' })).toBeVisible();
  await expect(page.getByText('54321')).toBeVisible();
  await expect(page.getByText('User reviewYour')).toBeVisible();
  await delay(2000);
  
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  await expect(page.getByRole('heading', { name: 'Review Summary' })).toBeVisible();
  await expect(page.getByText('54321')).toBeVisible();
  await expect(page.getByText('User review')).toBeVisible();
  await delay(2000);
});