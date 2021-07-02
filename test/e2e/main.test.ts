import webdriver, { By, Capabilities, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

import dotenv from 'dotenv';
import { waitForToken } from "./mailtrap";
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
    const randomId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

    beforeEach(() => {
        jest.setTimeout(100000);
    });

    if(process.env.SELENIUM_HOST) {
        const dateString = new Date().toUTCString();
        it.each([
            {
                browser: "firefox",
                browser_version: "latest",
                os: "Windows",
                os_version: "10",
                build: `dev-Brillder Test ${dateString}`,
                name: "dev-Brillder Firefox Test"
            },
            {
                browser: "chrome",
                browser_version: "latest",
                os: "Windows",
                os_version: "10",
                build: `dev-Brillder Test ${dateString}`,
                name: "dev-Brillder Chrome Test"
            },
            {
                browser: "safari",
                browser_version: "latest",
                os: "OS X",
                os_version: "Big Sur",
                build: `dev-Brillder Test ${dateString}`,
                name: "dev-Brillder Safari Test"
            },
        ])("should run on BrowserStack", async (capabilities) => {
            try {
                driver = new webdriver.Builder()
                    .usingServer(process.env.SELENIUM_HOST)
                    .withCapabilities({
                        ...capabilities,
                        ...capabilities['browser'] && { browserName: capabilities['browser']},
                    })
                    .build();
                await runWithDriver(driver);
                await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Test passed."}}');
            } catch (e) {
                await driver.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "${e.message}"}}`);
                fail(e);
            }
        });
    } else {
        it("should run locally", async () => {
            let options = new firefox.Options()
            if(process.env.DISABLE_HEADLESS !== "true") {
                options.headless();
            }
            driver = new webdriver.Builder()
                .forBrowser("firefox")
                .setFirefoxOptions(options)
                .build();
            await runWithDriver(driver);
        });
    }

    const runWithDriver = async (driver: WebDriver) => {
        // Add a random ID to the mailtrap email so multiple tests can be ran in parallel.
        const mailtrapEmail = process.env.MAILTRAP_EMAIL.replace("@", `+${randomId()}@`);
        // Class Name should be based on the current date and time.
        const classNameString = `Test Class (${new Date().toUTCString()})`;

        // get the main web page
        console.log("Navigating to:", process.env.SELENIUM_TEST_URL);
        await driver.get(process.env.SELENIUM_TEST_URL);

        const title = await driver.getTitle();
        expect(title).toBeTruthy();

        // LOG IN
        {
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
        }

        // MANAGE CLASSES
        {
            const manageClassesButton = await driver.findElement(By.className("manage-classes"));
            await manageClassesButton.click();
        }

        // -- CREATE A CLASS
        {   
            const createClassButton = await driver.wait(until.elementLocated(By.className("create-class-button")), 2000);
            await createClassButton.click();

            console.log("Creating class:", classNameString);
            const classNameField = await driver.wait(until.elementLocated(By.css("input[placeholder=\"Class Name\"")), 2000);
            await classNameField.sendKeys(classNameString);

            const classSubjectField = await driver.wait(until.elementLocated(By.css(".dialog-select-container .MuiSelect-root")));
            await classSubjectField.click();

            const compSciSubjectButton = await driver.wait(until.elementLocated(By.css(".MuiPopover-root li[data-value=\"5\"].MuiButtonBase-root.MuiListItem-root")));
            await compSciSubjectButton.click();

            const createButton = await driver.wait(until.elementLocated(By.css(".dialog-footer .yes-button")), 2000);
            await driver.wait(waitClick(createButton), 2000);
        }

        // -- INVITE A STUDENT TO THE CLASS
        const inviteTime = new Date();
        {
            const studentsTab = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, "tab-container")]/div[contains(., "Students")]`)), 2000)
            await driver.wait(waitClick(studentsTab), 2000);

            const sidebarClass = await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']/label`)), 5000);
            await driver.wait(waitClick(sidebarClass), 2000);

            const inviteStudentsButton = await driver.wait(until.elementLocated(By.className("icon-container")), 2000);
            await inviteStudentsButton.click();

            const emailField = await driver.wait(until.elementLocated(By.css(".dialog-header .MuiInputBase-input")), 2000);
            await emailField.sendKeys(mailtrapEmail);
            await emailField.sendKeys(Key.ENTER);

            const sendButton = await driver.wait(until.elementLocated(By.className("yes-button")), 2000);
            await sendButton.click();

            await driver.wait(until.elementLocated(By.className("dialog-header")), 2000);
            // dismiss popup
            await driver.wait(async () => {
                try {
                    await driver.actions()
                        .sendKeys(Key.ESCAPE)
                        .perform();
                    
                    const moreButton = await driver.findElement(By.className("more-button"));
                    await driver.wait(waitClick(moreButton), 1000);
                    return true;
                } catch (e) {
                    return false;
                }
            }, 10000);
        }

        // SIGN OUT
        {
            const logoutButton = await driver.wait(until.elementLocated(By.xpath(`//span[contains(., "Logout")]`)), 2000);
            await driver.wait(waitClick(logoutButton), 2000);

            const yesButton = await driver.wait(until.elementLocated(By.className("yes-button")), 2000);
            await driver.wait(waitClick(yesButton), 2000);
        }

        // GET TOKEN FROM MAILTRAP
        {
            const token = await waitForToken(mailtrapEmail, inviteTime);
            console.log("Received token:", token);
            await driver.get(token);
        }

        // ACTIVATE ACCOUNT
        {
            const passwordField = await driver.wait(until.elementLocated(By.css("input.login-field.password")), 5000);
            await passwordField.sendKeys(process.env.TEST_PASSWORD);

            const signInButton = await driver.findElement(By.className("sign-in-button"));
            await signInButton.click();

            const bottomButton = await driver.wait(until.elementLocated(By.className("bottom-button")), 2000);
            await bottomButton.click();

            const nextButton = await driver.wait(until.elementLocated(By.className("user-preference-next")), 2000);
            await nextButton.click();
        }

        // -- ONBOARDING
        {
            const firstNameField = await driver.wait(until.elementLocated(By.xpath(`//input[@placeholder='First Name']`)), 2000);
            const lastNameField = await driver.wait(until.elementLocated(By.xpath(`//input[@placeholder='Last Name']`)), 2000);

            firstNameField.sendKeys("Test");
            lastNameField.sendKeys("User");

            const submitButton = await driver.findElement(By.className("submit-button"));
            await submitButton.click();

            const arrowButton = await driver.wait(until.elementLocated(By.className("arrow-button")), 2000);
            await arrowButton.click();

            const subjectNextButton = await driver.wait(until.elementLocated(By.className("next-button")), 2000);
            await subjectNextButton.click();
        }

        // -- ACCEPT THE INVITATION
        {
            const acceptButton = await driver.wait(until.elementLocated(By.css(".btn.btn-md.b-green")), 2000);
            await acceptButton.click();

            const assignmentsText = await driver.wait(until.elementLocated(By.className("brick-row-title")), 2000);
        }

        // SIGN OUT
        {
            const moreButton = await driver.findElement(By.className("more-button"));
            await driver.wait(waitClick(moreButton), 1000);

            const logoutButton = await driver.wait(until.elementLocated(By.xpath(`//span[contains(., "Logout")]`)), 2000);
            await driver.wait(waitClick(logoutButton), 2000);

            const yesButton = await driver.wait(until.elementLocated(By.className("yes-button")), 2000);
            await driver.wait(waitClick(yesButton), 2000);
        }

        // LOG IN
        {
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
        }

        let brickTitleString = "";
        // -- ASSIGN A BRICK TO THE CLASS
        {
            const viewAllButton = await driver.wait(until.elementLocated(By.className("view-item-container")), 2000);
            await driver.wait(waitClick(viewAllButton), 2000);

            const searchField = await driver.wait(until.elementLocated(By.className("search-input")), 2000);
            await driver.wait(waitClick(searchField), 2000);
            await searchField.sendKeys("e2e" + Key.ENTER);

            const brickBlock = await driver.wait(until.elementLocated(By.css(".main-brick-container .absolute-container")), 10000);
            await driver.wait(waitClick(brickBlock), 2000);

            const brickTitle = await driver.wait(until.elementLocated(By.className("brick-title")), 10000);
            brickTitleString = await brickTitle.getText();
            console.log("Assigning Brick:", brickTitleString);

            const assignClassButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(.,"Assign Brick")]`)), 5000);
            await driver.wait(waitClick(assignClassButton), 2000);

            const classField = await driver.wait(until.elementLocated(By.css(".dialog-header .MuiInputBase-input")));
            await classField.sendKeys(classNameString);
            
            const classOption = await driver.wait(until.elementLocated(By.xpath(`//li/div/span[contains(., "${classNameString}")]`)), 2000);
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

            // check that class has disappeared from sidebar.
            expect(driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), ' student-drop-item ') and label/span/text()='${classNameString}']`)), 5000)).rejects.toThrow();
        }

        // -- DELETE TEMPORARY USER
        {
            const moreButton = await driver.findElement(By.className("more-button"));
            await driver.wait(waitClick(moreButton), 1000);

            const manageUsersButton = await driver.wait(until.elementLocated(By.xpath(`//span[contains(., "Manage Users")]`)), 2000);
            await driver.wait(waitClick(manageUsersButton), 2000);

            const searchField = await driver.wait(until.elementLocated(By.className("search-input")), 2000);
            await driver.wait(waitClick(searchField), 2000);
            await searchField.sendKeys("mailtrap" + Key.ENTER);

            const deleteButton = await driver.wait(until.elementLocated(By.xpath(`//tr[contains(., "${mailtrapEmail}")]//div[contains(@class, 'delete-button')]`)), 2000);
            await driver.wait(waitClick(deleteButton), 2000);

            const yesButton = await driver.wait(until.elementLocated(By.className("yes-button")), 2000);
            await driver.wait(waitClick(yesButton), 2000);
        }
    };

    afterEach(async () => {
        if(process.env.KEEP_OPEN !== "true"
        || process.env.SELENIUM_HOST) { // only keep the browser open locally - possible DoS if we leave it open remotely.
            console.log("Exiting browser.");
            await driver.quit();
        }
    })
});
