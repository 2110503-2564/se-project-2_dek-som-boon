import { test, expect } from '@playwright/test';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('test', async ({ page }) => {
  //US1-2 Create a review
  await page.goto('https://deksomboon-massage.vercel.app/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).click();
  await page.getByRole('textbox', { name: 'Enter your email or username' }).fill('user1');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('User12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  await page.getByRole('button', { name: 'Add a review' }).click();
  await page.locator('.bg-white > div > svg:nth-child(5) > path').click();
  await page.getByRole('textbox', { name: 'Write your review here...' }).click();
  await page.getByRole('textbox', { name: 'Write your review here...' }).fill('very good');
  await page.getByRole('button', { name: 'Post' }).click();
  await expect(page.getByText('user1very goodEditDelete')).toBeVisible();
  await expect(page.locator('body')).toContainText('user1very goodEditDelete');
  delay(2000);

  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Massage Shops' }).click();
  await page.locator('.relative > div > div').first().click();
  await page.getByRole('button', { name: 'Add a review' }).click();
  delay(2000);
  await expect(page.getByText('DekSomBoonMassageLoginEmail')).toBeVisible();
  await expect(page.locator('body')).toContainText('DekSomBoonMassageLoginEmail / UsernamePasswordLoginDon’t have an account? Register');
  delay(3000);
});