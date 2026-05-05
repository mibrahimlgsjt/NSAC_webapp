from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # It's a mobile-first app, so capture mobile viewport primarily
        page = browser.new_page(viewport={"width": 375, "height": 812}) 
        
        try:
            # 1. Homepage
            page.goto("http://127.0.0.1:5000/", wait_until="networkidle")
            page.screenshot(path="screenshot_home_mobile.png", full_page=True)
            print("Captured Homepage (Mobile)")

            # 2. Login Page
            page.goto("http://127.0.0.1:5000/login", wait_until="networkidle")
            page.screenshot(path="screenshot_login_mobile.png")
            print("Captured Login Page (Mobile)")

            # 3. Admin Portal (After Login)
            page.fill("input[name='username']", "admin")
            page.fill("input[name='password']", "NSAC2026")
            page.click("button[type='submit']")
            # Wait for navigation to complete
            page.wait_for_url("**/admin**")
            # Wait for content to load
            time.sleep(1) 
            page.screenshot(path="screenshot_admin_mobile.png", full_page=True)
            print("Captured Admin Portal (Mobile)")

            # 4. Desktop views
            page.set_viewport_size({"width": 1280, "height": 720})
            
            page.goto("http://127.0.0.1:5000/", wait_until="networkidle")
            page.screenshot(path="screenshot_home_desktop.png", full_page=True)
            print("Captured Homepage (Desktop)")

            page.goto("http://127.0.0.1:5000/admin", wait_until="networkidle")
            time.sleep(1)
            page.screenshot(path="screenshot_admin_desktop.png", full_page=True)
            print("Captured Admin Portal (Desktop)")
            
        except Exception as e:
            print(f"Error capturing screenshots: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    run()