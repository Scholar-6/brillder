import webdriver, { By, Capabilities, until, WebDriver, WebElement } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

import dotenv from 'dotenv';
dotenv.config({ path: "test/e2e/.env" });

describe('main e2e test', () => {
    let driver: WebDriver;
    const waitClick = (element: WebElement) => async () => {
        try {
            await element.click();
            return true;
        } catch {
            return false;
        }
    };

    beforeEach(() => {
        jest.setTimeout(30000);
        if(!process.env.SELENIUM_HOST) {
            let options = new firefox.Options()
            if(process.env.DISABLE_HEADLESS !== "true") {
                options.headless();
            }
            driver = new webdriver.Builder()
                .forBrowser("firefox")
                .setFirefoxOptions(options)
                .build();
        } else {
            driver = new webdriver.Builder()
                .usingServer(process.env.SELENIUM_HOST)
                .withCapabilities(Capabilities.firefox())
                .build();
        }
    })

    it("should run properly", async () => {
        // get the main web page
        console.log("Navigating to:", process.env.SELENIUM_TEST_URL);
        await driver.get(process.env.SELENIUM_TEST_URL);

        const title = await driver.getTitle();
        expect(title).toBeTruthy();

        // LOG IN
        const emailButton = await driver.wait(until.elementLocated(By.className("email-button")), 10000);
        await emailButton.click();

        const emailField = await driver.findElement(By.css("input[type=email].login-field"))
        const passwordField = await driver.findElement(By.css("input[type=password].login-field.password"))

        console.log("Logging in as:", process.env.TEST_EMAIL);
        await emailField.sendKeys(process.env.TEST_EMAIL);
        await passwordField.sendKeys(process.env.TEST_PASSWORD);

        const signInButton = await driver.findElement(By.className("sign-in-button"));
        await driver.wait(waitClick(signInButton), 2000);

        const welcomeBox = await driver.wait(until.elementLocated(By.className("welcome-box")), 7000);
        expect(welcomeBox).toBeTruthy();

        // MANAGE CLASSES
        {
            const manageClassesButton = await driver.findElement(By.className("manage-classes"));
            await manageClassesButton.click();
        }

        // -- CREATE A CLASS
        const createClassButton = await driver.wait(until.elementLocated(By.className("create-class-button")), 2000);
        await createClassButton.click();

        const classNameString = `Test Class (${new Date().toUTCString()})`;
        console.log("Creating class:", classNameString);
        const classNameField = await driver.wait(until.elementLocated(By.css("input[placeholder=\"Class Name\"")), 2000);
        await classNameField.sendKeys(classNameString);

        const classSubjectField = await driver.wait(until.elementLocated(By.css(".dialog-select-container .MuiSelect-root")));
        await classSubjectField.click();

        const compSciSubjectButton = await driver.wait(until.elementLocated(By.css(".MuiPopover-root li[data-value=\"5\"].MuiButtonBase-root.MuiListItem-root")));
        await compSciSubjectButton.click();

        const createButton = await driver.wait(until.elementLocated(By.css(".dialog-footer .yes-button")), 2000);
        await driver.wait(waitClick(createButton), 2000);

        let brickTitleString = "";
        // -- ASSIGN A BRICK TO THE CLASS
        {
            const homeButton = await driver.findElement(By.className("home-button"));
            await driver.wait(waitClick(homeButton), 2000);

            const viewAllButton = await driver.wait(until.elementLocated(By.className("view-item-container")), 2000);
            await driver.wait(waitClick(viewAllButton), 2000);

            const searchField = await driver.wait(until.elementLocated(By.className("search-input")), 2000);
            await driver.wait(waitClick(searchField), 2000);
            await searchField.sendKeys("e2e\n");

            const brickBlock = await driver.wait(until.elementLocated(By.css(".main-brick-container .absolute-container")), 10000);
            await driver.wait(waitClick(brickBlock), 2000);

            const brickTitle = await driver.wait(until.elementLocated(By.className("brick-title")), 10000);
            brickTitleString = await brickTitle.getText();
            console.log("Assigning Brick:", brickTitleString);

            const assignClassButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(.,"Assign Brick")]`)), 5000);
            await driver.wait(waitClick(assignClassButton), 2000);

            const classField = await driver.wait(until.elementLocated(By.css(".dialog-header .MuiInputBase-input")));
            await classField.sendKeys(classNameString);
            
            const classOption = await driver.wait(until.elementLocated(By.xpath(`//li/span[contains(., "${classNameString}")]`)), 2000);
            await driver.wait(waitClick(classOption), 2000);

            const noDeadlineOption = await driver.wait(until.elementLocated(By.xpath(`//label/span[contains(.,"No deadline")]`)), 2000);
            await driver.wait(waitClick(noDeadlineOption), 2000);

            const yesButton = await driver.findElement(By.css(".dialog-footer .yes-button"));
            await yesButton.click();

            const popupAvatar = await driver.wait(until.elementLocated(By.className("MuiListItemAvatar-root")), 2000);
            await driver.wait(waitClick(popupAvatar), 2000);
        }

        // -- INSPECT THE ASSIGNMENTS
        {
            const homeButton = await driver.wait(until.elementLocated(By.className("home-button")), 2000);
            await driver.wait(waitClick(homeButton), 2000);

            const manageClassesButton = await driver.wait(until.elementLocated(By.className("manage-classes")), 2000);
            await driver.wait(waitClick(manageClassesButton), 2000);

            // Need to wait for the classes to show before clicking 'Assignments' tab.
            // await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']`)), 5000);

            // const assignmentsTab = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, "tab-container")]/div[contains(., "Assignments")]`)), 2000)
            // await driver.wait(waitClick(assignmentsTab), 2000);

            const sidebarClass = await driver.wait(until.elementLocated(By.css(`.index-box[title="${classNameString}"]`)), 5000);
            await driver.wait(waitClick(sidebarClass), 2000);

            const assignment = await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' link-description ')]/span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${brickTitleString.toLowerCase()}")]`)));
            expect(assignment).toBeTruthy();
        }

        // -- DELETE THE CLASS
        {
            const studentsTab = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, "tab-container")]/div[contains(., "Students")]`)), 2000)
            await driver.wait(waitClick(studentsTab), 2000);

            const sidebarClass = await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']`)), 5000);
            const removeClassButton = await sidebarClass.findElement(By.className("remove-class"));
            await removeClassButton.click();
            
            console.log("Deleting class:", classNameString);
            const confirmButton = await driver.wait(until.elementLocated(By.className("yes-button")), 2000);
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
