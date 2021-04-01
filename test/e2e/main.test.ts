import webdriver, { By, Capabilities, until, WebDriver, WebElement } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

import dotenv from 'dotenv';
dotenv.config({ path: "test/e2e/.env" });

describe('main e2e test', () => {
    let driver: WebDriver;
    const delayAfterClick = 1000, waitClick = (element: WebElement) => async () => {
        try {
            await element.click();
            return true;
        } catch {
            return false;
        }
    };

    const capabilities = {
          
        // 'browserName': 'iPhone',
        // 'device': 'iPhone XS',
        // 'realMobile': 'true',
        // 'os_version': '13',
        // 'name' : "lindsaymacvean1's First Test"
        'browserName': 'Chrome',
        'browser_version': 'latest',
        'os': 'Windows',
        'os_version': '10'
        
    };

    beforeEach(() => {
        jest.setTimeout(60000);
        if(process.env.SELENIUM_HOST) {
            driver = new webdriver.Builder()
                .usingServer(process.env.SELENIUM_HOST)
                .withCapabilities(capabilities)
                .build();
        } else {
            let options = new firefox.Options()
            if(process.env.DISABLE_HEADLESS !== "true") {
                options.headless();
            }
            driver = new webdriver.Builder()
                .forBrowser("firefox")
                .setFirefoxOptions(options)
                .build();
        }
    })

    it("should assign bricks to students as a teacher", async () => {

        
        // -- VISIT URL
        console.log("Navigating to:", process.env.SELENIUM_TEST_URL);
        {
            await driver.get(process.env.SELENIUM_TEST_URL);

            // Validate arrived at page by title
            await expect(driver.getTitle()).resolves.toBeTruthy();
        }

        // -- LOG IN
        console.log("Logging in as:", process.env.TEST_EMAIL);
        {
            // Select log in with email
            const emailButton = await driver.wait(until.elementLocated(By.className("email-button")), delayAfterClick);
            await emailButton.click();

            // Enter details
            const emailField = await driver.findElement(By.css("input[type=email].login-field"));
            await emailField.sendKeys(process.env.TEST_EMAIL);
            const passwordField = await driver.findElement(By.css("input[type=password].login-field.password"))
            await passwordField.sendKeys(process.env.TEST_PASSWORD);

            // Submit
            const signInButton = await driver.findElement(By.className("sign-in-button"));
            await driver.wait(waitClick(signInButton), delayAfterClick);

            // Validate welcome box exists on left (does not check details etc.)
            const welcomeBox = await driver.wait(until.elementLocated(By.className("welcome-box")), 7000);
            expect(welcomeBox).toBeTruthy();
        }

        // -- CREATE A CLASS
        const classNameString = `Test Class (${new Date().toUTCString()})`;
        console.log("Creating class:", classNameString);
        {
            // Manage Classes Button
            const manageClassesButton = await driver.findElement(By.className("manage-classes"));
            await manageClassesButton.click();

            // Open Create class modal window
            const createClassButton = await driver.wait(until.elementLocated(By.className("create-class-button")), delayAfterClick);
            await createClassButton.click();

            // Input Class Name
            const classNameField = await driver.wait(until.elementLocated(By.css("input[placeholder=\"Class Name\"")), delayAfterClick);
            await classNameField.sendKeys(classNameString);

            // Click the subject select dropdown
            const classSubjectField = await driver.wait(until.elementLocated(By.css(".dialog-select-container .MuiSelect-root")));
            await classSubjectField.click();

            // Select first subject
            const compSciSubjectButton = await driver.wait(until.elementLocated(By.css(".MuiPopover-root li[tabindex=\"0\"]")));
            await compSciSubjectButton.click();

            // Submit create class modal window
            const createButton = await driver.wait(until.elementLocated(By.css(".dialog-footer .yes-button")), delayAfterClick);
            await driver.wait(waitClick(createButton), delayAfterClick);

            // Return to the home screen
            const homeButton = await driver.findElement(By.className("home-button"));
            await driver.wait(waitClick(homeButton), delayAfterClick);
        }
        
        // -- ASSIGN A BRICK TO THE CLASS
        let brickTitleString = "";
        console.log("Assigning a brick");
        {
            // Go to view all page
            const viewAllButton = await driver.wait(until.elementLocated(By.className("view-item-container")), delayAfterClick);
            await driver.wait(waitClick(viewAllButton), delayAfterClick);

            // Click assign a new brick button .assign-button-container div.btn
            // Focus on input input.MuiInputBase-input
            // 


            const searchField = await driver.wait(until.elementLocated(By.className("search-input")), delayAfterClick);
            await driver.wait(waitClick(searchField), delayAfterClick);
            await searchField.sendKeys("e2e\n");

            const brickBlock = await driver.wait(until.elementLocated(By.css(".main-brick-container .absolute-container")), delayAfterClick);
            await driver.wait(waitClick(brickBlock), delayAfterClick);

            const brickTitle = await driver.wait(until.elementLocated(By.className("brick-title")), delayAfterClick);
            brickTitleString = await brickTitle.getText();
            console.log("Assigning Brick:", brickTitleString);

            const assignClassButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(.,"Assign Brick")]`)), 5000);
            await driver.wait(waitClick(assignClassButton), delayAfterClick);

            const classField = await driver.wait(until.elementLocated(By.css(".dialog-header .MuiInputBase-input")));
            await classField.sendKeys(classNameString);
            
            const classOption = await driver.wait(until.elementLocated(By.xpath(`//li/span[contains(., "${classNameString}")]`)), delayAfterClick);
            await driver.wait(waitClick(classOption), delayAfterClick);

            const noDeadlineOption = await driver.wait(until.elementLocated(By.xpath(`//label/span[contains(.,"No deadline")]`)), delayAfterClick);
            await driver.wait(waitClick(noDeadlineOption), delayAfterClick);

            const yesButton = await driver.findElement(By.css(".dialog-footer .yes-button"));
            await yesButton.click();

            const popupAvatar = await driver.wait(until.elementLocated(By.className("MuiListItemAvatar-root")), delayAfterClick);
            await driver.wait(waitClick(popupAvatar), delayAfterClick);

            // Return to home screen
            const homeButton = await driver.wait(until.elementLocated(By.className("home-button")), delayAfterClick);
            await driver.wait(waitClick(homeButton), delayAfterClick);
        }

        // -- INSPECT THE ASSIGNMENTS
        console.log("Assigning a brick");
        {
            const manageClassesButton = await driver.wait(until.elementLocated(By.className("manage-classes")), delayAfterClick);
            await driver.wait(waitClick(manageClassesButton), delayAfterClick);

            // Need to wait for the classes to show before clicking 'Assignments' tab.
            // await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']`)), 5000);

            // const assignmentsTab = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, "tab-container")]/div[contains(., "Assignments")]`)), delayAfterClick)
            // await driver.wait(waitClick(assignmentsTab), delayAfterClick);

            const sidebarClass = await driver.wait(until.elementLocated(By.css(`.index-box[title="${classNameString}"]`)), 5000);
            await driver.wait(waitClick(sidebarClass), delayAfterClick);

            const assignment = await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' link-description ')]/span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${brickTitleString.toLowerCase()}")]`)));
            expect(assignment).toBeTruthy();
        }

        // -- DELETE THE CLASS
        {
            const studentsTab = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, "tab-container")]/div[contains(., "Students")]`)), delayAfterClick)
            await driver.wait(waitClick(studentsTab), delayAfterClick);

            const sidebarClass = await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']`)), 5000);
            const removeClassButton = await sidebarClass.findElement(By.className("remove-class"));
            await removeClassButton.click();
            
            console.log("Deleting class:", classNameString);
            const confirmButton = await driver.wait(until.elementLocated(By.className("yes-button")), delayAfterClick);
            await confirmButton.click();
        }

        // check that class has disappeared from sidebar.
        expect(driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']`)), 5000)).rejects.toThrow();
    });

    afterEach(async () => {
        if(process.env.KEEP_OPEN !== "true"
        && !process.env.SELENIUM_HOST) { // only keep the browser open locally - possible DoS if we leave it open remotely.
            console.log("Exiting browser.");
            await driver.quit();
        }
    })
});
